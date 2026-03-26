package es2.logs.bridge;

public class DatabaseDestination implements LogDestination {
    private final int id;
    private boolean inUse;

    public DatabaseDestination(int id) {
        this.id = id;
        this.inUse = false;
    }

    @Override
    public void send(String formattedMessage) {
        System.out.println("[Database #" + id + "] " + formattedMessage);
    }

    public int getId() {
        return id;
    }

    public boolean isInUse() {
        return inUse;
    }

    public void markAsInUse() {
        this.inUse = true;
    }

    public void reset() {
        this.inUse = false;
    }
}