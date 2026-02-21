package com.es2.factorymethod;

public class FactoryProduct extends Object {
    public FactoryProduct() {
    }

    public static Product makeProduct(String type) throws UndefinedProductException {
        if (type.equals("Computer")) {
            return new Computer();
        } else if (type.equals("Software")) {
            return new Software();
        } else {
            throw new UndefinedProductException();
        }
    }

}
