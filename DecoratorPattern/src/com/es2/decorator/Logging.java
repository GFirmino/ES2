package com.es2.decorator;

public class Logging extends Decorator {
    public Logging(AuthInterface auth) {
        super(auth);
    }

    @Override
    public void auth(String username, String password) throws AuthException {
        try {
            super.auth(username, password);
            System.out.println("Logging: success " + username);
        } catch (AuthException e) {
            System.out.println("Logging: fail " + username);
            throw e;
        }
    }
}
