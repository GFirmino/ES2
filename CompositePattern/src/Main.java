import com.es2.composite.Link;
import com.es2.composite.SubMenu;

public class Main {
    public static void main(String[] args) {
        SubMenu root = new SubMenu("Menu Principal");
        root.addChild(new Link("Home", "/"));
        root.addChild(new Link("Contactos", "/contactos"));

        SubMenu courses = new SubMenu("Cursos");
        courses.addChild(new Link("Engenharia Informática", "/cursos/ei"));
        courses.addChild(new Link("Desenvolvimento para a Web e Dispositivos Móveis", "/cursos/dwdm"));
        root.addChild(courses);

        SubMenu exams = new SubMenu("Exames");
        exams.addChild(new Link("Época Normal", "/exames/epocaNormal"));
        exams.addChild(new Link("Época de Recurso", "/exames/epocaRecurso"));
        courses.addChild(exams);

        root.showOptions();
    }
}