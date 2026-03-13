package com.es2.composite;

public class Link extends Menu {
    protected String url;

    public Link() {
        super("");
        this.url = "";
    }

    public Link(String label, String url) {
        super(label);
        this.url = url;
    }

    public String getURL() {
        return url;
    }

    public void setURL(String url) {
        this.url = url;
    }
    
    @Override
    public void showOptions() {
        System.out.println(this.getLabel());
        System.out.println(this.getURL());
    }
}
