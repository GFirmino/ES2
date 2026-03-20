import es2.logs.singleton.LogConfig;
import es2.logs.factory.*;
import es2.logs.bridge.*;

public class Main {
    public static void main(String[] args) {
        try{
            LogConfig config = LogConfig.getInstance();
            LogMessage log1 = LogFactory.createLog("INFO", "Isto é um INFO debug na consola");
            LogMessage log2 = LogFactory.createLog("ERROR", "Isto é um ERROR debug no ficheiro");
            LogMessage log3 = LogFactory.createLog("ERROR", "Isto é outro ERROR debug no ficheiro");

            LoggerBridge logger = new LoggerBridge(new ConsoleDestination());
            logger.log(log1);

            logger.setDestination(new FileDestination());
            logger.log(log2);
            logger.log(log3);
        }catch(Exception e){
            e.printStackTrace();
        }
    }
}