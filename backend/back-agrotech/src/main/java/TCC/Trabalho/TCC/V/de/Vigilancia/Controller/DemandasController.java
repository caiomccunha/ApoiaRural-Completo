package TCC.Trabalho.TCC.V.de.Vigilancia.Controller;

import TCC.Trabalho.TCC.V.de.Vigilancia.DTO.Demandas.CriacaoDemandaDTO;
import TCC.Trabalho.TCC.V.de.Vigilancia.DTO.Demandas.DemandaDTO;
import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Demanda.DemandasModel;
import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Usuario.UsuarioModel;
import TCC.Trabalho.TCC.V.de.Vigilancia.Repository.UsuarioRepository;
import TCC.Trabalho.TCC.V.de.Vigilancia.Service.DemandasService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/tcc/demandas")
public class DemandasController {

    private final DemandasService demandasService;
    private final UsuarioRepository usuarioRepository;

    public DemandasController(DemandasService demandasService, UsuarioRepository usuarioRepository) {
        this.demandasService = demandasService;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public List<DemandaDTO> buscarTodasDemandas() {
        return demandasService.buscarDemandasProd().stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DemandaDTO> buscarPorID(@PathVariable Long id) {
        return demandasService.buscarDemandaId(id)
                .map(this::converterParaDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

 @GetMapping("/usuario/{id}")
    public List<DemandaDTO> buscarDemandasPorUsuario(@PathVariable Long id) {
    return demandasService.buscarDemandasPorUsuario(id).stream()
            .map(this::converterParaDTO)
            .collect(Collectors.toList());
}


    @PostMapping
    public ResponseEntity<DemandaDTO> criarDemanda(@RequestBody CriacaoDemandaDTO demandaDTO) {
        if (demandaDTO.getUsuarioId() == null) {
            throw new IllegalArgumentException("ID do usuário é obrigatório");
        }

        UsuarioModel usuario = usuarioRepository.findById(demandaDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        DemandasModel demanda = converterParaModel(demandaDTO);
        demanda.setUsuario(usuario);
        demanda.setData_postagem(LocalDate.now());

        DemandasModel demandaSalva = demandasService.cadastrarDemandar(demanda);
        return ResponseEntity.ok(converterParaDTO(demandaSalva));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DemandaDTO> editarDemanda(
            @PathVariable Long id,
            @RequestBody CriacaoDemandaDTO demandaDTO) {

        Optional<DemandasModel> demandaExistenteOpt = demandasService.buscarDemandaId(id);
        if (!demandaExistenteOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        UsuarioModel usuario = usuarioRepository.findById(demandaDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        DemandasModel demanda = converterParaModel(demandaDTO);
        demanda.setId(id);
        demanda.setUsuario(usuario);
        // Mantém a data_postagem original, não atualiza!
        demanda.setData_postagem(demandaExistenteOpt.get().getData_postagem());

        DemandasModel demandaAtualizada = demandasService.cadastrarDemandar(demanda);
        return ResponseEntity.ok(converterParaDTO(demandaAtualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirDemanda(@PathVariable Long id) {
        if (!demandasService.buscarDemandaId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        demandasService.excluirDemanda(id);
        return ResponseEntity.noContent().build();
    }

    // Conversões
    private DemandaDTO converterParaDTO(DemandasModel model) {
        DemandaDTO dto = new DemandaDTO();
        dto.setId(model.getId());
        dto.setUsuario(model.getUsuario().getId());
        dto.setTitulo(model.getTitulo());
        dto.setDescricao(model.getDescricao());
        dto.setData_postagem(model.getData_postagem());
        dto.setCategoria(model.getCategoria());
        dto.setStatus(model.getStatus());
        dto.setCidade(model.getCidade());
        dto.setEstado(model.getEstado());

        if (model.getUsuario() != null) {
            dto.setUsuarioNome(model.getUsuario().getNome());
            dto.setUsuarioTipo(model.getUsuario().getTipo_usuario().toString());

            if (model.getUsuario().getFoto_perfil() != null) {
                dto.setUsuarioFoto(Base64.getEncoder()
                        .encodeToString(model.getUsuario().getFoto_perfil()));
            }
        }
        return dto;
    }

    private DemandasModel converterParaModel(CriacaoDemandaDTO dto) {
        DemandasModel model = new DemandasModel();
        model.setTitulo(dto.getTitulo());
        model.setDescricao(dto.getDescricao());
        model.setCategoria(dto.getCategoria());
        model.setCidade(dto.getCidade());
        model.setEstado(dto.getEstado());
        model.setStatus(dto.getStatus());
        return model;
    }
}
