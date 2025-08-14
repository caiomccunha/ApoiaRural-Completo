package TCC.Trabalho.TCC.V.de.Vigilancia.DTO.Usuarios;

import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Usuario.tipoApoiador;
import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Usuario.tipoUsuario;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class UsuarioDTO {
    private Long id;
    private String nome;
    private String email;
    private String documento;
    private String cep;
    private String cidade;
    private String estado;
    private String telefone;
    private tipoUsuario tipo_usuario;
    private tipoApoiador tipo_apoiador;
    private String biografia;
    private byte[] foto_perfil;
}
