package es2.logs.objectpool;

import java.util.ArrayList;
import java.util.List;

import es2.logs.bridge.LogDestination;
import es2.logs.bridge.RemoteSystemDestination;

public class RemoteSystemDestinationPool implements DestinationPool {
    private final List<RemoteSystemDestination> available;
    private final List<RemoteSystemDestination> inUse;

    public RemoteSystemDestinationPool(int size) {
        this.available = new ArrayList<>();
        this.inUse = new ArrayList<>();

        for (int i = 1; i <= size; i++) {
            available.add(new RemoteSystemDestination(i));
        }
    }

    @Override
    public synchronized LogDestination acquire() {
        if (available.isEmpty()) {
            throw new RuntimeException("Não existem RemoteServiceDestination disponíveis no pool.");
        }

        RemoteSystemDestination destination = available.remove(0);
        destination.markAsInUse();
        inUse.add(destination);
        return destination;
    }

    @Override
    public synchronized void release(LogDestination destination) {
        if (destination instanceof RemoteSystemDestination remoteDestination) {
            inUse.remove(remoteDestination);
            remoteDestination.reset();
            available.add(remoteDestination);
        }
    }

    public int getAvailableCount() {
        return available.size();
    }

    public int getInUseCount() {
        return inUse.size();
    }
}
