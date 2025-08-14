package TCC.Trabalho.TCC.V.de.Vigilancia;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Usuario.UsuarioModel;
import TCC.Trabalho.TCC.V.de.Vigilancia.Model.Usuario.tipoUsuario;
import TCC.Trabalho.TCC.V.de.Vigilancia.Service.UsuarioService;
import lombok.experimental.var;


@SpringBootTest
public class UsuarioRepositoryTest {
    @Autowired
    private UsuarioService usuarioService;

    @Test
    void testes(){
        System.out.println("Inicio do Teste");
        UsuarioModel usuario = new UsuarioModel();
        usuario.setNome("");
        System.out.println("Passando informacao de usuario: " + usuario.getNome());

        var response = usuarioService.pegandoAlertandoSobreDados(usuario);
        System.out.println("Validando passada de info para funcao");
        assertEquals(response.getNome(), "Marcos",
            "O foi marcos ta vilidado'Marcos'");
            
        System.out.println("Teste concluído com sucesso!");
    }
    @Test
    void testeDeCadastroUsuario() {
        System.out.println("Teste de Cadastro de Usuário");
        UsuarioModel usuario = new UsuarioModel();
        usuario.setNome("Caio Messi");
        usuario.setEmail("caiomessi@gmail");
        usuario.setDocumento("12345678698");
        usuario.setCep("31585440");
        usuario.setCidade("Belo Horizonte");
        usuario.setEstado("Minas Gerais (MG)");
        usuario.setTelefone("31999999999");
        usuario.setTipo_usuario(tipoUsuario.PRODUTOR);
        usuario.setBiografia("Produtor de café orgânico");
        usuario.setSenha("12345");
        
        System.out.println("Cadastrando nome de usuários: " + usuario.getNome());
        System.out.println("Cadastrando email de usuários: " + usuario.getEmail());
        System.out.println("Cadastrando documento de usuários: " + usuario.getDocumento());
        System.out.println("Cadastrando cep de usuários: " + usuario.getCep());
        System.out.println("Cadastrando cidade de usuários: " + usuario.getCidade());
        System.out.println("Cadastrando estado de usuários: " + usuario.getEstado());
        System.out.println("Cadastrando telefone de usuários: " + usuario.getTelefone());
        System.out.println("Cadastrando tipo de usuário: " + usuario.getTipo_usuario());
        System.out.println("Cadastrando biografia de usuários: " + usuario.getBiografia());
        System.out.println("Cadastrando senha: " + usuario.getSenha());
        
        var response = usuarioService.adicionarUser(usuario);
        System.out.println("Validando cadastro de usuário");
        assertEquals(response.getNome(), "Caio Messi",
            "O nome do usuário foi cadastrado corretamente: 'Caio Messi'");
        assertEquals(response.getEmail(), "caiomessi@gmail",
            "O email do usuário foi cadastrado corretamente: 'caiomessi@gmail.com'");
        assertEquals(response.getDocumento(), "12345678698",
            "O documento do usuário foi cadastrado corretamente: '12345678698'");
        assertEquals(response.getCep(), "31585440", 
            "O cep do usuário foi cadastrado corretamente: '31585440'");
        assertEquals(response.getCidade(), "Belo Horizonte",
            "A cidade do usuário foi cadastrada corretamente: 'Belo Horizonte'");   
        assertEquals(response.getEstado(), "Minas Gerais (MG)",
            "O estado do usuário foi cadastrado corretamente: 'Minas Gerais (MG)'");
        assertEquals(response.getTelefone(), "31999999999",
            "O telefone do usuário foi cadastrado corretamente: '31999999999'");
        assertEquals(response.getTipo_usuario(), tipoUsuario.PRODUTOR,  
            "O tipo de usuário foi cadastrado corretamente: 'PRODUTOR'");
        assertEquals(response.getBiografia(), "Produtor de café orgânico",  
            "A biografia do usuário foi cadastrada corretamente: 'Produtor de café orgânico'");
        assertEquals(response.getSenha(), "12345",
            "A senha do usuário está sendo cadastrada corretamente: '12345'");
        
        
            System.out.println("Teste de cadastro de usuário concluído com sucesso!");  
    
    }
    @Test
    void testeDeBuscaTodosUsuarios() {
        System.out.println("Teste de Busca de Todos os Usuários");
        var response = usuarioService.buscarUsers();
        
        System.out.println("Buscando todos os usuários cadastrados");
        assertTrue(!response.isEmpty(), "A lista de usuários não deve estar vazia");
        
        System.out.println("Total de usuários encontrados: " + response.size());
        for (UsuarioModel usuario : response) {
            System.out.println("Usuário encontrado: " + usuario.getNome());
        }
        
        System.out.println("Teste de busca de todos os usuários concluído com sucesso!");
    }

