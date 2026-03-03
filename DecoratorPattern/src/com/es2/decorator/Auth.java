package com.es2.decorator;

public class Auth implements AuthInterface {
    public Auth(){

    }

    @Override
    public void auth(String username, String password) throws AuthException {
        if(username == null || username.isBlank()){
            throw new AuthException("Username inválido.");
        }

        if(password == null || password.isBlank()){
            throw new AuthException("Password inválida.");
        }
    }
}
