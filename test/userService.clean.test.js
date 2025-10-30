const { UserService } = require('../src/userService');

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService - Suíte de Testes com Smells', () => {
  let userService;

  // O setup é executado antes de cada teste
  beforeEach(() => {
    userService = new UserService();
    userService._clearDB(); // Limpa o "banco" para cada teste
  });

  test('Criação de usuário', () => {
    // Act 1: Criar
    const usuarioCriado = userService.createUser(
      dadosUsuarioPadrao.nome,
      dadosUsuarioPadrao.email,
      dadosUsuarioPadrao.idade
    );
    expect(usuarioCriado.id).toBeDefined();
  })

  test('Busca de usuário', () => {

    const usuarioCriado = userService.createUser(
      dadosUsuarioPadrao.nome,
      dadosUsuarioPadrao.email,
      dadosUsuarioPadrao.idade
    );

    // Act 2: Buscar
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);
    expect(usuarioBuscado.nome).toBe(dadosUsuarioPadrao.nome);
    expect(usuarioBuscado.status).toBe('ativo');

  });

  test('Desativar usuários não administradores  (Usuário comum)', () => {

    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

    const resultado = userService.deactivateUser(usuarioComum.id);
    expect(resultado).toBe(true);

    const usuarioAtualizado = userService.getUserById(usuarioComum.id);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  test('Desativar usuários não administradores  (Usuário admin)', () => {

    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    const resultado = userService.deactivateUser(usuarioAdmin.id);

    expect(resultado).toBe(false);

  });

  test('Gerar relatório', () => {
    const usuario1 = userService.createUser('Alice', 'alice@email.com', 28);
    userService.createUser('Bob', 'bob@email.com', 32);

    const relatorio = userService.generateUserReport();

    const linhaEsperada = `ID: ${usuario1.id}, Nome: Alice, Status: ativo\n`;
    expect(relatorio).toContain(linhaEsperada);
    expect(relatorio.startsWith('--- Relatório de Usuários ---')).toBe(true);
  });

  test('Verificar idade do usuário (menor de idade)', () => {
    const user = userService.createUser('Menor', 'menor@email.com', 17);
    expect(user).toBe(false)
  });

  //TESTE NÂO IMPLEMENTADO DEVE SER REMOVIDO
  //test.skip('deve retornar uma lista vazia quando não há usuários', () => {
    // TODO: Implementar este teste depois.
  //});
});