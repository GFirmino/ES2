package com.es2.memento;

import java.util.ArrayList;

public class BackupService {
    private final ArrayList<Memento> mementoLst = new ArrayList<>();
    private int maxSnapshots = 5;
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

        if (maxSnapshots > 0 && mementoLst.size() > maxSnapshots) {
            mementoLst.remove(0);
        }
    }

    public int getSnapshotCount() {
        return mementoLst.size();
    }

    public int getMaxSnapshots() {
        return maxSnapshots;
    }

    public void setMaxSnapshots(int maxSnapshots) {
        if (maxSnapshots < 0) throw new IllegalArgumentException("maxSnapshots must be >= 0");
        this.maxSnapshots = maxSnapshots;
    }
}
