import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from './PostCard';

const Feed = ({ filtros, novoPostAdicionado }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                // Vou assumir que seu endpoint para buscar posts é este. Ajuste se necessário.
                const response = await axios.get('http://localhost:8080/tcc/posts');
                setPosts(response.data);
                setError(null);
            } catch (err) {
                setError("Não foi possível carregar os posts. Tente novamente mais tarde.");
                console.error("Erro ao buscar posts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [novoPostAdicionado]); // Recarrega o feed quando um novo post é adicionado

    const filtrarEOrdenarPosts = () => {
        let postsProcessados = [...posts];

        // Lógica de ordenação (simplifiquei a sua)
        if (filtros.ordenacao === 'recentes') {
            postsProcessados.sort((a, b) => new Date(b.data) - new Date(a.data));
        } else { // 'populares'
            postsProcessados.sort((a, b) => (b.curtidas || 0) - (a.curtidas || 0));
        }
        
        // Adicione aqui sua lógica de filtro por tipo de usuário se necessário
        
        return postsProcessados;
    };

    if (loading) {
        return <div className="text-center mt-5"><div className="spinner-border text-primary"></div><p>Carregando feed...</p></div>;
    }

    if (error) {
        return <div className="alert alert-danger mt-3">{error}</div>;
    }

    const postsRenderizar = filtrarEOrdenarPosts();

    return (
        <div>
            {postsRenderizar.length > 0 ? (
                postsRenderizar.map(post => (
                    <PostCard key={post.id} post={post} />
                ))
            ) : (
                <div className="text-center mt-5">
                    <p>Nenhuma publicação encontrada. Que tal criar a primeira?</p>
                </div>
            )}
        </div>
    );
};

export default Feed;