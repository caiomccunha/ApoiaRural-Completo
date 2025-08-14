import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import "../css/telaCadastroReact.css";

const MySwal = withReactContent(Swal)

export default function Cadastro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    documento: "",
    cep: "",
    cidade: "",
    estado: "",
    telefone: "",
    tipo_usuario: "",
    tipo_apoiador: null,
    senha: "",
  });

  const limparFormulario = () => { 
    setForm({
      nome: "",
      email: "", 
      documento: "",
      cep: "",
      cidade: "",
      estado: "",
      telefone: "",
      tipo_usuario: "",
      tipo_apoiador: null,
      senha: "",
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const cepValido = (cep) => cep.length === 8 && /^\d+$/.test(cep);

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

  const buscarCep = async () => {
    const cep = form.cep.replace("_", "").trim();
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    if (cepValido(cep)) {
      try {
        const response = await fetch(url);
        const endereco = await response.json();
        if (endereco.erro) {
          Toast.fire({
            icon: "error",
            title: "CEP não encontrado",
          });
        } else {
          setForm((prev) => ({
            ...prev,
            cep: endereco.cep || "",
            cidade: endereco.localidade || "",
            estado: endereco.uf || "",
          }));
          Toast.fire({
            icon: "success",
            title: "Endereço preenchido automaticamente",
          });
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        Toast.fire({
          icon: "error",
          title: "Erro ao buscar CEP",
        });
      }
    } else {
      Toast.fire({
        icon: "warning",
        title: "CEP inválido. Deve conter 8 dígitos.",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usuario = {
      ...form,
      documento: form.documento.replace(/\D/g, ""),
      telefone: form.telefone.replace(/\D/g, ""),
      cep: form.cep.replace(/\D/g, ""),
    };
    if(cepValido(cep)) {
      try {
        const response = await fetch(`http://localhost:8080/tcc/usuarios`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usuario),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage = errorData?.message || `Erro ${response.status}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();

        Toast.fire({
          icon: "success",
          title: "Usuário cadastrado com sucesso!",
        });

        localStorage.setItem("usuarioLogado", JSON.stringify(data));
        limparFormulario();
        navigate("/inicio");
      } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);

        if (error.message.includes("já cadastrado")) {
          Toast.fire({
            icon: "error",
            title: "E-mail já cadastrado",
          });
        } else {
          Toast.fire({
            icon: "error",
            title: `Erro ao cadastrar: ${error.message}`,
          });
        }
      }
    } else {
      Toast.fire({
      icon: "error",
      title: "CEP inválido!",
          });
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <h2>Cadastro</h2>
        <p>Preencha os campos abaixo para criar sua conta.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome Completo</label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Digite seu nome completo"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </div>

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
            <label htmlFor="documento">CPF/CNPJ</label>
            <input
              type="text"
              id="documento"
              name="documento"
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              value={form.documento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group cep-group">
              <label htmlFor="cep">CEP</label>
              <input
                type="text"
                id="cep"
                name="cep"
                placeholder="00000-000"
                value={form.cep}
                onChange={handleChange}
                onBlur={buscarCep}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cidade">Cidade</label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                placeholder="Sua cidade"
                value={form.cidade}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group uf-group">
              <label htmlFor="estado">UF</label>
              <input
                type="text"
                id="estado"
                name="estado"
                placeholder="UF"
                value={form.estado}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="telefone">Telefone</label>
            <input
              type="text"
              id="telefone"
              name="telefone"
              placeholder="(00) 00000-0000"
              value={form.telefone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipo_usuario">Tipo de Usuário</label>
            <select
              id="tipo_usuario"
              name="tipo_usuario"
              value={form.tipo_usuario}
              onChange={handleChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="APOIADOR">Apoiador</option>
              <option value="PRODUTOR">Produtor</option>
            </select>
          </div>

          {form.tipo_usuario === "APOIADOR" && (
            <div className="form-group">
              <label htmlFor="tipo_apoiador">Tipo de Apoiador</label>
              <select
                id="tipo_apoiador"
                name="tipo_apoiador"
                value={form.tipo_apoiador}
                onChange={handleChange}
                required
              >
                <option value="">Selecione...</option>
                <option value="PESSOA_FISICA">Pessoa Física</option>
                <option value="ONG">ONG</option>
                <option value="EMPRESA_COMERCIO">Empresa</option>
                <option value="CONVENIADO">Conveniado</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Crie uma senha segura"
              value={form.senha}
              onChange={handleChange}
              required
            />
            <small className="dica-senha">
              Use pelo menos 8 caracteres, incluindo letras e números
            </small>
          </div>

          <button type="submit" className="btn-cadastrar">
            Cadastrar
          </button>
        </form>

        <div className="cadastro-footer">
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </div>
      </div>
    </div>
  );
}