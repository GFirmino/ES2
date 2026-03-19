package es2.logs.composite;

import es2.logs.bridge.LoggerBridge;

public interface LogComponent {
    void show(String indent, LoggerBridge logger) throws Exception;
}