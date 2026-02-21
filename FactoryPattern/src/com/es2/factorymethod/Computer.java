package com.es2.factorymethod;

public class Computer extends Object implements Product{
    private String brand;

    protected Computer() {
    }

    @Override
    public String getBrand() {
        return this.brand;
    }

    @Override
    public void setBrand(String brand) {
        this.brand = brand;
    }
}
