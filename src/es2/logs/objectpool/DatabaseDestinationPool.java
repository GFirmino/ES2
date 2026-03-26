package es2.logs.objectpool;

import es2.logs.bridge.DatabaseDestination;
import es2.logs.bridge.LogDestination;

import java.util.ArrayList;
import java.util.List;

public class DatabaseDestinationPool implements DestinationPool {
    private final List<DatabaseDestination> available;
    private final List<DatabaseDestination> inUse;

    public DatabaseDestinationPool(int size) {
        this.available = new ArrayList<>();
        this.inUse = new ArrayList<>();

        for (int i = 1; i <= size; i++) {
            available.add(new DatabaseDestination(i));
        }
    }

    @Override
    public synchronized LogDestination acquire() {
        if (available.isEmpty()) {
            throw new RuntimeException("Não existem DatabaseDestination disponíveis no pool.");
        }

        DatabaseDestination destination = available.remove(0);
        destination.markAsInUse();
        inUse.add(destination);
        return destination;
    }

    @Override
    public synchronized void release(LogDestination destination) {
        if (destination instanceof DatabaseDestination dbDestination) {
            inUse.remove(dbDestination);
            dbDestination.reset();
            available.add(dbDestination);
        }
    }

    public int getAvailableCount() {
        return available.size();
    }

    public int getInUseCount() {
        return inUse.size();
    }
}
