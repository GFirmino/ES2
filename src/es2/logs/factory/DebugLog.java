package es2.logs.factory;

public class DebugLog extends LogMessage{
    public DebugLog(String message){
        super(message);
    }

    @Override
    public String getLevel(){
        return "DEBUG";
    }
}