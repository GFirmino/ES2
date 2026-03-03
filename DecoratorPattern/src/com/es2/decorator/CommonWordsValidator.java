package com.es2.decorator;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class CommonWordsValidator extends Decorator {
    public CommonWordsValidator(AuthInterface auth){
        super(auth);
    }

    @Override
    public void auth(String username, String password) throws AuthException {
        if (password == null || password.isBlank()) {
            throw new AuthException("Password inválida.");
        }

        if (password.matches("[A-Za-z]+")) {
            String response = getHTTPRequest(password.toLowerCase());
            if (!response.isBlank()) {
                throw new AuthException("Password demasiado comum (palavra de dicionário).");
            }
        }

        super.auth(username, password);
    }

    public String getHTTPRequest(String word) throws AuthException {
        HttpURLConnection conn = null;
        try{
            URL url = new URL("https://owlbot.info/api/v2/dictionary/" + word + "?format=json");
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
