import es2.logs.singleton.LogConfig;
import es2.logs.factory.*;

public class Main {
    public static void main(String[] args) {
        try{
            LogConfig config = LogConfig.getInstance();

            LogMessage log1 = LogFactory.createLog("INFO", "Debugs do Sprint 1 modulos 1/2");
            LogMessage log2 = LogFactory.createLog("ERROR", "Bug na matriz");
            LogMessage log3 = LogFactory.createLog("DEBUG", "Isto é um debug normal");
            LogMessage log4 = LogFactory.createLog("WARNING", "Se calhar os println podiam estar melhor...");

            System.out.println(log1.format());
            System.out.println(log2.format());
            System.out.println(log3.format());
            System.out.println(log4.format());
        }catch(Exception e){
            e.printStackTrace();
        }
    }
}