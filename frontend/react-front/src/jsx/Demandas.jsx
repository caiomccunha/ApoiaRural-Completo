import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import perfilPadrao from "../IMG/icon perfil novo.png";
// Remover import duplicado de React

export default function Demandas() {
  const [filtros, setFiltros] = useState({ tipoUsuario: null, ordenacao: null });
  const [usuario, setUsuario] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [demandas, setDemandas] = useState([]);
  const [activeTab, setActiveTab] = useState('demandas');
  const [showModalDetalhes, setShowModalDetalhes] = useState(false);
  const [demandaSelecionada, setDemandaSelecionada] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) {
      navigate('/login');
      return;
    }
    setUsuario({
      ...usuarioLogado,
      foto: usuarioLogado.foto || perfilPadrao,
      tipo_usuario: usuarioLogado.tipo_usuario || "Usuário",
      cidade: usuarioLogado.cidade || "Local não informado",
      nome: usuarioLogado.nome || "Usuário",
      conexoes: usuarioLogado.conexoes || 127
    });
  }, []);

  useEffect(() => {
    async function fetchDemandas() {
      try {
        const res = await fetch("http://localhost:8080/tcc/demandas");
        let data = await res.json();

        if (filtros.tipoUsuario)
          data = data.filter(d => d.usuarioTipo === filtros.tipoUsuario);

        if (filtros.ordenacao === 'recentes')
          data = data.sort((a, b) => new Date(b.data_postagem) - new Date(a.data_postagem));

        if (searchTerm)
          data = data.filter(d =>
            d.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.descricao.toLowerCase().includes(searchTerm.toLowerCase())
          );

        setDemandas(data);
      } catch (error) {
        console.error("Erro ao carregar demandas:", error);
      }
    }
    fetchDemandas();
  }, [filtros, searchTerm]);

  const abrirModalDetalhes = (demanda) => {
    setDemandaSelecionada(demanda);
    setShowModalDetalhes(true);
  };

  const fecharModalDetalhes = () => {
    setShowModalDetalhes(false);
    setDemandaSelecionada(null);
    setMensagem("");
  };

  const enviarMensagem = () => {
    if (!mensagem.trim()) return;
    // Aqui você pode implementar o envio real da mensagem para o usuário da demanda
    alert(`Mensagem enviada para ${demandaSelecionada.usuarioNome}: ${mensagem}`);
    setMensagem("");
    setShowModalDetalhes(false);
  };

  if (!usuario) return null;

  return (
    <div className="bg-light min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow sticky-top">
        <div className="container">
          <Link className="navbar-brand" to="/inicio">
            <i className="fas fa-leaf me-2"></i>ApoiaRural
          </Link>
          <div className="d-flex gap-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select className="form-select" onChange={(e) => setFiltros({ ...filtros, tipoUsuario: e.target.value || null })}>
              <option value="">Filtrar por tipo</option>
              <option value="Produtor">Produtor</option>
              <option value="Apoiador">Apoiador</option>
            </select>
            <select className="form-select" onChange={(e) => setFiltros({ ...filtros, ordenacao: e.target.value || null })}>
              <option value="">Ordenar por</option>
              <option value="recentes">Mais Recentes</option>
            </select>
          </div>
        </div>
      </nav>

      {/* Conteúdo principal */}
      <div className="container mt-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="sidebar">
              <div className="sidebar-header">
                <a href="/perfil">
                  <img
                    src={`http://localhost:8080/tcc/usuarios/${usuario.id}/foto`}
                    className="post-avatar"
                    alt="Foto do usuário"
                    onError={e => { e.target.onerror = null; e.target.src = perfilPadrao; }}
                  />
                </a>
                <h5 id="nome-usuario">{usuario.nome}</h5>
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
          {/* Lista de demandas */}
          <div className="col-md-8 col-lg-9">
            <div className="card shadow">
              <div className="card-body bodyType01">
                <h4 className="mb-3">Demandas</h4>
                {demandas.length === 0 ? (
                  <p className="text-muted">Nenhuma demanda encontrada.</p>
                ) : (
                  demandas.map((d) => (
                    <div className="card mb-3" key={d.id}>
                      <div className="card-body bodyType01">
                        <h5 className="card-title">{d.titulo}</h5>
                        <p className="card-text">{d.descricao}</p>
                        <p className="text-muted small">
                          Postado por <a className="postedBy" href={"/perfil/" + d.usuario}>{d.usuarioNome}</a> em {new Date(d.data_postagem).toLocaleDateString()} • {d.cidade}, {d.estado}
                        </p>

                        <button className="btn btn-detalhesDemada" onClick={() => abrirModalDetalhes(d)}>
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Bootstrap para detalhes da demanda */}
      {showModalDetalhes && demandaSelecionada && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalhes da Demanda</h5>
                <button type="button" className="btn-close" onClick={fecharModalDetalhes} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <h6>{demandaSelecionada.titulo}</h6>
                <p>{demandaSelecionada.descricao}</p>
                <p><strong>Postado por:</strong> <a className="postedBy" href={"/perfil/" + demandaSelecionada.usuario}>{demandaSelecionada.usuarioNome}</a></p>
                <p><strong>Data:</strong> {new Date(demandaSelecionada.data_postagem).toLocaleDateString()}</p>
                <p><strong>Local:</strong> {demandaSelecionada.cidade}, {demandaSelecionada.estado}</p>
                <hr />
                <label htmlFor="mensagem" className="form-label">Enviar mensagem para o usuário:</label>
                <textarea id="mensagem" className="form-control mb-2" value={mensagem} onChange={e => setMensagem(e.target.value)} placeholder="Digite sua mensagem..."></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={fecharModalDetalhes}>Fechar</button>
                <button type="button" className="btn btn-mensagem" onClick={enviarMensagem}>Enviar Mensagem</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}