import com.es2.factorymethod.Computer;
import com.es2.factorymethod.FactoryProduct;
import com.es2.factorymethod.Software;
import com.es2.factorymethod.UndefinedProductException;

public class Main {
    public static void main(String[] args) {
        try {
            Computer computer = (Computer) FactoryProduct.makeProduct("Computer");
            computer.setBrand("Dell");
            System.out.println("Computer brand: " + computer.getBrand());

            Software software = (Software) FactoryProduct.makeProduct("Software");
            software.setBrand("Microsoft");
            System.out.println("Software brand: " + software.getBrand());
        } catch (UndefinedProductException e) {
            System.out.println("Undefined product type." + e.getMessage());
        }
    }
}
