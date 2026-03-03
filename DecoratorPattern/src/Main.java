import com.es2.decorator.AuthInterface;
import com.es2.decorator.Auth;
import com.es2.decorator.Logging;
import com.es2.decorator.CommonWordsValidator;

public class Main {
    public static void main(String[] args) {
        try{
            AuthInterface auth =
                new Logging(
                    new CommonWordsValidator(
                        new Auth()
                    )
            );

            auth.auth("admin", "admin");
        }catch(Exception e){
            System.out.println(e.getMessage());
        }

    }
}