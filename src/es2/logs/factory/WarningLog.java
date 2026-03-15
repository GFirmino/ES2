package es2.logs.factory;

public class WarningLog extends LogMessage{
    public WarningLog(String message){
        super(message);
    }

    @Override
    public String getLevel(){
        return "WARN";
    }
}