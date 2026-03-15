package es2.logs.singleton;

import es2.logs.exception.InvalidArgumentException;

public class LogConfig {
    private String logLevel;
    private String destination;
    private String messageFormat;

    private static final String DEFAULT_FORMAT = "[%timestamp%][%level%] %message%";

    private LogConfig(){
        this.logLevel      = "INFO";
        this.destination   = "CONSOLE";
        this.messageFormat = DEFAULT_FORMAT;
    }

    private static class Holder {
        private static final LogConfig INSTANCE = new LogConfig();
    }

    public static LogConfig getInstance(){
        return Holder.INSTANCE;
    }

    public String getLogLevel(){
        return this.logLevel;
    }

    public void setLogLevel(String logLevel) throws InvalidArgumentException {
        if (logLevel.isEmpty()){
            throw new InvalidArgumentException("logLevel cannot be null");
        }

        this.logLevel = logLevel;
    }

    public String getDestination(){
        return this.destination;
    }

    public void setDestination(String destination) throws InvalidArgumentException {
        if (destination.isEmpty()){
            throw new InvalidArgumentException("destination cannot be null");
        }

        this.destination = destination;
    }

    public String getMessageFormat(){
        return this.messageFormat;
    }

    public void setMessageFormat(String messageFormat) {
        if (isValidFormat(messageFormat)) {
            this.messageFormat = messageFormat;
            return;
        }

        this.messageFormat = DEFAULT_FORMAT;
    }

    public String getDefaultFormat() {
        return DEFAULT_FORMAT;
    }

    public boolean isValidFormat(String format) {
        return format != null
                && !format.isBlank()
                && format.contains("%message%");
    }
}