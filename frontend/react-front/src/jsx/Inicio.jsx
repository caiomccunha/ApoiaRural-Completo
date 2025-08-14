import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../css/telaInicialReact.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import perfilPadrao from "../IMG/icon perfil novo.png";
import post1Img from "../IMG/CrisViana.jpg";
import post2Img from "../IMG/AgroTech.jpg";
import iotImg from "../IMG/Iot.jpg";
import tashaImg from "../IMG/Tasha.jpg";
import kyanImg from "../IMG/Kyan.jpg";

const MySwal = withReactContent(Swal);

const Inicio = () => {
    const [usuario, setUsuario] = useState(null);
    const [activeTab, setActiveTab] = useState('feed');
    const [conteudoPost, setConteudoPost] = useState('');
    const [curtidas, setCurtidas] = useState({});
    const navigate = useNavigate();
    const [filtros, setFiltros] = useState({
        tipo_usuario : null,
        ordenação: 'recentes'
    });
    const [posts, setPosts] = useState([]);

    // --- ESTADOS PARA POSTAGEM ---
    const MAX_CHARS = 280;
    const [text, setText] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isPosting, setIsPosting] = useState(false);
    const isPostButtonDisabled = isPosting || (!text.trim() && !selectedFile);
    const charCounterColor = text.length > MAX_CHARS ? 'red' : undefined;

    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    useEffect(() => {
    if (!usuarioLogado) {
        navigate('/login');
        return;
    }

    setUsuario(prev => {
        const novaFoto = `http://localhost:8080/tcc/usuarios/${usuarioLogado.id}/foto`;
        // só atualiza se mudou algo
        if (prev?.id === usuarioLogado.id && prev?.foto === novaFoto) {
        return prev;
        }
        return {
        ...usuarioLogado,
        foto: novaFoto,
        };
    });
    }, [usuarioLogado, navigate]);


    useEffect(() => {
        if (!selectedFile) {
            setPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const Toast = MySwal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        },
    });

    // Adicione a função fetchPosts para buscar os posts do backend
    const fetchPosts = async () => {
    try {
        const response = await fetch(`http://localhost:8080/api/posts`);
        if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao buscar posts: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        setPosts(data);
        console.log("Posts carregados:", data); // Mantido para depuração
    } catch (err) {
        console.error("Erro ao buscar posts:", err);
        Toast.fire({
        icon: "error",
        title: err.message,
        });
    }
    };

    useEffect(() => {
         fetchPosts();
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 30 * 1024 * 1024) {
            Toast.fire({
                icon: "warning",
                title: "Arquivo muito grande! O limite é 30MB.",
            });
            event.target.value = "";
            return;
            }
            setSelectedFile(file);
        }
    };

    const handleRemoveMedia = () => {
        setSelectedFile(null);
        setPreview(null);
        const imgInput = document.getElementById('imageUpload');
        const vidInput = document.getElementById('videoUpload');
        if (imgInput) imgInput.value = '';
        if (vidInput) vidInput.value = '';
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsPosting(true);
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
        const formData = new FormData();
        formData.append(
            "post",
            JSON.stringify({
            message: text.trim() || null,
            })
        );
        formData.append("autorId", usuarioLogado.id);
        if (selectedFile) {
            formData.append("file", selectedFile);
        }
        try {
            const response = await fetch("http://localhost:8080/api/posts", {
            method: "POST",
            body: formData,
            });
            if (!response.ok) {
            const errorData = await response.text();
            throw new Error(
                `Falha ao criar o post. Status: ${response.status}. Detalhes: ${errorData}`
            );
            }
            await fetchPosts();
            setText("");
            setSelectedFile(null);
            setPreview(null);
            Toast.fire({
            icon: "success",
            title: "Post criado com sucesso!",
            });
        } catch (error) {
            console.error("Erro detalhado:", error);
            Toast.fire({
            icon: "error",
            title: "Ocorreu um erro ao criar o post.",
            });
        } finally {
            setIsPosting(false);
        }
    };


    const filtrarPosts = (posts) => {
        console.log(posts);
        let postsFiltrados = [...posts];
        
        // Filtro por tipo de usuário
        if (filtros.tipoUsuario) {
            postsFiltrados = postsFiltrados.filter(post => 
            post.tipoUsuario === filtros.tipoUsuario
            );
        }
        
        // Ordenação
        if (filtros.ordenacao === 'recentes') {
            postsFiltrados.sort((a, b) => new Date(b.horario_postagem) - new Date(a.horario_postagem));
        } else {
            postsFiltrados.sort((a, b) => b.likes - a.likes);
        }
        
        return postsFiltrados;
    };


    useEffect(() => {
        if (!usuario?.id || posts.length === 0) return;
        const verificarCurtidas = async () => { 
            const status = {};
            for (const post of posts) {
                try {
                    const res = await fetch(
                        `http://localhost:8080/api/posts/${post.id}/likedBy/${usuario.id}`
                    );
                    const data = await res.json();
                    status[post.id] = data;
                } catch (error) {
                    console.error(`Erro ao verificar curtida do post ${post.id}:`, error);
                }
            }
            setCurtidas(status);
        };

        if (posts.length > 0) {
            verificarCurtidas();
        }
    }, [posts, usuario?.id]);

    const handleLike = async (postId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/posts/${postId}/like/${usuario.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Erro ao curtir/descurtir a postagem");
            }
            const likedPost = posts.find((post) => post.id == postId);
            if (curtidas[postId]) {
                likedPost.likes--;
            } else {
                likedPost.likes++;
            }
            posts.map((post) => {
                if (post.id == postId) {
                    return likedPost;
                }
            })
            setCurtidas((prev) => ({
                ...prev,
                [postId]: !prev[postId],
            }));
        } catch (error) {
            console.error(error);
        }
    };

