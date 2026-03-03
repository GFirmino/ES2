package com.es2.composite;

import java.util.ArrayList;
import java.util.List;

public class SubMenu extends Menu {
    private final List<Menu> children = new ArrayList<>();

    public SubMenu() {
        super("");
    }

    public SubMenu(String label) {
        super(label);
    }

    public void addChild(Menu child) {
        children.add(child);
    }

    public void removeChild(Menu child) {
        children.remove(child);
    }

    @Override
    public void showOptions(){
        System.out.println(this.getLabel());
        for (Menu child : children) {
            child.showOptions();
        }
    }
}
