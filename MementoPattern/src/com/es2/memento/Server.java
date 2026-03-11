package com.es2.memento;

import java.util.ArrayList;

public class Server {
    private ArrayList<String> studentNames;

    public Server(){
        this.studentNames = new ArrayList<>();
    }

    public void addStudent(String name) throws ExistingStudentException{
        if(name.isEmpty()){
            throw new IllegalArgumentException("Student name must not be null/empty");
        }

        if(this.studentNames.contains(name)){
            throw new ExistingStudentException("The student name already exists");
        }

        this.studentNames.add(name);
    }

    public void removeStudent(String name) throws ExistingStudentException{
        if(name.isEmpty()){
            throw new IllegalArgumentException("Student name must not be null/empty");
        }

        if(!this.studentNames.contains(name)){
            throw new ExistingStudentException("The student name don't exists");
        }

        this.studentNames.remove(name);
    }

    public Memento backup(){
        return new Memento(this.studentNames);
    }

    public ArrayList<String> getStudentNames(){
        return this.studentNames;
    }

    public void restore(Memento state){
        if(state == null)
            throw new IllegalArgumentException("Memento stage must not be null/empty");

        this.studentNames = state.getState();
    }
}
