package com.es2.factorymethod;

public class FactoryProduct extends Object {
    public FactoryProduct() {
    }

    public static Product makeProduct(String type) throws UndefinedProductException {
        switch (type.toLowerCase()) {
            case "computer":
                return new Computer();
            case "software":
                return new Software();
            default:
                throw new UndefinedProductException();
        }
    }

}
