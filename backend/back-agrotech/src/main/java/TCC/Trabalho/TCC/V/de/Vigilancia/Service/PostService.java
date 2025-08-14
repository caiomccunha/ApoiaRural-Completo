package TCC.Trabalho.TCC.V.de.Vigilancia.Service;

import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Postagens.Post;
import TCC.Trabalho.TCC.V.de.Vigilancia.Repository.PostRepository;
import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Usuario.UsuarioModel;
import TCC.Trabalho.TCC.V.de.Vigilancia.Repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final UsuarioRepository usuarioRepository;

    public PostService(PostRepository postRepository, UsuarioRepository usuarioRepository){
        this.postRepository = postRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Post> getAllPost() {
        return postRepository.findAll();
    }

    public Optional<Post> getPostById(Long id){
        return postRepository.findById(id);
    }

    // MÉTODO CREATE ATUALIZADO PARA SALVAR NO BANCO
    public Post createPost(Post post, MultipartFile file, Long autorId) throws IOException {
        if (file != null && !file.isEmpty()) {
            System.out.println("Arquivo recebido: " + file.getOriginalFilename() + ", tipo: " + file.getContentType() + ", tamanho: " + file.getSize());
            post.setNomeArquivoPost(file.getOriginalFilename());
            post.setTipoMimePost(file.getContentType());
            post.setFotoPost(file.getBytes());
        } else {
            System.out.println("Nenhum arquivo recebido para o post.");
        }
        if (autorId != null) {
            UsuarioModel autor = usuarioRepository.findById(autorId).orElseThrow(() -> new RuntimeException("Autor não encontrado"));
            post.setAutor(autor);
        }
        return postRepository.save(post);
    }

    public Post updatePost(Long id, Post postDetails){
        Post post = postRepository.findById(id).orElseThrow();
        post.setMessage(postDetails.getMessage());
        // Aqui você poderia adicionar lógica para atualizar a foto também, se necessário
        return postRepository.save(post);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    public void curtirPost(Long postId, Long usuarioId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post não encontrado."));
        UsuarioModel usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));


        if (post.getLikedBy().contains(usuario)) post.getLikedBy().remove(usuario);
        else post.getLikedBy().add(usuario);

        post.setLikes(post.getLikedBy().size());

        postRepository.save(post);
    }

    public void likePost(Long postId, Long usuarioId) {
        Post post = postRepository.findById(postId).orElseThrow();
        UsuarioModel usuario = usuarioRepository.findById(usuarioId).orElseThrow();
        post.getLikedBy().add(usuario);
        post.setLikes(post.getLikedBy().size());
        postRepository.save(post);
    }

    public void unlikePost(Long postId, Long usuarioId) {
        Post post = postRepository.findById(postId).orElseThrow();
        UsuarioModel usuario = usuarioRepository.findById(usuarioId).orElseThrow();
        post.getLikedBy().remove(usuario);
        post.setLikes(post.getLikedBy().size());
        postRepository.save(post);
    }
}

