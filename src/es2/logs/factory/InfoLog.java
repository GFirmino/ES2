package es2.logs.factory;

public class InfoLog extends LogMessage{
    public InfoLog(String message){
        super(message);
    }

    @Override
    public String getLevel(){
        return "INFO ";
    }
}