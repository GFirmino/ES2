import com.es2.bridge.APIMoodle;
import com.es2.bridge.APIRequest;

public class Main {
    public static void main(String[] args) {
        APIRequest req = new APIRequest();
        String moodleId = req.addService(new APIMoodle());
        try{
            String contentId = req.setContent(moodleId, "Olá");
            System.out.println(req.getContent(moodleId, contentId)); // "Olá"
        } catch (Exception e) {}

    }
}