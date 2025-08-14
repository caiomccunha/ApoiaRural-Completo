package TCC.Trabalho.TCC.V.de.Vigilancia.Service;


import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Postagens.Post;
import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Usuario.UsuarioModel;
import TCC.Trabalho.TCC.V.de.Vigilancia.Repository.CommentRepository;
import TCC.Trabalho.TCC.V.de.Vigilancia.Repository.PostRepository;
import TCC.Trabalho.TCC.V.de.Vigilancia.Repository.UsuarioRepository;

import org.springframework.stereotype.Service;
import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Postagens.Comment;
import java.util.List;


@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UsuarioRepository usuarioRepository;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository, UsuarioRepository usuarioRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Comment addComment(Long postId, Comment comment, Long usuarioId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post não encontrado"));
        UsuarioModel usuario = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        comment.setPost(post);
        comment.setUsuario(usuario);
        // O usuário deve ser setado no comment antes de salvar (no front-end ou aqui)
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPostId(Long postId) {
        return commentRepository.findAll().stream()
                .filter(c -> c.getPost() != null && c.getPost().getId() == postId)
                .toList();
    }
    }

