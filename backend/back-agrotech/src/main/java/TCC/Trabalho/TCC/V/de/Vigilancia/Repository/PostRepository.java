package TCC.Trabalho.TCC.V.de.Vigilancia.Repository;

import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Postagens.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {}
