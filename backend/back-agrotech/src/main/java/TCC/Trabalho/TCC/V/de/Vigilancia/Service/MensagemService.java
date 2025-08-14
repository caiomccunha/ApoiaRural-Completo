package TCC.Trabalho.TCC.V.de.Vigilancia.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Mensagem.MensagemModel;
import TCC.Trabalho.TCC.V.de.Vigilancia.Repository.MensagemRepository;

@Service
public class MensagemService {
    @Autowired
    private MensagemRepository repository;

    public Optional <MensagemModel> buscarMensagemId(Long id){
        return repository.findById(id);
    }

    public List<MensagemModel> buscarMensagensPorRemetente(Long remetenteId) {
        return repository.findByRemetenteId(remetenteId);
    }

    public MensagemModel cadastrarMensagem(MensagemModel MensagemProdutor){
        return repository.save(MensagemProdutor);
    }

    public void excluirMensagem(Long id){
         repository.deleteById(id);
    }

}
