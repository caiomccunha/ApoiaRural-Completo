package TCC.Trabalho.TCC.V.de.Vigilancia.Model.Demanda;

public enum TipoApoio {
    compra_direta ("Compra Direta"),
    investimento_financeiro ("Investimento Financeiro"),
    infraestrutura ("Infraestrutura"),
    maquinario_equipamento ("Maquinário e Equipamento");

    private final String tipoApoio;

    TipoApoio(String tipoApoio) {
        this.tipoApoio = tipoApoio;
    }

    public String getTipoApoio() {
        return tipoApoio;
    }
}
