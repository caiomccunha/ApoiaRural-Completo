package TCC.Trabalho.TCC.V.de.Vigilancia.Model.Postagens;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Usuario.UsuarioModel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "post")
@Getter
@Setter
@NoArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "likes")
    private int likes = 0;

    @Column(name = "nome_arquivo_post")
    private String nomeArquivoPost;

    @Column(name = "tipo_mime_post")
    private String tipoMimePost;

    @Lob
    @Column(name = "foto_post", columnDefinition = "LONGBLOB")
    private byte[] fotoPost;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "autor_id")
    private UsuarioModel autor;

    @ManyToMany
    @JoinTable(
        name = "post_likes",
        joinColumns = @JoinColumn(name = "post_id"),
        inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    private Set<UsuarioModel> likedBy = new HashSet<>();

    @CreationTimestamp
    @Column(nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime horario_postagem;

}
