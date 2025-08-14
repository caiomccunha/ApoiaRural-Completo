import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import perfilPadrao from "../IMG/icon perfil novo.png";
import '../css/mensagens.css'

const MySwal = withReactContent(Swal)

export default function Mensagens() {
  const [filtros, setFiltros] = useState({ tipoUsuario: null, ordenacao: null });
  const [usuario, setUsuario] = useState(null);
  const [activeTab, setActiveTab] = useState('mensagens');
  const [conexoes, setConexoes] = useState([]);
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
        // conexoes: usuarioLogado.conexoes.length || 0
      });

      async function fetchConexoes(id) {
      try {
        const res = await fetch(`http://localhost:8080/tcc/usuarios/${id}/conexoes`);
        let data = await res.json();
        setUsuario({...usuarioLogado, conexoes: data.length});

        /* if (filtros.tipoUsuario)
          data = data.filter(d => d.usuarioTipo === filtros.tipoUsuario);

        if (searchTerm)
          data = data.filter(d =>
            d.nome.toLowerCase().includes(searchTerm.toLowerCase())
          ); */

        setConexoes(data);
      } catch (error) {
        console.error("Erro ao carregar conexões:", error);
      }
    }
    fetchConexoes(usuarioLogado.id);

    async function fetchMensagens(id) {
      try{
        const res = await fetch(`http:localhost:8080/tcc/usuarios/${id}/mensagens`);
        let data = await res.json();
        console.log(data);
      } catch (error) {
        console.error("Erro ao carregar mensagens: ", error);
      }
    }
    //fetchMensagens(usuarioLogado.id)
    }, []);



    if(!usuario) return null;
  
  return (
  <div className="bg-light min-vh-100">
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

        {/* Lista de usuários */}
          <div className="col-md-8 col-lg-4">
            <div className="card shadow">
              <div className="card-body bodyType01">
                <h4 className="mb-3">Suas conexões</h4>
                {conexoes.length === 0 ? (
                  <p className="text-muted">Você não possui contatos.</p>
                ) : (
                  conexoes.map((d) => (
                    <div className="card mb-1" key={d.id}>
                      <div className="card-body bodyType02 d-flex flex-row">
                        <div className="p-2">
                          <a href={"/perfil/" + d.id}>
                            <img className="img-fluid rounded-circle mb-2"
                            src={d.foto_perfil? `http://localhost:8080/tcc/usuarios/${d.id}/foto` : perfilPadrao}
                            style={{ width: "60px", height: "60px", objectFit: "cover" }}></img>
                          </a>
                        </div>

                        <div className="p-2 contatosChat">
                            <h5 className="card-title">{d.nome}</h5>
                            <p className="card-text">{d.biografia}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card shadow">
            <div className="card-body bodyType01"></div>
                <h4 className="mb-3">selected</h4>
            </div>
        </div>
      </div>
    </div>
  </div>
    );    
}