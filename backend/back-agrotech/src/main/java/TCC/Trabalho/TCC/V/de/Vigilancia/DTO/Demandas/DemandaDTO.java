package TCC.Trabalho.TCC.V.de.Vigilancia.DTO.Demandas;

import java.sql.Date;
import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonFormat;
import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Demanda.Categoria_Demanda;
import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Demanda.TipoApoio;
import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Demanda.statusDemanda;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DemandaDTO {
    private Long id;
    private String titulo;
    private String descricao;

    @CreationTimestamp
    @JsonFormat(pattern = "yyyy-MM-dd") // Apenas a data
    private LocalDate data_postagem;

    private Categoria_Demanda categoria;
    private statusDemanda status;
    private String cidade;
    private String estado;

    private TipoApoio tipoApoio; 

    // Apenas o ID do usuário
    @NotNull(message = "O ID do usuário é obrigatório")
    private Long usuario;

    // Campos extras
    @Transient
    private String usuarioNome;

    @Transient
    private String usuarioFoto;

    @Transient
    private String usuarioTipo;
}
