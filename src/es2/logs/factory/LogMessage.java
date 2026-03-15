package es2.logs.factory;
import es2.logs.singleton.LogConfig;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public abstract class LogMessage {
    protected String message;

    public LogMessage(String message){
        this.message = message;
    }

    public abstract String getLevel();

    protected String getMessage(){
        return this.message;
    }

    public void setMessage(String message){
        this.message = message;
    }

    public String format(){
        LogConfig config = LogConfig.getInstance();
        String format    = config.getMessageFormat();

        LocalDateTime now           = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        String dtime                = formatter.format(now);

        if (!config.isValidFormat(format)) {
            format = config.getDefaultFormat();
        }

        return format
                .replace("%timestamp%", dtime)
                .replace("%level%", getLevel() != null ? getLevel() : "UNKNOWN")
                .replace("%message%", getMessage() !=  null ? getMessage() : "");
    }
}