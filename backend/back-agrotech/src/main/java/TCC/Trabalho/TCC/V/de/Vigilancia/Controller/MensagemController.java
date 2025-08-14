package TCC.Trabalho.TCC.V.de.Vigilancia.Controller;

import TCC.Trabalho.TCC.V.de.Vigilancia.DTO.Mensagem.MensagemDTO;
import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Mensagem.MensagemModel;
import TCC.Trabalho.TCC.V.de.Vigilancia.Service.MensagemService;

import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Usuario.UsuarioModel;
import TCC.Trabalho.TCC.V.de.Vigilancia.Repository.UsuarioRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/tcc/mensagem")
public class MensagemController {

    private final UsuarioRepository usuarioRepository;
    private final MensagemService mensagemService;

    public MensagemController(MensagemService mensagemService, UsuarioRepository usuarioRepository) {
        this.mensagemService = mensagemService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<MensagemDTO> buscarPorID(@PathVariable Long id) {
        return mensagemService.buscarMensagemId(id)
                .map(this::converterParaDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{id}")
    public List<MensagemDTO> buscarMensagensPorRemetente(@PathVariable Long id) {
    return mensagemService.buscarMensagensPorRemetente(id).stream()
            .map(this::converterParaDTO)
            .collect(Collectors.toList());
    }


    @PostMapping
    public ResponseEntity<MensagemDTO> criarMensagem(@RequestBody MensagemDTO mensagemDTO) {
        if (mensagemDTO.getRemetente() == null
        || mensagemDTO.getDestinatario() == null) {
            throw new IllegalArgumentException("ID dos usuários são obrigatórios");
        }

        UsuarioModel remetente = usuarioRepository.findById(mensagemDTO.getRemetente())
                .orElseThrow(() -> new RuntimeException("Usuário (Remetente) não encontrado"));
        UsuarioModel destinatario = usuarioRepository.findById(mensagemDTO.getDestinatario())
                .orElseThrow(() -> new RuntimeException("Usuário (Destinatário) não encontrado"));

        MensagemModel mensagem = converterParaModel(mensagemDTO);
        mensagem.setRemetente(remetente);
        mensagem.setDestinatario(destinatario);
        mensagem.setData_envio(LocalDateTime.now());

        MensagemModel mensagemSalva = mensagemService.cadastrarMensagem(mensagem);
        return ResponseEntity.ok(converterParaDTO(mensagemSalva));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MensagemDTO> editarMensagem(
            @PathVariable Long id,
            @RequestBody MensagemDTO mensagemDTO) {

        if (!mensagemService.buscarMensagemId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        UsuarioModel remetente = usuarioRepository.findById(mensagemDTO.getRemetente())
                .orElseThrow(() -> new RuntimeException("Usuário (remetente) não encontrado"));
        UsuarioModel destinatario = usuarioRepository.findById(mensagemDTO.getDestinatario())
                .orElseThrow(() -> new RuntimeException("Usuário (destinatário) não encontrado"));

        MensagemModel mensagem = converterParaModel(mensagemDTO);
        mensagem.setId(id);
        mensagem.setRemetente(remetente);
        mensagem.setDestinatario(destinatario);

        MensagemModel mensagemAtualizada = mensagemService.cadastrarMensagem(mensagem);
        return ResponseEntity.ok(converterParaDTO(mensagemAtualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirMensagem(@PathVariable Long id) {
        if (!mensagemService.buscarMensagemId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        mensagemService.excluirMensagem(id);
        return ResponseEntity.noContent().build();
    }

    // Conversões
    private MensagemDTO converterParaDTO(MensagemModel model) {
        MensagemDTO dto = new MensagemDTO();
        dto.setId(model.getId());
        dto.setRemetente(model.getRemetente().getId());
        dto.setDestinatario(model.getDestinatario().getId());
        dto.setData_envio(model.getData_envio());
        return dto;
    }

    private MensagemModel converterParaModel(MensagemDTO dto) {
        MensagemModel model = new MensagemModel();
        model.setConteudo(dto.getConteudo());
        return model;
    }
}
