package TCC.Trabalho.TCC.V.de.Vigilancia.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Mensagem.ConversaModel;

@Repository
public interface ConversaRepository extends JpaRepository<ConversaModel, Long>{
    List<ConversaModel> findByUsuario01Id(Long usuario01Id);

}
