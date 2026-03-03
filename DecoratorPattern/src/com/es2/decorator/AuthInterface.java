package com.es2.decorator;

public interface AuthInterface {
    public void auth(String username, String password) throws AuthException;
}
