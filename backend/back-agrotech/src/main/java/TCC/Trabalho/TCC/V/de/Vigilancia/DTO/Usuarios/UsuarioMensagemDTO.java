package TCC.Trabalho.TCC.V.de.Vigilancia.DTO.Usuarios;

import java.util.Set;

import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Mensagem.MensagemModel;
import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Usuario.UsuarioModel;
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

public class UsuarioMensagemDTO {
    private Long id;
    private String nome;
    private tipoUsuario tipo_usuario;
    private tipoApoiador tipo_apoiador;
    private byte[] foto_perfil;
    private Set<UsuarioModel> conexoes;
    private Set<MensagemModel> mensagens;
}
