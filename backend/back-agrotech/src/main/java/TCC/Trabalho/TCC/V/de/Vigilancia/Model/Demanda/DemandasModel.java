package TCC.Trabalho.TCC.V.de.Vigilancia.Model.Demanda;

import java.time.LocalDate;

import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Usuario.UsuarioModel;
import jakarta.persistence.*;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "demandas")
@Getter
@Setter
@NoArgsConstructor

public class DemandasModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable =  false)
    private UsuarioModel usuario;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private String descricao;
    
     @Column(nullable = false)
    private LocalDate data_postagem;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Categoria_Demanda categoria;

    @Enumerated(EnumType.STRING)
    private statusDemanda status;

    @Column (nullable = false)
    private String cidade;

    @Column (nullable = false)
    private String estado;

    @Enumerated(EnumType.STRING)
    @Column
    private TipoApoio tipo_apoio;




}
