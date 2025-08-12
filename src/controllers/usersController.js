const { UsersService } = require('../services/usersService');
const { UsersRequest } = require('../models/usersRequest');

class UsersController {
  constructor() {
    this.usersService = new UsersService();
  }

  async create(req, res) {
    const funcTag = '[UsersController.create]';
    try {
      console.log(`${funcTag} Iniciando criação de usuário...`);
      const userRequest = new UsersRequest(null, req.body.username, req.body.password);
      const result = await this.usersService.create(userRequest);
      console.log(`${funcTag} Usuário criado com sucesso`);
      res.status(result.status).json(result);
    } catch (err) {
      console.error(`${funcTag} Erro ao criar usuário:`, err);
      res.status(500).json({ error: err.message });
    }
  }

  async login(req, res) {
    const funcTag = '[UsersController.login]';
    try {
      console.log(`${funcTag} Iniciando login...`);
      const userRequest = new UsersRequest(null, req.body.username, req.body.password);
      const result = await this.usersService.login(userRequest);
      console.log(`${funcTag} Login realizado com sucesso`);
      res.status(result.status).json(result);
    } catch (err) {
      console.error(`${funcTag} Erro ao realizar login:`, err);
      res.status(401).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    const funcTag = '[UsersController.getAll]';
    try {
      console.log(`${funcTag} Iniciando busca por todos os usuários...`);
      const result = await this.usersService.getAll();
      console.log(`${funcTag} Busca realizada com sucesso`);
      res.status(result.status).json(result);
    } catch (err) {
      console.error(`${funcTag} Erro ao buscar usuários:`, err);
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    const funcTag = '[UsersController.update]';
    try {
      console.log(`${funcTag} Iniciando atualização de usuário...`);
      const userRequest = new UsersRequest(req.body.id, req.body.username, req.body.password);
      const result = await this.usersService.update(userRequest);
      console.log(`${funcTag} Usuário atualizado com sucesso`);
      res.status(result.status).json(result);
    } catch (err) {
      console.error(`${funcTag} Erro ao atualizar usuário:`, err);
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    const funcTag = '[UsersController.delete]';
    try {
      console.log(`${funcTag} Iniciando exclusão de usuário...`);
      const result = await this.usersService.delete(req.params.id);
      console.log(`${funcTag} Usuário excluído com sucesso`);
      res.status(result.status).json(result);
    } catch (err) {
      console.error(`${funcTag} Erro ao excluir usuário:`, err);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = { UsersController };
