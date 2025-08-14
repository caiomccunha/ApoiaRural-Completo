package TCC.Trabalho.TCC.V.de.Vigilancia.Controller;

import TCC.Trabalho.TCC.V.de.Vigilancia.DTO.Mensagem.ConversaDTO;
import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Mensagem.ConversaModel;
import TCC.Trabalho.TCC.V.de.Vigilancia.Service.ConversaService;

import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Usuario.UsuarioModel;
import TCC.Trabalho.TCC.V.de.Vigilancia.Repository.UsuarioRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/tcc/conversa")
public class ConversaController {

    private final UsuarioRepository usuarioRepository;
    private final ConversaService conversaService;

    public ConversaController(ConversaService conversaService, UsuarioRepository usuarioRepository) {
        this.conversaService = conversaService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConversaDTO> buscarPorID(@PathVariable Long id) {
        return conversaService.buscarConversaId(id)
                .map(this::converterParaDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{id}")
        public List<ConversaDTO> buscarConversaPorUsuario(@PathVariable Long id) {
        return conversaService.buscarConversaPorUsuario(id).stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<ConversaDTO> criarConversa(@RequestBody ConversaDTO conversaDTO) {
        if (conversaDTO.getUsuario01() == null
        || conversaDTO.getUsuario02() == null) {
            throw new IllegalArgumentException("ID dos usuários são obrigatórios");
        }

        UsuarioModel usuario01 = usuarioRepository.findById(conversaDTO.getUsuario01())
                .orElseThrow(() -> new RuntimeException("Usuário 01 não encontrado"));
        UsuarioModel usuario02 = usuarioRepository.findById(conversaDTO.getUsuario02())
                .orElseThrow(() -> new RuntimeException("Usuário 02 não encontrado"));

        ConversaModel conversa = converterParaModel(conversaDTO);
        conversa.setUsuario01(usuario01);
        conversa.setUsuario02(usuario02);

        ConversaModel conversaSalva = conversaService.salvarConversa(conversa);
        return ResponseEntity.ok(converterParaDTO(conversaSalva));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConversaDTO> editarMensagem(
            @PathVariable Long id,
            @RequestBody ConversaDTO conversaDTO) {

        if (!conversaService.buscarConversaId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        UsuarioModel usuario01 = usuarioRepository.findById(conversaDTO.getUsuario01())
                .orElseThrow(() -> new RuntimeException("Usuário 01 não encontrado"));
        UsuarioModel usuario02 = usuarioRepository.findById(conversaDTO.getUsuario02())
                .orElseThrow(() -> new RuntimeException("Usuário 02 não encontrado"));

        ConversaModel conversa = converterParaModel(conversaDTO);
        conversa.setId(id);
        conversa.setUsuario01(usuario01);
        conversa.setUsuario02(usuario02);

        ConversaModel conversaAtualizada = conversaService.salvarConversa(conversa);
        return ResponseEntity.ok(converterParaDTO(conversaAtualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirMensagem(@PathVariable Long id) {
        if (!conversaService.buscarConversaId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        conversaService.excluirConversa(id);
        return ResponseEntity.noContent().build();
    }

    // Conversões
    private ConversaDTO converterParaDTO(ConversaModel model) {
        ConversaDTO dto = new ConversaDTO();
        dto.setId(model.getId());
        dto.setUsuario01(model.getUsuario01().getId());
        dto.setUsuario02(model.getUsuario02().getId());
        return dto;
    }

    private ConversaModel converterParaModel(ConversaDTO dto) {
        ConversaModel model = new ConversaModel();
        return model;
    }
}
