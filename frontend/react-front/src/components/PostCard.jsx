import React from 'react';
import perfilPadrao from "../IMG/icon perfil novo.png"; // Ajuste o caminho se necessário
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Este componente renderiza um único post
const PostCard = ({ post }) => {
    // Formata a data para "X minutos/horas atrás"
    const dataFormatada = formatDistanceToNow(new Date(post.data), {
        addSuffix: true,
        locale: ptBR,
    });

    // Assume que a URL da foto do autor e do post já vem do backend
    const fotoAutorUrl = post.autorFoto ? post.autorFoto : perfilPadrao;
    console.log(post.autorFoto)
    const fotoPostUrl = post.urlImagem ? `http://localhost:8080/tcc/posts/${post.id}/imagem` : null;

    return (
        <div className="post-card card">
            <div className="post-header">
                <img src={fotoAutorUrl} className="post-avatar" alt={post.autor.nome} />
                <div className="post-author">
                    <h6>{post.autor.nome}</h6>
                    <small>
                        <i className="fas fa-map-marker-alt me-1"></i>
                        {post.autor.cidade} • {dataFormatada}
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
                <p>{post.conteudo}</p>
                {fotoPostUrl && <img src={fotoPostUrl} className="post-image" alt="Conteúdo do post" />}
            </div>
            <div className="post-actions">
                <button className="btn-action">
                    <i className="far fa-heart me-1"></i>Curtir ({post.curtidas || 0})
                </button>
                <button className="btn-action">
                    <i className="far fa-comment me-1"></i>Comentar ({post.comentarios || 0})
                </button>
                <button className="btn-action">
                    <i className="fas fa-share me-1"></i>Compartilhar
                </button>
            </div>
        </div>
    );
};

export default PostCard;