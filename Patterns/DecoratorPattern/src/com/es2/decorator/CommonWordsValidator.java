package com.es2.decorator;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Set;

public class CommonWordsValidator extends Decorator {
    private static final Set<String> COMMON = Set.of(
            "admin123", "password", "password1", "123456", "12345678",
            "qwerty", "qwerty123", "letmein", "welcome", "iloveyou", "111111"
    );

    public CommonWordsValidator(AuthInterface auth){
        super(auth);
    }

    @Override
    public void auth(String username, String password) throws AuthException {
        if (password == null || password.isBlank()) {
            throw new AuthException("Password inválida.");
        }

        if (COMMON.contains(password.toLowerCase())) {
            throw new AuthException("Password demasiado comum.");
        }

        if (password.matches("[A-Za-z]")) {
            String result = getHTTPRequest(password.toLowerCase());
            if (!result.isBlank()) {
                throw new AuthException("Password demasiado comum.");
            }
        }

        super.auth(username, password);
    }

    public String getHTTPRequest(String word) throws AuthException {
        HttpURLConnection conn = null;
        try{
            URL url = new URL( "https://api.dictionaryapi.dev/api/v2/entries/en/" + word);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestProperty("User-Agent", "Mozilla/5.0");
            conn.setRequestMethod("GET");

            int status = conn.getResponseCode();

            if (status != 200) {
                return "";
            }

            StringBuilder result = new StringBuilder();
            try (BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
                String line;
                while ((line = rd.readLine()) != null) {
                    result.append(line);
                }
            }
            return result.toString();

        } catch (Exception e) {
            return "";
        } finally {
            if (conn != null) conn.disconnect();
        }
    }
}
