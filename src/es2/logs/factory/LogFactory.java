package es2.logs.factory;

import es2.logs.exception.UndefinedLogException;

public class LogFactory {
    public static LogMessage createLog(String type, String message) throws UndefinedLogException {
        switch(type.toUpperCase()){
            case "ERROR":
                return new ErrorLog(message);
            case "WARNING":
                return new WarningLog(message);
            case "INFO":
                return new InfoLog(message);
            case "DEBUG":
                return new DebugLog(message);
            default:
                throw new UndefinedLogException("Invalid log type -> " + type);
        }
    }
}