import com.es2.decorator.*;

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
        }catch(AuthException e){
            System.out.println(e.getMessage());
        }

    }
}