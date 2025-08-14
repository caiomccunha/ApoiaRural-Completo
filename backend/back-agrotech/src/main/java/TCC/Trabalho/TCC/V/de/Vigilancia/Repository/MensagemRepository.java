package TCC.Trabalho.TCC.V.de.Vigilancia.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Mensagem.MensagemModel;

public interface MensagemRepository extends JpaRepository <MensagemModel, Long>  {
        List<MensagemModel> findByRemetenteId(Long remetenteId);

    
}
