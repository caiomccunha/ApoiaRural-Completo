package TCC.Trabalho.TCC.V.de.Vigilancia.Model.Postagens;

import com.fasterxml.jackson.annotation.JsonBackReference;

import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Usuario.UsuarioModel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "comment")
@Getter
@Setter
@NoArgsConstructor
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private UsuarioModel usuario;

}
