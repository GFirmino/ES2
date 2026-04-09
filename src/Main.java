import es2.logs.bridge.ConsoleDestination;
import es2.logs.bridge.FileDestination;
import es2.logs.bridge.LogStateManager;
import es2.logs.bridge.LoggerBridge;
import es2.logs.composite.LogCategory;
import es2.logs.composite.LogLeaf;
import es2.logs.exception.UndefinedDestinationException;
import es2.logs.extension.AdminAlertExtension;
import es2.logs.extension.ErrorPatternAnalysisExtension;
import es2.logs.extension.MonitoringExtension;
import es2.logs.factory.LogFactory;
import es2.logs.objectpool.DatabaseDestinationPool;
import es2.logs.objectpool.RemoteSystemDestinationPool;
import es2.logs.singleton.LogConfig;

import java.util.Arrays;
import java.util.LinkedHashSet;

public class Main {
    public static void main(String[] args) {
        try {
            LogConfig config = LogConfig.getInstance();
            LogCategory sistema = buildLogTree();

            LoggerBridge logger = new LoggerBridge();
            FileDestination fileDestination = new FileDestination("logs");
            DatabaseDestinationPool databasePool = new DatabaseDestinationPool(1);
            RemoteSystemDestinationPool remotePool = new RemoteSystemDestinationPool(2);
            LogStateManager stateManager = new LogStateManager();

            logger.registerDestination("console", new ConsoleDestination());
            logger.registerDestination("file", fileDestination);
            logger.registerPool("database", databasePool);
            logger.registerPool("remote", remotePool);

            printSection("CENARIO 1 - MULTIPLOS DESTINOS");
            logger.activateDestination("console");
            logger.activateDestination("file");
            logger.activateDestination("database");
            logger.activateDestination("remote");

            logger.beginSession();
            try {
                sistema.show("", logger);
            } finally {
                logger.endSession();
            }

            System.out.println("Ficheiro de log: " + fileDestination.getFilePath());
            System.out.println("Database pool disponiveis: " + databasePool.getAvailableCount());
            System.out.println("Database pool em uso: " + databasePool.getInUseCount());
            System.out.println("Remote pool disponiveis: " + remotePool.getAvailableCount());
            System.out.println("Remote pool em uso: " + remotePool.getInUseCount());

            printSection("CENARIO 2 - FILTROS POR NIVEL, TEXTO E CATEGORIA");
            logger.clearActiveDestinations();
            logger.activateDestination("console");
            logger.setActiveLevels(levels("ERROR", "WARN"));
            logger.clearFilters();
            logger.addTextFilter("falha");
            logger.addCategoryFilter("base de dados");
            printLoggerState(logger, config);
            sistema.show("", logger);

            printSection("CENARIO 3 - GUARDAR E RESTAURAR ESTADO");
            logger.clearFilters();
            logger.clearActiveDestinations();
            logger.activateDestination("console");
            logger.activateDestination("file");
            logger.setActiveLevels(levels("DEBUG", "INFO", "WARN", "ERROR"));
            config.setMessageFormat("[%timestamp%][%level%] %message%");
            stateManager.saveSnapshot("A", logger);
            System.out.println("Snapshots guardados: " + stateManager.getSnapshotNames());
            printLoggerState(logger, config);

            logger.clearActiveDestinations();
            logger.activateDestination("database");
            logger.activateDestination("remote");
            logger.setActiveLevels(levels("ERROR"));
            logger.addTextFilter("falha");
            logger.addCategoryFilter("base de dados");
            config.setMessageFormat("[CUSTOM][%level%] %message%");
            System.out.println("Estado alterado antes do restauro:");
            printLoggerState(logger, config);

            logger.beginSession();
            try {
                sistema.show("", logger);
            } finally {
                logger.endSession();
            }

            stateManager.restoreSnapshot("A", logger);
            System.out.println("Estado restaurado a partir do snapshot A:");
            printLoggerState(logger, config);
            sistema.show("", logger);

            printSection("CENARIO 4 - EXTENSOES DINAMICAS");
            logger.clearFilters();
            logger.clearActiveDestinations();
            logger.activateDestination("console");
            logger.setActiveLevels(levels("DEBUG", "INFO", "WARN", "ERROR"));

            AdminAlertExtension adminAlert = new AdminAlertExtension("admin@empresa.pt");
            MonitoringExtension monitoring = new MonitoringExtension();
            ErrorPatternAnalysisExtension patternAnalysis = new ErrorPatternAnalysisExtension();

            logger.registerExtension(adminAlert);
            logger.registerExtension(monitoring);
            logger.registerExtension(patternAnalysis);

            logger.log(LogFactory.createLog("INFO", "Heartbeat do sistema"), "Sistema > Monitorizacao");
            logger.log(LogFactory.createLog("ERROR", "Falha repetida no servico remoto"), "Sistema > Monitorizacao");
            logger.log(LogFactory.createLog("ERROR", "Falha repetida no servico remoto"), "Sistema > Monitorizacao");

            System.out.println("Extensoes ativas: " + logger.getRegisteredExtensionNames());
            System.out.println("Contadores de monitorizacao: " + monitoring.getCounters());
            System.out.println("Padroes de erro detetados: " + patternAnalysis.getOccurrences());

            printSection("CENARIO 5 - REMOVER EXTENSAO SEM AFETAR O NUCLEO");
            logger.unregisterExtension(patternAnalysis.getName());
            logger.log(LogFactory.createLog("ERROR", "Falha repetida no servico remoto"), "Sistema > Monitorizacao");
            System.out.println("Extensoes ativas apos remocao: " + logger.getRegisteredExtensionNames());
            System.out.println("Contadores de monitorizacao apos remocao: " + monitoring.getCounters());

            printSection("CENARIO 6 - RESTAURO COM DESTINO EM FALTA");
            logger.clearFilters();
            logger.clearActiveDestinations();
            logger.activateDestination("remote");
            stateManager.saveSnapshot("B", logger);
            logger.unregisterDestination("remote");

            try {
                stateManager.restoreSnapshot("B", logger);
            } catch (UndefinedDestinationException e) {
                System.out.println("Excecao esperada ao restaurar snapshot B: " + e.getMessage());
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static LogCategory buildLogTree() throws Exception {
        LogCategory sistema = new LogCategory("Sistema");

        LogCategory autenticacao = new LogCategory("Autenticacao");
        autenticacao.setMaxChildrenSize(2);

        LogCategory baseDados = new LogCategory("Base de Dados");
        baseDados.setMaxChildrenSize(2);

        LogCategory interfaceGrafica = new LogCategory("Interface");
        interfaceGrafica.setMaxChildrenSize(1);

        autenticacao.add(new LogLeaf(LogFactory.createLog("INFO", "Utilizador autenticado")));
        autenticacao.add(new LogLeaf(LogFactory.createLog("WARNING", "Password incorreta")));

        baseDados.add(new LogLeaf(LogFactory.createLog("DEBUG", "Query executada com sucesso")));
        baseDados.add(new LogLeaf(LogFactory.createLog("ERROR", "Falha na ligacao a Base de Dados")));

        interfaceGrafica.add(new LogLeaf(LogFactory.createLog("INFO", "Foi aberto o ecra de detalhes")));

        sistema.add(autenticacao);
        sistema.add(baseDados);
        sistema.add(interfaceGrafica);
        return sistema;
    }

    private static LinkedHashSet<String> levels(String... values) {
        return new LinkedHashSet<>(Arrays.asList(values));
    }

    private static void printSection(String title) {
        System.out.println();
        System.out.println("=== " + title + " ===");
    }

    private static void printLoggerState(LoggerBridge logger, LogConfig config) {
        System.out.println("Destinos ativos: " + logger.getActiveDestinationIds());
        System.out.println("Niveis ativos: " + logger.getActiveLevels());
        System.out.println("Filtros de texto: " + logger.getTextFilters());
        System.out.println("Filtros de categoria: " + logger.getCategoryFilters());
        System.out.println("Formato atual: " + config.getMessageFormat());
    }
}
