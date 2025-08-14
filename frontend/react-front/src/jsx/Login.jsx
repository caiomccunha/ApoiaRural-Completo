import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/LoginReact.css";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    senha: "",
  });
  const [mensagemErro, setMensagemErro] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Limpa mensagem de erro quando o usuário digita
    if (mensagemErro) setMensagemErro("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação dos campos
    if (!form.email.trim() || !form.senha) {
      setMensagemErro("Por favor, preencha todos os campos.");
      return;
    }

    const loginData = {
      email: form.email.trim(),
      senha: form.senha
    };

    try {
      const response = await fetch("http://localhost:8080/tcc/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        const usuario = await response.json();
        console.log("Login bem-sucedido:", usuario);
        
        // Armazenar os dados do usuário no localStorage
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        
        // Redirecionar para a página protegida
        navigate("/inicio"); // Usando react-router
      } else if (response.status === 401) {
        setMensagemErro("Usuário ou senha incorretos.");
      } else {
        setMensagemErro("Erro ao tentar fazer login.");
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      setMensagemErro("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <p>Bem-vindo de volta! Por favor, insira suas credenciais.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Digite sua senha"
              value={form.senha}
              onChange={handleChange}
              required
            />
            <Link to="/recuperar-senha" className="esqueci-senha">
              Esqueci minha senha
            </Link>
          </div>
          
          <button type="submit" className="btn-entrar">
            Entrar
          </button>
        </form>
        
        <div className="login-footer">
          Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
        </div>
      </div>
    </div>
  );
}