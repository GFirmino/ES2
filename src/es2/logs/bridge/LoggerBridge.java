package es2.logs.bridge;

import es2.logs.exception.InvalidArgumentException;
import es2.logs.factory.LogMessage;

public class LoggerBridge {
    private LogDestination destination;

    public LoggerBridge(LogDestination destination) throws InvalidArgumentException {
        if(destination == null){
            throw new InvalidArgumentException("Destination cannot be null");
        }

        this.destination = destination;
    }

    public void log(LogMessage message) throws InvalidArgumentException {
        if(message == null){
            throw new InvalidArgumentException("Message cannot be null");
        }

        destination.send(message.format());
    }

    public void log(String message) throws Exception {
        if(message == null){
            throw new InvalidArgumentException("Message cannot be null");
        }

        destination.send(message);
    }

    public void setDestination(LogDestination destination) throws InvalidArgumentException {
        if(destination == null){
            throw new InvalidArgumentException("Destination cannot be null");
        }

        this.destination = destination;
    }
}