import com.es2.objectpool.PoolExhaustedException;
import com.es2.objectpool.ObjectNotFoundException;
import com.es2.objectpool.ReusablePool;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;

public class Main {
    public static void main(String[] args) {
        ReusablePool pool = ReusablePool.getInstance();

        HttpURLConnection conn = null;

        try {
            conn = pool.acquire();
            System.out.println("Conexão obtida do pool: " + System.identityHashCode(conn));

            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "text/html");

            int code = conn.getResponseCode();
            System.out.println("HTTP code: " + code);

            try (BufferedReader br = new BufferedReader(new InputStreamReader(
                    code >= 400 ? conn.getErrorStream() : conn.getInputStream()
            ))) {
                for (int i = 0; i < 5; i++) {
                    String line = br.readLine();
                    if (line == null) break;
                    System.out.println(line);
                }
            }

        } catch (PoolExhaustedException e) {
            System.out.println("POOL ESGOTADA: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("ERRO: " + e);
            e.printStackTrace();
        } finally {
            if (conn != null) {
                try {
                    pool.release(conn);
                    System.out.println("Conexão devolvida ao pool: " + System.identityHashCode(conn));
                } catch (ObjectNotFoundException e) {
                    System.out.println("ERRO ao devolver ao pool: " + e.getMessage());
                }
            }

            pool.resetPool();
        }
    }
}
