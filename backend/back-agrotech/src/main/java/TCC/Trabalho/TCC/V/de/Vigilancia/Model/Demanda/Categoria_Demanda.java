package TCC.Trabalho.TCC.V.de.Vigilancia.Model.Demanda;

public enum Categoria_Demanda {

    graos ("Grãos"),
    feijoes_raizes ("Feijões e Raízes"),
    frutas_hortalicas ("Frutas e Hortaliças"),
    verduras_ervas ("Verduras e Ervas"),
    outros ("Outros");

    private final String categoriaDemanda;

    Categoria_Demanda(String categoriaDemanda){
        this.categoriaDemanda = categoriaDemanda;
    }

}
