import es2.logs.singleton.LogConfig;
import es2.logs.factory.*;
import es2.logs.bridge.*;
import es2.logs.composite.*;

public class Main {
    public static void main(String[] args) {
        try{
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

            LoggerBridge logger = new LoggerBridge(new ConsoleDestination());
            sistema.show("", logger);

            logger.setDestination(new FileDestination());
            sistema.show("", logger);
        }catch(Exception e){
            e.printStackTrace();
        }
    }
}