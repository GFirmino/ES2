import es2.logs.singleton.LogConfig;
import es2.logs.factory.*;
import es2.logs.bridge.*;
import es2.logs.composite.*;
import es2.logs.objectpool.*;

public class Main {
    public static void main(String[] args) {
        try {
            LogConfig config = LogConfig.getInstance();

            LogCategory sistema = new LogCategory("Sistema");

            LogCategory autenticacao = new LogCategory("Autenticação");
            autenticacao.setMaxChildrenSize(2);

            LogCategory baseDados = new LogCategory("Base de Dados");
            baseDados.setMaxChildrenSize(2);

            LogCategory interfaceGrafica = new LogCategory("Interface");
            interfaceGrafica.setMaxChildrenSize(1);

            autenticacao.add(new LogLeaf(LogFactory.createLog("INFO", "Utilizador autenticado")));
            autenticacao.add(new LogLeaf(LogFactory.createLog("WARNING", "Password incorreta")));

            baseDados.add(new LogLeaf(LogFactory.createLog("DEBUG", "Query executada com sucesso")));
            baseDados.add(new LogLeaf(LogFactory.createLog("ERROR", "Falha na ligação à Base de Dados")));

            interfaceGrafica.add(new LogLeaf(LogFactory.createLog("INFO", "Foi aberto o ecrã de detalhes")));

            sistema.add(autenticacao);
            sistema.add(baseDados);
            sistema.add(interfaceGrafica);

            // Consola
            System.out.println("=== LOGS PARA CONSOLA ===");
            LoggerBridge consoleLogger = new LoggerBridge(new ConsoleDestination());
            sistema.show("", consoleLogger);

            // Ficheiro
            System.out.println("\n=== LOGS PARA FICHEIRO ===");
            LoggerBridge fileLogger = new LoggerBridge(new FileDestination());
            sistema.show("", fileLogger);
            System.out.println("Ficheiro de log criado/atualizado na pasta logs");

            // Base de Dados com Object Pool
            System.out.println("\n=== LOGS PARA BASE DE DADOS (POOL) ===");
            DatabaseDestinationPool dbPool = new DatabaseDestinationPool(1);
            LoggerBridge dbLogger = new LoggerBridge(dbPool);
            //LoggerBridge dbLogger2 = new LoggerBridge(dbPool); //Se removermos os comentários, vai dar erro pois o size é 1

            dbLogger.beginSession();
            try {
                sistema.show("", dbLogger);
                //sistema.show("", dbLogger2);
            } finally {
                dbLogger.endSession();
            }

            System.out.println("Database pool disponíveis: " + dbPool.getAvailableCount());
            System.out.println("Database pool em uso: " + dbPool.getInUseCount());

            // Serviço Remoto com Object Pool
            System.out.println("\n=== LOGS PARA SERVIÇO REMOTO (POOL) ===");
            RemoteSystemDestinationPool remotePool = new RemoteSystemDestinationPool(2);
            LoggerBridge remoteLogger = new LoggerBridge(remotePool);

            remoteLogger.beginSession();
            try {
                sistema.show("", remoteLogger);
            } finally {
                remoteLogger.endSession();
            }

            System.out.println("Remote pool disponíveis: " + remotePool.getAvailableCount());
            System.out.println("Remote pool em uso: " + remotePool.getInUseCount());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}