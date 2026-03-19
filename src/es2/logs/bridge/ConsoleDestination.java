package es2.logs.bridge;

public class ConsoleDestination implements LogDestination {
    @Override
    public void send(String formattedMessage){
        System.out.println(formattedMessage);
    }
}