    @Test
    void testeDeBuscaUsuarioPorID() {
        System.out.println("Teste de Busca de Usuário por ID");
        Long id = 2L; // ID do usuário a ser buscado
        var response = usuarioService.buscarUserPorID(id);
        
        System.out.println("Buscando usuário com ID: " + id);
        assertTrue(response.isPresent(), "Usuário encontrado com ID: " + id);
        assertEquals(response.get().getId(), id, "O ID do usuário encontrado é o mesmo que o buscado: " + id);
        System.out.println("Nome do usuário encontrado: " + response.get().getNome());
        assertEquals(response.get().getNome(), "Caio Messi", "O nome do usuário encontrado é 'Caio Messi'");
        
        System.out.println("Teste de busca de usuário por ID concluído com sucesso!");
    }

    @Test
    void testeDeAtualizacaoUsuario() {
        System.out.println("Teste de Atualização de Usuário");
    
        // Criando o objeto de usuário
        UsuarioModel usuario = new UsuarioModel();
        usuario.setId(Long.valueOf(2));
        usuario.setNome("Caio Messi Atualizado");
        usuario.setEmail("caiomessi@gmail.com");// Email não é atualizado, mas pode ser definido se necessário
        usuario.setDocumento("12345678698"); // Documento não é atualizado, mas pode ser definido se necessário
        usuario.setCep("31585440"); // CEP não é atualizado, mas pode ser definido se necessário
        usuario.setCidade("Belo Horizonte Atualizado");
        usuario.setEstado("Minas Gerais (MG) Atualizado");
        usuario.setTelefone("31999999999"); // Telefone não é atualizado, mas pode ser definido se necessário
        usuario.setTipo_usuario(tipoUsuario.PRODUTOR);
        usuario.setBiografia("Produtor de café orgânico atualizado");
    
    
        // Buscando o usuário
        var response = usuarioService.buscarUserPorID(usuario.getId());
        System.out.println("Atualizando usuário com ID: " + usuario.getId());
    
        // Atualizando o usuário
        var updatedUser = usuarioService.adicionarUser(usuario);
        System.out.println("Usuário atualizado com sucesso!");
    
        // Verificando se o usuário foi atualizado corretamente
        assertEquals(updatedUser.getNome(), "Caio Messi Atualizado",
            "O nome do usuário foi atualizado corretamente: 'Caio Messi Atualizado'");
    }

    @Test
    void testeDeRemocaoUsuario(){
        System.out.println("Teste de Remoção de Usuário");
    
        // Criando o objeto de usuário
        UsuarioModel usuario = new UsuarioModel();
        usuario.setId(Long.valueOf(2));
    
        // Buscando o usuário
        var response = usuarioService.buscarUserPorID(usuario.getId());
        System.out.println("Removendo usuário com ID: " + usuario.getId());
    
        // Removendo o usuário
        usuarioService.removerUser(usuario.getId());
        System.out.println("Usuário removido com sucesso!");
    
        // Verificando se o usuário foi removido corretamente
        assertTrue(usuarioService.buscarUserPorID(usuario.getId()).isEmpty(),
            "O usuário foi removido corretamente, não deve ser encontrado pelo ID: " + usuario.getId());
    }
}

