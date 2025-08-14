    package TCC.Trabalho.TCC.V.de.Vigilancia.Model.Demanda;

    public enum statusDemanda {

        aberta ("Aberta"),
        fechada ("Fechada");

        private String status;

        statusDemanda (String status){
            this.status = status;
        }
    }
