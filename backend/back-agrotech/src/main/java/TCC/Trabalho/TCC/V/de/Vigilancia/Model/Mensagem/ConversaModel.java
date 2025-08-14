package TCC.Trabalho.TCC.V.de.Vigilancia.Model.Mensagem;

import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Usuario.UsuarioModel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Conversa")
@Getter
@Setter
@NoArgsConstructor
public class ConversaModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario01", nullable =  false)
    private UsuarioModel usuario01;

    @ManyToOne
    @JoinColumn (name = "id_usuario02", nullable = false)
    private UsuarioModel usuario02;

        
}
