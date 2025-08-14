package TCC.Trabalho.TCC.V.de.Vigilancia.Controller;

import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Postagens.Comment;
import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Postagens.Post;
import TCC.Trabalho.TCC.V.de.Vigilancia.Service.PostService;
import TCC.Trabalho.TCC.V.de.Vigilancia.Service.UsuarioService;
import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Usuario.UsuarioModel;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin (origins = "*")
public class PostController {
    private final PostService postService;
    private final UsuarioService usuarioService;
    private final ObjectMapper objectMapper;

    public PostController(PostService postService, UsuarioService usuarioService, ObjectMapper objectMapper) {
        this.postService = postService;
        this.usuarioService = usuarioService;
        this.objectMapper = objectMapper;
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createPost(@RequestPart("post") String postJson,
                                        @RequestPart(value = "file", required = false) MultipartFile file,
                                        @RequestParam("autorId") Long autorId) throws IOException {
        Post post = objectMapper.readValue(postJson, Post.class);
        if (post.getMessage() == null || post.getMessage().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("O campo 'message' do post é obrigatório.");
        }
        Post savedPost = postService.createPost(post, file, autorId);
        return ResponseEntity.ok(savedPost);
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getPostImage(@PathVariable Long id) {
        Post post = postService.getPostById(id).orElseThrow(() -> new RuntimeException("Post não encontrado"));

        if (post.getFotoPost() == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE, post.getTipoMimePost());

        return new ResponseEntity<>(post.getFotoPost(), headers, HttpStatus.OK);
    }

    @GetMapping
        public ResponseEntity<?> getAllPosts() {
            List<Post> posts = postService.getAllPost();
            List<PostResponse> response = posts.stream().map(post -> toResponse(post)).toList();
            return ResponseEntity.ok(response);
    }

    private PostResponse toResponse(Post post) {
        UsuarioModel autor = post.getAutor();
        return new PostResponse(post.getId(), post.getMessage(), post.getLikes(), 
        post.getFotoPost(), autor.getId(), autor.getNome(), post.getComments(), post.getHorario_postagem());
    }

    public static class PostResponse {
        public long id;
        public String message;
        public int likes;
        public byte[] fotoPost;
        public Long autor;
        public String autorNome;
        public List<Comment> comments;
        public LocalDateTime horario_postagem;
        public PostResponse(long id, String message, int likes, byte[] fotoPost,
        Long autor, String autorNome, List<Comment> comments, LocalDateTime horario_postagem) {
            this.id = id;
            this.message = message;
            this.fotoPost = fotoPost;
            this.likes = likes;
            this.autor = autor;
            this.autorNome = autorNome;
            this.comments = comments;
            this.horario_postagem = horario_postagem;
        }
    }

    @GetMapping("/{id}")
    public Post getPostById(@PathVariable Long id) {
        return postService.getPostById(id).orElseThrow();
    }

    @PutMapping("/{id}")
    public Post updatePost(@PathVariable Long id, @RequestBody Post post) {
        return postService.updatePost(id, post);
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable Long id) {
        postService.deletePost(id);
    }

    @GetMapping("/{postId}/likedBy/{usuarioId}")
    public boolean verificarCurtida(@PathVariable Long postId, @PathVariable Long usuarioId) {
        Post post = postService.getPostById(postId)
            .orElseThrow(() -> new RuntimeException("Post não encontrado"));
        UsuarioModel usuario = usuarioService.buscarUserPorID(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuário que curtiu não encontrado"));
        System.out.println(post.getLikedBy());
        System.out.println(usuario);
        return post.getLikedBy().contains(usuario);
    }

    @PutMapping("/{postId}/like/{usuarioId}")
    public void conectar(@PathVariable Long postId, @PathVariable Long usuarioId) {
        postService.curtirPost(postId, usuarioId);
    }
}
