package es2.logs.bridge;

import es2.logs.exception.InvalidArgumentException;
import es2.logs.factory.LogMessage;
import es2.logs.objectpool.DestinationPool;

public class LoggerBridge {
    private LogDestination destination;
    private DestinationPool pool;
    private LogDestination activePooledDestination;

    public LoggerBridge(LogDestination destination) throws InvalidArgumentException {
        if (destination == null) {
            throw new InvalidArgumentException("Destination cannot be null");
        }

        this.destination = destination;
        this.pool = null;
        this.activePooledDestination = null;
    }

    public LoggerBridge(DestinationPool pool) throws InvalidArgumentException {
        if (pool == null) {
            throw new InvalidArgumentException("DestinationPool cannot be null");
        }

        this.pool = pool;
        this.destination = null;
        this.activePooledDestination = null;
    }

    public void log(LogMessage message) throws Exception {
        if (message == null) {
            throw new InvalidArgumentException("Message cannot be null");
        }

        send(message.format());
    }

    public void log(String message) throws Exception {
        if (message == null) {
            throw new InvalidArgumentException("Message cannot be null");
        }

        send(message);
    }

    private void send(String message) throws Exception {
        if (destination != null) {
            destination.send(message);
            return;
        }

        if (pool != null) {
            if (activePooledDestination != null) {
                activePooledDestination.send(message);
            } else {
                LogDestination pooledDestination = pool.acquire();
                try {
                    pooledDestination.send(message);
                } finally {
                    pool.release(pooledDestination);
                }
            }
        }
    }

    public void beginSession() throws Exception {
        if (pool != null && activePooledDestination == null) {
            activePooledDestination = pool.acquire();
        }
    }

    public void endSession() throws Exception {
        if (pool != null && activePooledDestination != null) {
            pool.release(activePooledDestination);
            activePooledDestination = null;
        }
    }

    public void setDestination(LogDestination destination) throws InvalidArgumentException {
        if (destination == null) {
            throw new InvalidArgumentException("Destination cannot be null");
        }

        this.destination = destination;
        this.pool = null;
        this.activePooledDestination = null;
    }

    public void setPool(DestinationPool pool) throws InvalidArgumentException {
        if (pool == null) {
            throw new InvalidArgumentException("Pool cannot be null");
        }

        this.pool = pool;
        this.destination = null;
        this.activePooledDestination = null;
    }
}