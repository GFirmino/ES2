package com.es2.objectpool;

import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashSet;
import java.util.Set;

public class ReusablePool extends Object {
    static private final int MAX_POOL_SIZE = 10;

    //singleton
    private static class Holder{
        private static final ReusablePool INSTANCE = new ReusablePool();
    }

    static public ReusablePool getInstance(){
        return Holder.INSTANCE;
    }

    //objectPool
    private final Deque<HttpURLConnection> available = new ArrayDeque<>();
    private final Set<HttpURLConnection> inUse = new HashSet<>();

    private final URL targetUrl;
    private int maxPoolSize = MAX_POOL_SIZE;

    private ReusablePool(){
        try {
            this.targetUrl = new URL("http://example.com/ipv");
        } catch (Exception e) {
            throw new RuntimeException("URL inválido para o pool", e);
        }
    }
    public synchronized HttpURLConnection acquire() throws PoolExhaustedException{
        HttpURLConnection conn = available.pollFirst();
        if(conn != null){
            inUse.add(conn);
            return conn;
        }

        int totalCreated = available.size() + inUse.size();
        if(totalCreated >= maxPoolSize){
            throw new PoolExhaustedException("Pool esgotada: máximo = " + maxPoolSize);
        }

        try{
            conn = (HttpURLConnection) targetUrl.openConnection();
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);
            conn.setUseCaches(false);

            inUse.add(conn);
            return conn;
        } catch (Exception e) {
            throw new RuntimeException("Falha a criar HttpURLConnection", e);
        }
    }

    public synchronized void release(HttpURLConnection conn) throws ObjectNotFoundException{
        if(conn == null){
            throw new ObjectNotFoundException("Conexão nula");
        }

        if(!inUse.remove(conn)){
            throw new ObjectNotFoundException("Esta conexão não estava marcada como 'em uso' no pool.");
        }

        try {
            conn.setRequestMethod("GET");
        } catch (Exception ignored) {
            try { conn.disconnect();
            } catch (Exception ignore2) {}
            return;
        }

        available.addLast(conn);
    }

    public synchronized void resetPool() {
        for (HttpURLConnection c : available) {
            safeDisconnect(c);
        }
        available.clear();

        for (HttpURLConnection c : inUse) {
            safeDisconnect(c);
        }
        inUse.clear();
    }

    private synchronized void safeDisconnect(HttpURLConnection conn) {
        try {
            conn.disconnect();
        } catch (Exception ignored) {
        }
    }

    public synchronized void setMaxPoolSize(int size) {
        if (size <= 0) throw new IllegalArgumentException("maxPoolSize tem de ser > 0");
        this.maxPoolSize = size;
    }
}
