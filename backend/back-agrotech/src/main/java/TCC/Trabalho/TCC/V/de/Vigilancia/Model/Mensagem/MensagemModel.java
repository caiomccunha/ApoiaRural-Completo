package TCC.Trabalho.TCC.V.de.Vigilancia.Model.Mensagem;

import java.time.LocalDateTime;

import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Usuario.UsuarioModel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Mensagem")
@Getter
@Setter
@NoArgsConstructor
public class MensagemModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column (nullable = false, length = 2048)
    private String conteudo;

    @ManyToOne
    @JoinColumn(name = "id_conversa", nullable = false)
    private ConversaModel conversa;

    @ManyToOne
    @JoinColumn(name = "id_remetente", nullable =  false)
    private UsuarioModel remetente;

    @ManyToOne
    @JoinColumn (name = "id_destinatario", nullable = false)
    private UsuarioModel destinatario;

    @Column (nullable = false)
    private LocalDateTime data_envio;

    
}
