package TCC.Trabalho.TCC.V.de.Vigilancia.DTO.Mensagem;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConversaDTO {
    private Long id;

    @NotNull
    private Long usuario01;

    @NotNull
    private Long usuario02;
}
