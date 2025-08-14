package TCC.Trabalho.TCC.V.de.Vigilancia.Model.Usuario;

public enum tipoApoiador {
    PESSOA_FISICA ("Pessoa física"),
    ONG("ONG"),
    EMPRESA_COMERCIO("Empresa_Comércio"),
    CONVENIADO ("Conveniado");

    private final String tipoApoiador;

    tipoApoiador (String tipoApoiador){
        this.tipoApoiador = tipoApoiador;
    }
}
