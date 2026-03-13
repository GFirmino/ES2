package com.es2.factorymethod;

public class Software extends Object implements Product{
    private String brand;

    protected Software() {
    }

    public String getBrand() {
        return this.brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }
}
