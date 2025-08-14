package TCC.Trabalho.TCC.V.de.Vigilancia.Service;

import java.io.InputStream;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import TCC.Trabalho.TCC.V.de.Vigilancia.DTO.Usuarios.UsuarioCadastroDTO;
import TCC.Trabalho.TCC.V.de.Vigilancia.DTO.Usuarios.UsuarioDTO;
import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Usuario.UsuarioModel;
import TCC.Trabalho.TCC.V.de.Vigilancia.Repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UsuarioDTO salvarUsuario(UsuarioCadastroDTO dto) {
        Optional<UsuarioModel> usuarioExistente = repository.findByEmail(dto.getEmail());
        if (usuarioExistente.isPresent()) {
            throw new RuntimeException("Email já cadastrado");
        }

        UsuarioModel model = new UsuarioModel();
        model.setNome(dto.getNome());
        model.setEmail(dto.getEmail());
        model.setDocumento(dto.getDocumento());
        model.setCep(dto.getCep());
        model.setCidade(dto.getCidade());
        model.setEstado(dto.getEstado());
        model.setTelefone(dto.getTelefone());
        model.setTipo_usuario(dto.getTipo_usuario());
        model.setTipo_apoiador(dto.getTipo_apoiador());
        model.setBiografia(dto.getBiografia());
        model.setSenha(passwordEncoder.encode(dto.getSenha()));  // codifica a senha
        model.setFoto_perfil(dto.getFoto_perfil());

        return toDTO(repository.save(model));
    }

    public List<UsuarioModel> buscarUsers() {
        return repository.findAll();
    }

    public Optional<UsuarioModel> buscarUserPorID(Long id) {
        return repository.findById(id);
    }

    public Optional<UsuarioModel> buscarUserPorEmail(String email) {
        return repository.findByEmail(email);
    }

    public Optional<UsuarioModel> autenticarUsuario(String email, String senha) {
        Optional<UsuarioModel> usuarioExistente = repository.findByEmail(email);
        if (usuarioExistente.isPresent()) {
            UsuarioModel usuario = usuarioExistente.get();
            String senhaSalva = usuario.getSenha();

            if (senhaSalva != null) {
                if (senhaSalva.startsWith("$2a$") || senhaSalva.startsWith("$2b$") || senhaSalva.startsWith("$2y$")) {
                    // Senha já codificada com BCrypt
                    if (passwordEncoder.matches(senha, senhaSalva)) {
                        return Optional.of(usuario);
                    }
                } else {
                    // Senha em texto puro (não seguro, só para transição)
                    if (senha.equals(senhaSalva)) {
                        // Codifica e salva a senha para futuros logins
                        usuario.setSenha(passwordEncoder.encode(senha));
                        repository.save(usuario);
                        return Optional.of(usuario);
                    }
                }
            }
        }
        return Optional.empty();
    }

    public Optional<UsuarioDTO> atualizarUsuario(Long id, UsuarioCadastroDTO dto) {
        Optional<UsuarioModel> usuarioExistente = repository.findById(id);
        if (usuarioExistente.isPresent()) {
            UsuarioModel usuario = usuarioExistente.get();

            if (dto.getNome() != null && !dto.getNome().isEmpty()) usuario.setNome(dto.getNome());
            if (dto.getEmail() != null && !dto.getEmail().isEmpty()) usuario.setEmail(dto.getEmail());
            if (dto.getDocumento() != null && !dto.getDocumento().isEmpty()) usuario.setDocumento(dto.getDocumento());
            if (dto.getCep() != null && !dto.getCep().isEmpty()) usuario.setCep(dto.getCep());
            if (dto.getCidade() != null && !dto.getCidade().isEmpty()) usuario.setCidade(dto.getCidade());
            if (dto.getEstado() != null && !dto.getEstado().isEmpty()) usuario.setEstado(dto.getEstado());
            if (dto.getTelefone() != null && !dto.getTelefone().isEmpty()) usuario.setTelefone(dto.getTelefone());
            if (dto.getTipo_usuario() != null) usuario.setTipo_usuario(dto.getTipo_usuario());
            if (dto.getTipo_apoiador() != null) usuario.setTipo_apoiador(dto.getTipo_apoiador());
            if (dto.getBiografia() != null && !dto.getBiografia().isEmpty()) usuario.setBiografia(dto.getBiografia());

            if (dto.getFoto_perfil() == null) {
                try (InputStream input = getClass().getResourceAsStream("/static/icon perfil criado recentemente.png")) {
                    if (input != null) {
                        byte[] defaultImage = input.readAllBytes();
                        usuario.setFoto_perfil(defaultImage);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            } else {
                usuario.setFoto_perfil(dto.getFoto_perfil());
            }

            if (dto.getSenha() != null && !dto.getSenha().isEmpty()) {
                usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
            }

            UsuarioModel usuarioAtualizado = repository.save(usuario);
            return Optional.of(toDTO(usuarioAtualizado));
        }
        return Optional.empty();
    }

    public UsuarioModel adicionarUser(UsuarioModel usuario) {
        return repository.save(usuario);
    }

    public void removerUser(Long id) {
        repository.deleteById(id);
    }

    public UsuarioModel pegandoAlertandoSobreDados(UsuarioModel usuario) {
        if ("Marcos".equals(usuario.getNome())) {
            System.out.println("Alerta: O usuário " + usuario.getNome() + " está cadastrado no sistema.");
        } else {
            System.out.println("Usuário " + usuario.getNome() + " não é o Marcos, sem alerta.");
        }
        return usuario;
    }

    public UsuarioDTO toDTO(UsuarioModel usuario) {
        return new UsuarioDTO(
            usuario.getId(),
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getDocumento(),
            usuario.getCep(),
            usuario.getCidade(),
            usuario.getEstado(),
            usuario.getTelefone(),
            usuario.getTipo_usuario(),
            usuario.getTipo_apoiador(),
            usuario.getBiografia(),
            usuario.getFoto_perfil()
        );
    }

    @Transactional
    public void conectarUsuarios(Long id_usuario01, Long id_usuario02) {
        UsuarioModel usuario01 = repository.findById(id_usuario01)
                .orElseThrow(() -> new RuntimeException("Usuário 1 não encontrado."));
        UsuarioModel usuario02 = repository.findById(id_usuario02)
                .orElseThrow(() -> new RuntimeException("Usuário 2 não encontrado."));

        if (usuario01.getConexoes().contains(usuario02)) {
            usuario01.getConexoes().remove(usuario02);
            usuario02.getConexoes().remove(usuario01);
        } else {
            usuario01.getConexoes().add(usuario02);
            usuario02.getConexoes().add(usuario01);
        }

        repository.save(usuario01);
        repository.save(usuario02);
    }
}
