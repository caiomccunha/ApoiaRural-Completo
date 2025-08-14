package TCC.Trabalho.TCC.V.de.Vigilancia.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Mensagem.ConversaModel;
import TCC.Trabalho.TCC.V.de.Vigilancia.Repository.ConversaRepository;

@Service
public class ConversaService {
    @Autowired
    private ConversaRepository repository;

    public Optional <ConversaModel> buscarConversaId(Long id){
        return repository.findById(id);
    }

    public List<ConversaModel> buscarConversaPorUsuario(Long usuario01Id) {
        return repository.findByUsuario01Id(usuario01Id);
    }

    public ConversaModel salvarConversa(ConversaModel conversa){
        return repository.save(conversa);
    }

    public void excluirConversa(Long id){
         repository.deleteById(id);
    }

}
