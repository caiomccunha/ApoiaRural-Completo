package TCC.Trabalho.TCC.V.de.Vigilancia.DTO.Postagens;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostDTO {

    private long id;
    private String message;
    private int likes;
    private String nomeArquivoPost;
    private String tipoMimePost;
    private String autorNome;
    private Long autorId;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime horarioPostagem;
    private List<CommentDTO> comments;
}