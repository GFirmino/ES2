package com.es2.decorator;

public class Decorator implements AuthInterface {
    protected AuthInterface auth;

    public Decorator(AuthInterface auth){
        if(auth != null){
            this.auth = auth;
        }
    }

    @Override
    public void auth(String username, String password) throws AuthException {
        this.auth.auth(username, password);
    }
}
