package es2.logs.factory;

public class ErrorLog extends LogMessage{
    public ErrorLog(String message){
        super(message);
    }

    @Override
    public String getLevel(){
        return "ERROR";
    }
}