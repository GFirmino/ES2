package es2.logs.composite;

import es2.logs.bridge.LoggerBridge;
import es2.logs.factory.LogMessage;

public class LogLeaf implements LogComponent {
    private LogMessage message;

    public LogLeaf(LogMessage message) {
        this.message = message;
    }

    @Override
    public void show(String indent, LoggerBridge logger) throws Exception {
        String formatted = indent + "- " + message.format();
        logger.log(formatted);
    }
}