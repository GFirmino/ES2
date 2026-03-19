package es2.logs.bridge;

public interface LogDestination {
    void send(String formattedMessage);
}