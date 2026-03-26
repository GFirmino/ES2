package es2.logs.objectpool;

import es2.logs.bridge.LogDestination;

public interface DestinationPool {
    LogDestination acquire() throws Exception;
    void release(LogDestination destination) throws Exception;
}
