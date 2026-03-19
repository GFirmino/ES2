package es2.logs.composite;

import es2.logs.bridge.LoggerBridge;
import es2.logs.exception.MaximumExceededException;
import es2.logs.exception.NotFoundException;

import java.util.ArrayList;
import java.util.List;

public class LogCategory implements LogComponent {
    private String name;
    private List<LogComponent> children;
    private Integer MAX_CHILDREN = 3;

    public LogCategory(String name) {
        this.name = name;
        this.children = new ArrayList<>();
    }

    public void add(LogComponent component) throws MaximumExceededException {
        if(children.size() >= MAX_CHILDREN){
            throw new MaximumExceededException("Maximum number of children exceeded");
        }

        children.add(component);
    }

    public void remove(LogComponent component) throws NotFoundException {
        if(!children.contains(component)){
            throw new NotFoundException("Log component not found");
        }

        children.remove(component);
    }

    public void setMaxChildrenSize(int size) {
        if (size <= 0) throw new IllegalArgumentException("MAX_CHILDREN has to be greater or equals than 0");
        this.MAX_CHILDREN = size;
    }

    @Override
    public void show(String indent, LoggerBridge logger) throws Exception {
        String indentAux = indent == null ? "" : indent;

        logger.log(indentAux + name);

        for (LogComponent child : children) {
            child.show(indentAux + "   ", logger);
        }
    }
}