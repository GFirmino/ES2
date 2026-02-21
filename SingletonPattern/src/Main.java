

import com.es2.singleton.Registry;

public class Main {
    public static void main(String[] args) {
        Registry registry = Registry.getInstance();
        registry.setPath("/tmp/data.txt");
        registry.setConnectionString("jdbc:mysql://localhost:3306/mydb");
        
        System.out.println("Path: " + registry.getPath());
        System.out.println("Connection String: " + registry.getConnectionString());
    }
}