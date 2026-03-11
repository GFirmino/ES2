package com.es2.memento;

import java.util.ArrayList;

public class BackupService {
    private final ArrayList<Memento> mementoLst = new ArrayList<>();
    private Server server;

    public BackupService(Server server){
        if (server == null) throw new IllegalArgumentException("Server cannot be null");

        this.server = server;
    }

    public void restoreSnapshot(int snapshotNumber) throws NotExistingSnapshotException{
        if(snapshotNumber < 0 || snapshotNumber >= mementoLst.size()){
            throw new NotExistingSnapshotException("The snapshot doesn't exist");
        }

        this.server.restore(this.mementoLst.get(snapshotNumber));
    }

    public void takeSnapshot(){
        this.mementoLst.add(this.server.backup());
    }
}
