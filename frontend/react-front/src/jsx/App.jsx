import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Cadastro from "./cadastro.jsx";
import Login from "./Login.jsx";
import Inicio from "./Inicio.jsx";
import Demandas from "./Demandas.jsx";
import Mensagens from "./mensagens.jsx";
import PerfilUser from "./perfil.jsx"; 
import LandingPage from "./LandingPage.jsx";

function App() {
  return (
    <Router>
      {/* Menu simples
      <nav style={styles.nav}>
        <Link to="/landingPage" style={styles.link}>Landing Page</Link>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/cadastro" style={styles.link}>Cadastro</Link>
        <Link to="/inicio" style={styles.link}>Inicio</Link>
        <Link to="/demandas" style={styles.link}>Demandas</Link>
        <Link to="/mensagens" style={styles.link}>Mensagens</Link>
        <Link to="/perfil" style={styles.link}>Perfil</Link>
        <Link to="/perfil/:id" style={styles.link}>Perfil</Link>
      </nav>
      */ }

      {/* Definindo rotas */}
      <Routes>
        <Route path="/" element={<Navigate to="/landingPage" />} /> {/* Redireciona para Landing Page por padrão */}
        <Route path="/landingPage" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/mensagens" element={<Mensagens />} />
        <Route path="/demandas" element={<Demandas />} />
        <Route path="/perfil" element= {<PerfilUser/>} />
        <Route path="/perfil/:id" element= {<PerfilUser/>} />
      </Routes>
    </Router>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    padding: "10px",
    background: "#2d5a27",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default App;