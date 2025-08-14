import React, { useState, useEffect } from "react";
    import { Link, useNavigate, useParams } from "react-router-dom";
    import "bootstrap/dist/css/bootstrap.min.css";
    import "@fortawesome/fontawesome-free/css/all.min.css";
    import Swal from "sweetalert2";
    import withReactContent from "sweetalert2-react-content";
    import perfilPadrao from "../IMG/icon perfil novo.png";
    import '../css/PerfilUser.css';

    const MySwal = withReactContent(Swal);

    export default function PerfilUser() {
    var{ id } = useParams()
    const [usuario, setUsuario] = useState(null);
    const [usuarioLogadoId, setUsuarioLogadoId] = useState(null);
    const [demandas, setDemandas] = useState([]);
    const [conectado, setConectado]= useState(false);
    const [loading, setLoading] = useState(true);

    const usuarioAtual = JSON.parse(localStorage.getItem('usuarioLogado'));

    if(id === undefined) id = usuarioAtual.id;

    useEffect(() => {

        if(usuarioAtual) setUsuarioLogadoId(usuarioAtual.id); 

        const fetchUsuario = async () => {
            try {
                const resUsuario = await fetch(`http://localhost:8080/tcc/usuarios/${id}`);
                const dataUsuario = await resUsuario.json();
                setUsuario(dataUsuario);

                const resDemandas = await fetch(`http://localhost:8080/tcc/demandas/usuario/${id}`);
                const dataDemandas = await resDemandas.json();
                setDemandas(Array.isArray(dataDemandas) ? dataDemandas : []);
            } catch(error) {
                console.error("Erro ao carregar perfil:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsuario();
    }, [id]);

    const proprioPerfil = usuario && usuarioLogadoId == id;

    const [fotoFile, setFotoFile] = useState(null);
    const [fotoPerfilUrl, setFotoPerfilUrl] = useState(perfilPadrao);
    const [editandoDemandaId, setEditandoDemandaId] = useState(null);
    const [demandaEdit, setDemandaEdit] = useState(null);
    const [fotoTimestamp, setFotoTimestamp] = useState(Date.now());
    const navigate = useNavigate();
    // Função para excluir usuário
    const handleExcluirUsuario = async () => {
        const result = await MySwal.fire({
            title: "Tem certeza?",
            text: "Essa ação não pode ser desfeita!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, excluir",
            cancelButtonText: "Cancelar"
        });

        if (!result.isConfirmed) return;

        try {
            await fetch(`http://localhost:8080/tcc/usuario/${usuario.id}`, {
                method: 'DELETE',
            });
            localStorage.removeItem('usuarioLogado');
            MySwal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Usuário excluído com sucesso!',
                showConfirmButton: false,
                timer: 3000
            });
            navigate('/login');
        } catch (err) {
            MySwal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Erro ao excluir usuário.',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };

    // Função para abrir edição de demanda
    const handleEditarDemanda = (demanda) => {
        setEditandoDemandaId(demanda.id);
        setDemandaEdit({ ...demanda });
    };

    // Função para salvar edição da demanda
    const handleSalvarDemandaEdit = async (e) => {
        e.preventDefault();
        const demandaParaSalvar = {
            ...demandaEdit,
            usuarioId: usuario.id,
            data_postagem: demandaEdit.data_postagem ||
                (demandas.find(d => d.id === editandoDemandaId)?.data_postagem) ||
                new Date().toISOString()
        };

        try {
            const res = await fetch(`http://localhost:8080/tcc/demandas/${editandoDemandaId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(demandaParaSalvar)
            });
            const data = await res.json();
            setDemandas(demandas.map(d => d.id === editandoDemandaId ? data : d));
            setEditandoDemandaId(null);
            setDemandaEdit(null);
            MySwal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Demanda editada com sucesso!',
                showConfirmButton: false,
                timer: 3000
            });
        } catch (err) {
            MySwal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Erro ao salvar edição da demanda.',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };

    // Função para cancelar edição de demanda
    const handleCancelarDemandaEdit = () => {
        setEditandoDemandaId(null);
        setDemandaEdit(null);
    };

    const [showModalExcluir, setShowModalExcluir] = useState(false);
    const [demandaParaExcluir, setDemandaParaExcluir] = useState(null);

    const handleExcluirDemanda = (demandaId) => {
      setDemandaParaExcluir(demandaId);
      setShowModalExcluir(true);
    };

    const confirmarExcluirDemanda = async () => {
        if (!demandaParaExcluir) return;
        try {
            await fetch(`http://localhost:8080/tcc/demandas/${demandaParaExcluir}`, {
                method: 'DELETE',
            });
            setDemandas(demandas.filter(d => d.id !== demandaParaExcluir));
            setShowModalExcluir(false);
            setDemandaParaExcluir(null);
            MySwal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Demanda excluída!',
                showConfirmButton: false,
                timer: 3000
            });
        } catch (err) {
            setShowModalExcluir(false);
            MySwal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: 'Erro ao excluir demanda.',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };

    useEffect(() => {
        if(usuarioLogadoId == id) return;
        const verificarConexao = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/tcc/usuarios/${usuarioAtual.id}/conectado/${id}`
                );
                const data = await res.json();
                setConectado(data);
            } catch (error) {
                console.error("Erro ao verificar conexão:", error);
            }
        };
        verificarConexao();
    }, [usuarioLogadoId, id]);

    const handleConectarUsuario = async () => {
        try {
            const response = await fetch(`http://localhost:8080/tcc/usuarios/${usuarioLogadoId}/conectar/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            if(!response.ok) {
                throw new Error("Erro ao conectar/desconectar-se com usuário");
            }
            setConectado(prev => !prev);
        } catch (error) {
            console.error(error);
        }
    };

    // Estados para demandas
        const [fotoPerfil, setFotoPerfil] = useState("");
        const [biografia, setBiografia] = useState("");
        const [email, setEmail] = useState("");
        const [telefone, setTelefone] = useState("");
        const [activeTab, setActiveTab] = useState('perfil');
        const [searchTerm, setSearchTerm] = useState('');
        const [filtros, setFiltros] = useState({ tipoUsuario: null, ordenacao: null });
        const [editando, setEditando] = useState(false);
        const [novaDemanda, setNovaDemanda] = useState({
            titulo: '',
            descricao: '',
            categoria: '',
            cidade: '',
            estado: '',
            status: '',
            data_postagem: '',
            tipoApoio: '',
        });
        const [formDemandaAberto, setFormDemandaAberto] = useState(false);
        const [carregandoDemandas, setCarregandoDemandas] = useState(false);
        const [posts, setPosts] = useState([]);
        const [carregandoPosts, setCarregandoPosts] = useState(false);
        const [novoPost, setNovoPost] = useState({ titulo: '', descricao: '', foto: '' });
        const [formPostAberto, setFormPostAberto] = useState(false);

        // Buscar demandas e posts do usuário ao carregar perfil
        useEffect(() => {
            if (!usuario) return;
            const fetchDemandas = async () => {
                setCarregandoDemandas(true);
                try {
                    const res = await fetch(`http://localhost:8080/tcc/demandas/usuario/${usuario.id}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    const data = await res.json();
                    setDemandas(Array.isArray(data) ? data : []);
                } catch (err) {
                    setDemandas([]);
                } finally {
                    setCarregandoDemandas(false);
                }
            };
            const fetchPosts = async () => {
                setCarregandoPosts(true);
                try {
                    const res = await fetch(`http://localhost:8080/api/posts/${usuario.id}`);
                    const data = await res.json();
                    setPosts(Array.isArray(data) ? data : []);
                } catch (err) {
                    setPosts([]);
                } finally {
                    setCarregandoPosts(false);
                }
            };
            fetchDemandas();
            fetchPosts();
        }, [usuario]);

        // Função para obter opções de categoria e tipo de apoio conforme o tipo de usuário
        const getOpcoesDemanda = (tipoUsuario) => {
            if (tipoUsuario && tipoUsuario.toLowerCase().includes('apoiador')) {
                return {
                    categorias: [
                        { value: 'graos', label: 'Grãos' },
                        { value: 'feijoes_raizes', label: 'Feijões/Raízes' },
                        { value: 'frutas_hortalicas', label: 'Frutas/Hortaliças' },
                        { value: 'verduras_ervas', label: 'Verduras/Ervas' },
                        { value: 'outros', label: 'Outros' }
                    ],
                    tiposApoio: [
                        { value: 'compra_direta', label: 'Compra Direta' },
                        { value: 'investimento_financeiro', label: 'Investimento Financeiro' },
                        { value: 'infraestrutura', label: 'Infraestrutura' },
                        { value: 'maquinario_equipamentos', label: 'Maquinário/Equipamentos' }
                    ]
                };
            }
            // Para outros tipos de usuário, só categorias
            return {
                categorias: [
                    { value: 'graos', label: 'Grãos' },
                    { value: 'feijoes_raizes', label: 'Feijões/Raízes' },
                    { value: 'frutas_hortalicas', label: 'Frutas/Hortaliças' },
                    { value: 'verduras_ervas', label: 'Verduras/Ervas' },
                    { value: 'outros', label: 'Outros' }
                ],
                tiposApoio: []
            };
        };

        // Função para criar nova demanda
        const handleCriarDemanda = async (e) => {
            e.preventDefault();
            if (!novaDemanda.titulo || !novaDemanda.descricao || !novaDemanda.categoria || !novaDemanda.status || (usuario?.tipo_usuario === 'apoiador' && !novaDemanda.tipoApoio)) {
                MySwal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'warning',
                    title: 'Preencha todos os campos obrigatórios.',
                    showConfirmButton: false,
                    timer: 3000
                });
                return;
            }

            try {
                const res = await fetch(`http://localhost:8080/tcc/demandas`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...novaDemanda,
                        usuarioId: usuario.id,
                        data_postagem: (novaDemanda.data_postagem || new Date().toISOString()).slice(0, 10),
                    })
                });
                const data = await res.json();
                setDemandas([data, ...demandas]);
                setNovaDemanda({
                    titulo: '', descricao: '', categoria: '', cidade: usuario.cidade, estado: usuario.estado, status: '', data_postagem: '', tipoApoio: ''
                });
                setFormDemandaAberto(false);
                MySwal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Demanda criada!',
                    showConfirmButton: false,
                    timer: 3000
                });
            } catch (err) {
                MySwal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: 'Erro ao criar demanda.',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        };


        const handleSalvarPerfil = async () => {
            if (!usuario) return;
            let fotoUrl = fotoPerfil;

            if (fotoFile) {
                const formData = new FormData();
                formData.append('file', fotoFile);
                try {
                    const resUpload = await fetch(`http://localhost:8080/tcc/usuarios/${usuario.id}/foto`, {
                        method: 'POST',
                        body: formData
                    });
                    const dataUpload = await resUpload.json();
                    fotoUrl = dataUpload.url || dataUpload.foto_perfil || fotoPerfil;
                    setFotoTimestamp(Date.now());
                } catch (err) {
                    MySwal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: 'error',
                        title: 'Erro ao fazer upload da foto.',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    return;
                }
            }

            const dadosAtualizados = {
                id: usuario.id,
                nome: usuario.nome || '',
                email: usuario.email || '',
                tipo_usuario: usuario.tipo_usuario || '',
                cidade: usuario.cidade || '',
                estado: usuario.estado || '',
                telefone: telefone || '',
                biografia: biografia || '',
                foto_perfil: fotoUrl || ''
            };

            try {
                const res = await fetch(`http://localhost:8080/tcc/usuarios/${usuario.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dadosAtualizados)
                });
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(errorText);
                }
                const data = await res.json();
                setUsuario(data);
                MySwal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Perfil atualizado com sucesso!',
                    showConfirmButton: false,
                    timer: 3000
                });
            } catch (err) {
                MySwal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'error',
                    title: 'Erro ao salvar alterações: ' + err.message,
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        };

        if (loading) return <div className="text-center mt-5">Carregando...</div>;
        if (!usuario) return <div className="alert alert-danger mt-5">Erro ao carregar perfil</div>;

        return (
            <div className="bg-light min-vh-100">
                <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow sticky-top">
                    <div className="container">
                        <Link className="navbar-brand" to="/inicio">
                            <i className="fas fa-leaf me-2"></i>ApoiaRural
                        </Link>
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
                                      src={`http://localhost:8080/tcc/usuarios/${usuarioAtual.id}/foto`} 
                                      className="post-avatar" 
                                      alt="Foto do usuário" 
                                      onError={e => { e.target.onerror=null; e.target.src=perfilPadrao; }}
                                    />
                                </a>
                                <h5 id='nome-usuario'>{usuarioAtual.nome}</h5>
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
                    </div>

                        {/* Conteúdo principal */}

                        <div className="col-lg-9">
                            <div className="card mb-4">
                                <div className="card-body bodyType01">
                                    <div className="row mb-3">
                                        <div className="col-md-3 text-center">
                                            <img
                                                src={`http://localhost:8080/tcc/usuarios/${usuario.id}/foto`}
                                                alt="Foto do usuário"
                                                className="img-fluid rounded-circle mb-2"
                                                style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                                onError={e => { e.target.onerror=null; e.target.src=perfilPadrao; }}
                                            />
                                        </div>
                                        <div className="col-md-7">
                                            <h5>{usuario.nome}</h5>
                                            <p className="mb-1"><strong>Tipo de Usuário:</strong> {usuario.tipo_usuario}</p>
                                            <p className="mb-1"><strong>Cidade:</strong> {usuario.cidade}</p>
                                            <p className="mb-1"><strong>Email:</strong> {usuario.email}</p>
                                            <p className="mb-1"><strong>Telefone:</strong> {usuario.telefone}</p>
                                        </div>
                                        <div className="col-md-2">
                                            {/* Botão para editar perfil */}
                                            {!editando && proprioPerfil ? (
                                                <>
                                                    <button title="Editar informações" className="btn btn-editarPerfil mb-3" onClick={() => setEditando(true)}>
                                                        <i className="fas fa-pencil"></i>
                                                    </button>
                                                    <button title="Deletar conta" className="btn btn-excluir mb-3" onClick={handleExcluirUsuario}>
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </>
                                            ) : (
                                                !proprioPerfil && (
                                                    <div>
                                                        <button
                                                            className={`btn mb-3 ${conectado ? "btn-danger" : "btn-success"}`}
                                                            onClick={handleConectarUsuario}
                                                        >
                                                            <i className={`${conectado ? "fas fa-user-times" : "fas fa-user-plus"}`}>
                                                            </i>
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    {/* Formulário de edição */}
                                    {editando && (
                                        <>
                                            <div className="mb-3">
                                                <label className="form-label"><strong>Nome</strong></label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={usuario.nome}
                                                    onChange={e => setUsuario({ ...usuario, nome: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label"><strong>Biografia</strong></label>
                                                <textarea
                                                    className="form-control"
                                                    rows={4}
                                                    value={biografia}
                                                    onChange={e => setBiografia(e.target.value)}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label"><strong>Foto de Perfil (URL)</strong></label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    accept="image/*"
                                                    onChange={e => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            setFotoFile(e.target.files[0]);
                                                            setFotoPerfil(URL.createObjectURL(e.target.files[0]));   
                                                    }
                                                }}
                                                />

                                                {fotoPerfil && (
                                                    <div className="mt-2 text-center">
                                                        <img src={fotoPerfil} alt="Preview" style={{width : 80, height : 80, borderRadius: '50%', objectFit: 'cover', border: '2px solide #eee'}}/>
                                                    </div>
                                                )}
                                            </div>
                                    
                                            <div className="mb-3">
                                                <label className="form-label"><strong>Telefone</strong></label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    value={telefone}
                                                    onChange={e => setTelefone(e.target.value)}
                                                />
                                            </div>
                                            <button className="btn btn-success me-2" onClick={handleSalvarPerfil}>
                                                Salvar Alterações
                                            </button>
                                            <button className="btn btn-secondary" onClick={() => setEditando(false)}>
                                                Cancelar
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            {/* Área de demandas e posts do usuário */}
                            <div className="card mb-4">
                                <div className="card-body bodyType01">
                                    {proprioPerfil ? (
                                        <h5 className="mb-3">Minhas Demandas</h5>
                                    ) : (
                                        <h5 className="mb-3">Demandas de {usuario.nome}</h5>
                                    )}
                                    {/* Botão para abrir formulário de nova demanda */}
                                    {proprioPerfil && !formDemandaAberto && (
                                        <button className="btn btn-success mb-3" onClick={() => setFormDemandaAberto(true)}>
                                            Nova Demanda
                                        </button>
                                    )}
                                    {/* Formulário completo de demanda */}
                                    {formDemandaAberto && usuario && (
                                        <form onSubmit={handleCriarDemanda} className="mb-3">
                                            <div className="mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Título da demanda"
                                                    value={novaDemanda.titulo}
                                                    onChange={e => setNovaDemanda({ ...novaDemanda, titulo: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <textarea
                                                    className="form-control"
                                                    placeholder="Descrição da demanda"
                                                    rows={2}
                                                    value={novaDemanda.descricao}
                                                    onChange={e => setNovaDemanda({ ...novaDemanda, descricao: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            {/* Campo categoria só para produtor (case-insensitive) */}
                                            {usuario.tipo_usuario && (
                                                <div className="mb-2">
                                                    <select
                                                        className="form-control"
                                                        value={novaDemanda.categoria}
                                                        onChange={e => setNovaDemanda({ ...novaDemanda, categoria: e.target.value })}
                                                    >
                                                        <option value="">Selecione a categoria</option>
                                                        {getOpcoesDemanda(usuario.tipo_usuario).categorias.map(opt => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            {/* Campo tipo de apoio só para apoiador (case-insensitive) */}
                                            {usuario.tipo_usuario && usuario.tipo_usuario.toLowerCase().includes('apoiador') && (
                                                <div className="mb-2">
                                                    <select
                                                        className="form-control"
                                                        value={novaDemanda.tipoApoio}
                                                        onChange={e => setNovaDemanda({ ...novaDemanda, tipoApoio: e.target.value })}
                                                        
                                                    >
                                                        <option value="">Selecione o tipo de apoio</option>
                                                        {getOpcoesDemanda(usuario.tipo_usuario).tiposApoio.map(opt => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            <div className="mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Cidade"
                                                    value={usuario.cidade}
                                                    onChange={e => setNovaDemanda({ ...novaDemanda, cidade: usuario.cidade })}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Estado"
                                                    value={usuario.estado}
                                                    onChange={e => setNovaDemanda({ ...novaDemanda, estado: usuario.estado})}
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="mb-2">
                                                <select
                                                    className="form-control"
                                                    value={novaDemanda.status}
                                                    onChange={e => setNovaDemanda({ ...novaDemanda, status: e.target.value })}
                                                    required
                                                >
                                                    <option value="">Selecione o status</option>
                                                    <option value="aberta">Aberta</option>
                                                    <option value="fechada">Fechada</option>
                                                </select>
                                            </div>

                                            <button type="submit" className="btn btn-success me-2">Criar Demanda</button>
                                            <button type="button" className="btn btn-secondary" onClick={() => setFormDemandaAberto(false)}>Cancelar</button>
                                        </form>
                                    )}
                                    <hr />
                                    {carregandoDemandas ? (
                                        <div>Carregando demandas...</div>
                                    ) : (
                                        <ul className="list-group">
                                            {demandas.length === 0 && <li className="list-group-item">Nenhuma demanda criada.</li>}
                                            {demandas.map((demanda) => (
                                                <li key={demanda.id} className="list-group-item">
                                                    {editandoDemandaId === demanda.id ? (
                                                        <form onSubmit={handleSalvarDemandaEdit} className="mb-2">
                                                            <div className="mb-2">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={demandaEdit.titulo}
                                                                    onChange={e => setDemandaEdit({ ...demandaEdit, titulo: e.target.value })}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="mb-2">
                                                                <textarea
                                                                    className="form-control"
                                                                    value={demandaEdit.descricao}
                                                                    onChange={e => setDemandaEdit({ ...demandaEdit, descricao: e.target.value })}
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="mb-2">
                                                                <select
                                                                    className="form-control"
                                                                    value={demandaEdit.categoria}
                                                                    onChange={e => setDemandaEdit({ ...demandaEdit, categoria: e.target.value })}
                                                                    required
                                                                >
                                                                    <option value="">Selecione a categoria</option>
                                                                    <option value="graos">Grãos</option>
                                                                    <option value="feijoes_raizes">Feijões/Raízes</option>
                                                                    <option value="frutas_hortalicas">Frutas/Hortaliças</option>
                                                                    <option value="verduras_ervas">Verduras/Ervas</option>
                                                                    <option value="outros">Outros</option>
                                                                </select>
                                                            </div>
                                                            
                                                            <div className="mb-2">
                                                                <select
                                                                    className="form-control"
                                                                    value={demandaEdit.status}
                                                                    onChange={e => setDemandaEdit({ ...demandaEdit, status: e.target.value })}
                                                                    required
                                                                >
                                                                    <option value="">Selecione o status</option>
                                                                    <option value="aberta">Aberta</option>
                                                                    <option value="fechada">Fechada</option>
                                                                </select>
                                                            </div>
                                                            <button type="submit" className="btn btn-success me-2">Salvar</button>
                                                            <button type="button" className="btn btn-secondary" onClick={handleCancelarDemandaEdit}>Cancelar</button>
                                                        </form>
                                                    ) : (
                                                        <>
                                                            <strong>{demanda.titulo}</strong> <span className="badge bg-info ms-2">{demanda.categoria}</span>
                                                            <p className="mb-0">{demanda.descricao}</p>
                                                            <small className="text-muted">Cidade: {usuario.cidade} | Estado: {usuario.estado} | Status: {demanda.status}</small>
                                                            {!editando && proprioPerfil && (
                                                            <div className="mt-2">
                                                                <button className="btn btn-editar" onClick={() => handleEditarDemanda(demanda)}>
                                                                    Editar
                                                                </button>
                                                                <button className="btn btn-delete" onClick={() => handleExcluirDemanda(demanda.id)}>
                                                                    Excluir
                                                                </button>
                                                            </div>
                                                            )}
                                                        </>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Bootstrap para confirmação de exclusão de demanda */}
                <div className={`modal fade${showModalExcluir ? ' show d-block' : ''}`} tabIndex="-1" role="dialog" style={{background: showModalExcluir ? 'rgba(0,0,0,0.5)' : 'none'}}>
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Confirmar exclusão</h5>
                        <button type="button" className="btn-close" onClick={() => setShowModalExcluir(false)} aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                        <p>Tem certeza que deseja excluir esta demanda? Esta ação não pode ser desfeita.</p>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setShowModalExcluir(false)}>Cancelar</button>
                        <button type="button" className="btn btn-danger" onClick={confirmarExcluirDemanda}>Excluir</button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        );
    };