// Atualiza likedPosts ao carregar posts (supondo que o backend retorna se o usuário curtiu cada post)
//useEffect(() => {
 //   setLikedPosts(posts.filter(post => post.curtidoPorUsuario).map(post => post.id));
//}, [posts]);

// Modal para comentar
const [showCommentModal, setShowCommentModal] = useState(false);
const [modalCommentText, setModalCommentText] = useState('');
const [modalPostId, setModalPostId] = useState(null);

const openCommentModal = (postId) => {
  if (!postId) {
    Toast.fire({
      icon: "error",
      title: "ID do post inválido!",
    });
    return;
  }
  setModalPostId(postId);
  setModalCommentText("");
  setShowCommentModal(true);
};

const closeCommentModal = () => {
  setShowCommentModal(false);
  setModalCommentText("");
  setModalPostId(null);
};

const sendModalComment = async () => {
  if (!modalPostId) {
    Toast.fire({
      icon: "error",
      title: "ID do post inválido!",
    });
    return;
  }
  try {
    console.log("alo"); // Mantido para depuração
    await fetch(
      `http://localhost:8080/api/comments/post/${modalPostId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: modalCommentText,
          usuarioId: usuario.id,
        }),
      }
    );
    closeCommentModal();
    fetchPosts();
  } catch (err) {
    Toast.fire({
      icon: "error",
      title: "Erro ao comentar",
    });
  }
};

const handleShare = (postId) => {
  const url = `${window.location.origin}/post/${postId}`;
  navigator.clipboard.writeText(url);
  Toast.fire({
    icon: "success",
    title: "Link do post copiado!",
  });
};

    if (!usuario) {
        return (
            <div className="loading-screen">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <p>Carregando perfil...</p>
            </div>
        );
    }

    return (
        <div className="tela-inicial">
            {/* Navigation */}
            <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
                <div className="container">
                    <a className="navbar-brand" href="../jsx/Inicio.jsx">
                        <i className="fas fa-seedling me-2"></i> ApoiaRural
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    {/* Links externos: GitHub, Email, Instagram */}
                    <div className="d-flex align-items-center ms-auto gap-2">
                        <a href="https://github.com/caiomccunha/ApoiaRural-Completo" target="_blank" rel="noopener noreferrer" className="btn btn-outline-light" title="GitHub">
                            <i className="fab fa-github"></i>
                        </a>
                        <a href="" target="_blank" rel="noopener noreferrer" className="btn btn-outline-light" title="Email">
                            <i className="fas fa-envelope"></i>
                        </a>
                        <a href="https://instagram.com/seuusuario" target="_blank" rel="noopener noreferrer" className="btn btn-outline-light" title="Instagram">
                            <i className="fab fa-instagram"></i>
                        </a>
                    </div>
                    <div className="dropdown ms-2">
                    <button 
                        className="btn btn-outline-light dropdown-toggle" 
                        type="button"
                        data-bs-toggle="dropdown" 
                        aria-expanded="false"
                    >
                        <i className="fas fa-sort me-1"></i>
                        {filtros.ordenacao === 'recentes' ? 'Mais recentes' : 'Mais populares'}
                    </button>
                    <ul className="dropdown-menu">
                        <li>
                        <a 
                            className="dropdown-item" 
                            href="#"
                            onClick={(e) => {
                            e.preventDefault();
                            setFiltros({...filtros, ordenacao: 'recentes'});
                            }}
                        >
                            Mais recentes
                        </a>
                        </li>
                        <li>
                        <a 
                            className="dropdown-item" 
                            href="#"
                            onClick={(e) => {
                            e.preventDefault();
                            setFiltros({...filtros, ordenacao: 'populares'});
                            }}
                        >
                            Mais populares
                        </a>
                        </li>
                    </ul>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <div className="row">
                    {/* Sidebar */}
                    <div className="col-lg-3">
                        <div className="sidebar">
                            <div className="sidebar-header">
                                <a href="/perfil">
                                    <img 
                                      src={usuario?.foto ? usuario.foto : perfilPadrao}
                                      className="post-avatar" 
                                      alt="Foto do usuário" 
                                      onError={e => { e.target.onerror=null; e.target.src=perfilPadrao; }}
                                    />
                                </a>
                                <h5 id='nome-usuario'>{usuario.nome}</h5>
                                <p className="mb-0">
                                    {usuario.tipo_usuario} • {usuario.cidade}
                                </p>
                            </div>
                            <div className="sidebar-content">
                                <ul className="sidebar-menu">
                                    <li>
                                        <Link 
                                            to="/inicio" 
                                            className={activeTab === 'feed' ? 'active' : ''}
                                            onClick={() => setActiveTab('feed')}
                                        >
                                            <i className="fas fa-home"></i>Feed Principal
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            to="/mensagens"
                                            className={activeTab === 'mensagens' ? 'active' : ''}
                                            onClick={() => setActiveTab('mensagens')}
                                        >
                                            <i className="fas fa-message"></i>Mensagens
                                        </Link>
                                    </li>
                        
                                    <li>
                                        <Link 
                                            to="/demandas"
                                            className={activeTab === 'demandas' ? 'active' : ''}
                                            onClick={() => setActiveTab('demandas')}
                                        >
                                            <i className="fas fa-handshake"></i>Demandas
                                        </Link>
                                    </li>

                                    <li>
                                        <Link 
                                            to="/perfil"
                                            className={activeTab === 'perfil' ? 'active' : ''}
                                            onClick={() => setActiveTab('perfil')}
                                        >
                                            <i className="fas fa-circle-user"></i>Perfil
                                        </Link>
                                    </li>
                                
                                </ul>
                            </div>
                        </div>

                        {/* Weather Widget */}
                        <div className="weather-widget">
                            <h6><i className="fas fa-map-marker-alt me-2"></i>{usuario.cidade}</h6>
                            <div className="weather-temp">28°C</div>
                            <p className="mb-2">Parcialmente nublado</p>
                            <div className="row text-center">
                                <div className="col-4">
                                    <small>Hoje<br /><strong>32°/20°</strong></small>
                                </div>
                                <div className="col-4">
                                    <small>Amanhã<br /><strong>30°/18°</strong></small>
                                </div>
                                <div className="col-4">
                                    <small>Sexta<br /><strong>25°/15°</strong></small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-lg-6">
                        {/* Feed Section */}
                        <div id="feed-section" style={{ display: activeTab === 'feed' ? 'block' : 'none' }}>
                            {/* Create Post Adaptado */}
                            <div className="create-post">
    <div className="container">
        <div className="row justify-content-center">
            <div className="col-md-8 col-lg-12">
                <div className="card post-creation-card p-2">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="d-flex align-items-start mb-3">
                                <img src={usuario?.foto_perfil?.value != null ? usuario.foto_perfil : perfilPadrao} alt="Foto do Perfil" className="rounded-circle me-3 profile-pic post-avatar" />
                                <textarea
                                    id="postTextarea"
                                    className="form-control post-textarea"
                                    rows="3"
                                    placeholder={`No que você está pensando, ${usuario?.nome?.split(' ')[0] || ''}?`}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />
                            </div>
                            {preview && (
                                <div id="mediaPreview">
                                    {selectedFile.type.startsWith('image/') ? (
                                        <img src={preview} alt="Preview" className="img-fluid rounded" />
                                    ) : (
                                        <video src={preview} controls className="img-fluid rounded" />
                                    )}
                                    <button type="button" className="remove-media-btn" onClick={handleRemoveMedia}>&times;</button>
                                </div>
                            )}
                            <div className="d-flex justify-content-end align-items-center mt-2">
                                <span id="charCounter" className="text-muted small" style={{ color: charCounterColor }}>
                                    {text.length} / {MAX_CHARS}
                                </span>
                            </div>
                            <hr className="my-2" />
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex">
                                    <label htmlFor="imageUpload" className="action-btn d-flex align-items-center me-2">
                                        <i className="bi bi-image-fill"></i> Foto
                                    </label>
                                    <input type="file" id="imageUpload" className="file-input" accept="image/*" onChange={handleFileChange} />
                                    <label htmlFor="videoUpload" className="action-btn d-flex align-items-center">
                                        <i className="bi bi-film"></i> Vídeo
                                    </label>
                                    <input type="file" id="videoUpload" className="file-input" accept="video/*" onChange={handleFileChange} />
                                </div>
                                <button type="submit" className="btn btn-primary fw-bold rounded-pill px-4" disabled={isPostButtonDisabled}>
                                    {isPosting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Postando...
                                        </>
                                    ) : (
                                        'Postar'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

                            {/* Posts dinâmicos do backend */}
                            {posts.length === 0 ? (
    <div className="text-center text-muted mt-4">Nenhum post encontrado.</div>
) : (
    filtrarPosts(posts).map((post) => {
        let fotoAutorSrc = perfilPadrao;
        if(post.fotoPost) {
            fotoAutorSrc = `http://localhost:8080/tcc/usuarios/${post.autor}/foto`;
        }
        return (
        <div className="post-card card" key={post.id}>
            <div className="post-header">
                <img
                    src={fotoAutorSrc}
                    className="post-avatar"
                    alt={post.autorNome || 'Usuário'}
                    // onError={e => { e.target.onerror=null; e.target.src=perfilPadrao; }}
                />
                <div className="post-author">
                    <h6>
                        <a className="profileAnchor" href={"/perfil/" + post.autor}>
                            {post.autorNome || 'Usuário'}
                        </a>
                    </h6>
                    <small>
                    <i className="fas fa-clock me-1"></i>
                    {post.horario_postagem 
                        ? new Date(post.horario_postagem).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                            }) 
                        : ''}
                    </small>
                </div>
                <div className="dropdown">
                    <button className="btn btn-sm" data-bs-toggle="dropdown">
                        <i className="fas fa-ellipsis-h"></i>
                    </button>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#">Salvar post</a></li>
                        <li><a className="dropdown-item" href="#">Denunciar</a></li>
                    </ul>
                </div>
            </div>
            <div className="post-content">
                <p>{post.message}</p>
                {(post.fotoPost) && (
                    <img
                        src={`http://localhost:8080/api/posts/${post.id}/image`}
                        className="post-image"
                        alt="Mídia do post"
                        onError={e => e.target.style.display = 'none'}
                    />
                )}
                {post.comments && post.comments.length > 0 && (
                    <div className="comments-list mt-2">
                        <h6 className="fw-bold mb-2">Comentários</h6>
                        {post.comments.map((comment) => {
                            return (
                                <div key={comment.id} className="comment-item d-flex align-items-start mb-2">
                                    <img
                                        src= {comment.usuario.foto_perfil? 
                                            `http://localhost:8080/tcc/usuarios/${comment.usuario.id}/foto` : perfilPadrao}
                                        className="post-avatar me-2"
                                        alt={comment.usuario?.nome || 'Usuário'}
                                        style={{ width: 32, height: 32 }}
                                    />
                                    <div style={{ textAlign: 'left' }}>
                                        <span className="fw-bold">{comment.usuario.nome || 'Usuário'}: </span>
                                        <span className="comment-content">{comment.content}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <div className="post-actions">
                <button
                    className="btn-action"
                    style={{ color: curtidas[post.id] ? 'green' : '#555' }}
                    onClick={() => handleLike(post.id)}
                >
                    <i 
                        style={{ color: curtidas[post.id] ? 'green' : '#555'}}
                        className = {curtidas[post.id] ? "far fa-heart me-1" : "far fa-heart me-1"}
                    ></i> {curtidas[post.id] ? "Descurtir" : "Curtir"} ({post.likes || 0})
                </button>   
                <button className="btn-action" onClick={() => openCommentModal(post.id)}>
                    <i className="far fa-comment me-1"></i>Comentar ({post.comments ? post.comments.length : 0})
                </button>
                <button className="btn-action" onClick={() => handleShare(post.id)}>
                    <i className="fas fa-share me-1"></i>Compartilhar
                </button>
            </div>
        </div>
        );
    })
)}

                        </div>

                        {/* Research Section - mantido como estava */}
                    </div>

                    {/* Right Sidebar */}
                    <div className="col-lg-3">
                        {/* News Widget */}
                        <div className="sidebar">
                            <div className="sidebar-header">
                                <h6><i className="fas fa-newspaper me-2"></i>Notícias do Agro</h6>
                            </div>
                            <div className="sidebar-content p-0">
                                {/* Conteúdo mantido */}
                            </div>
                        </div>

                        {/* Suggested Connections */}
                        <div className="sidebar">
                            <div className="sidebar-header">
                                <h6><i className="fas fa-users me-2"></i>Sugestões para Você</h6>
                            </div>
                            <div className="sidebar-content">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="position-relative">
                                        <img src={tashaImg} className="post-avatar" alt="Ana Rosa" />
                                        <span className="online-status"></span>
                                    </div>
                                    <div className="ms-3 flex-grow-1">
                                        <h6 className="mb-0 small">Ana Rosa</h6>
                                        <small className="text-muted">Especialista em Café</small>
                                    </div>
                                    <button className="btn btn-outline-primary btn-sm">+</button>
                                </div>
                                
                                <div className="d-flex align-items-center mb-3">
                                    <img src={kyanImg} className="post-avatar" alt="Roberto Farias" />
                                    <div className="ms-3 flex-grow-1">
                                        <h6 className="mb-0 small">Roberto Farias</h6>
                                        <small className="text-muted">Pecuarista</small>
                                    </div>
                                    <button className="btn btn-outline-primary btn-sm">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Comentários */}
            {showCommentModal && (
            <div className="modal" style={{ display: 'block', background: 'rgba(0,0,0,0.5)', position: 'fixed', top:0, left:0, width:'100vw', height:'100vh', zIndex:9999 }}>
                <div className="modal-dialog" style={{ margin: '10vh auto', maxWidth: 400 }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Comentar</h5>
                            <button type="button" className="btn-close" onClick={closeCommentModal}></button>
                        </div>
                        <div className="modal-body">
                        <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Digite seu comentário..."
                            value={modalCommentText}
                            onChange={e => setModalCommentText(e.target.value)}
                        />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeCommentModal}>Cancelar</button>
                            <button type="button" className="btn btn-primary" onClick={sendModalComment}>Enviar</button>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};

export default Inicio;
