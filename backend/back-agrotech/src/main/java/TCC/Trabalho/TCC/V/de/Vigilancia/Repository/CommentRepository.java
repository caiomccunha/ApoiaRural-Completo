package TCC.Trabalho.TCC.V.de.Vigilancia.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Postagens.Comment;

import java.util.List;
public interface CommentRepository extends JpaRepository<Comment, Long> {
	List<Comment> findByPostId(Long postId);
}

