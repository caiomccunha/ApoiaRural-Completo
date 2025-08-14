package TCC.Trabalho.TCC.V.de.Vigilancia;


import static org.junit.jupiter.api.Assertions.assertEquals;    

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Demanda.DemandasModel;
import TCC.Trabalho.TCC.V.de.Vigilancia.Service.DemandasService;
import lombok.experimental.var;

@SpringBootTest
public class DemandaRepositoryTest {
    @Autowired
    private DemandasService demandasService;

@Test
    void testes(){
        System.out.println("Inicio do teste");
        DemandasModel demanda = new DemandasModel();
        demanda.setDescricao("");
        System.out.println("Passando informação de demanda: " + demanda.getDescricao());

        var response = demandasService.pegandoAlertandoSobreDemandas(demanda);
        System.out.println("Validando informação de descrição passada para a função");
        assertEquals (response.getDescricao(), "Estou precisando de doar 100 sacos de feijão", "A função está validando a demanda");

        System.out.println("Teste concluído com sucesso !!");
    }


}
