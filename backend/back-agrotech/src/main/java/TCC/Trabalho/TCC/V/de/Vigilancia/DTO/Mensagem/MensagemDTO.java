package TCC.Trabalho.TCC.V.de.Vigilancia.DTO.Mensagem;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MensagemDTO {
    private Long id;
    
    private String conteudo;

    @CreationTimestamp
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime data_envio;

    @NotNull
    private Long remetente;

    @NotNull
    private Long destinatario;
}
