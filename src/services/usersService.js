const { UsersRepository } = require('../repository/usersRepository');
const { ApiResponse } = require('../models/apiResponse');
const bcrypt = require('bcrypt');

class UsersService {
  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async create(userReq) {
    const funcTag = '[UsersService.create]';
    try {
      console.log(`${funcTag} Iniciando criação de usuário...`);
      if (!userReq.password) {
        throw new Error('Senha é obrigatória');
      }
      userReq.password = await bcrypt.hash(userReq.password, 10);
      const result = await this.usersRepository.insert(userReq);
      console.log(`${funcTag} Usuário criado com sucesso`);
      return new ApiResponse(201, 'Usuário criado com sucesso', result);
    } catch (error) {
      console.error(`${funcTag} Erro ao criar usuário:`, error);
      throw error;
    }
  }

  async login(userReq) {
    const funcTag = '[UsersService.login]';
    try {
      console.log(`${funcTag} Iniciando login para usuário: ${userReq.username}`);
      const user = await this.usersRepository.login(userReq.username);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      const isPasswordValid = await bcrypt.compare(userReq.password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error('Senha inválida');
      }
      console.log(`${funcTag} Login realizado com sucesso`);
      return new ApiResponse(200, 'Login realizado com sucesso', user);
    } catch (error) {
      console.error(`${funcTag} Erro ao realizar login:`, error);
      throw error;
    }
  }

  async getAll() {
    const funcTag = '[UsersService.getAll]';
    try {
      console.log(`${funcTag} Recuperando todos os usuários...`);
      const users = await this.usersRepository.getAll();
      console.log(`${funcTag} Usuários recuperados com sucesso`);
      return new ApiResponse(200, 'Usuários recuperados com sucesso', users);
    } catch (error) {
      console.error(`${funcTag} Erro ao recuperar usuários:`, error);
      throw error;
    }
  }

  async update(userReq) {
    const funcTag = '[UsersService.update]';
    try {
      console.log(`${funcTag} Iniciando atualização de usuário com ID: ${userReq.id}`);
      if (!userReq.id) {
        throw new Error('ID do usuário é obrigatório para atualização');
      }
      if (userReq.password) {
        userReq.password = await bcrypt.hash(userReq.password, 10);
      }
      const result = await this.usersRepository.update(userReq);
      return new ApiResponse(200, 'Usuário atualizado com sucesso', result);
    } catch (error) {
      console.error(`${funcTag} Erro ao atualizar usuário:`, error);
      throw error;
    }
  }

  async delete(id) {
    const funcTag = '[UsersService.delete]';
    try {
      console.log(`${funcTag} Deletando usuário com ID: ${id}`);
      if (!id) {
        throw new Error('ID do usuário é obrigatório para deletar');
      }
      const result = await this.usersRepository.delete(id);
      console.log(`${funcTag} Usuário deletado com sucesso`);
      return new ApiResponse(200, 'Usuário deletado com sucesso', result);
    } catch (error) {
      console.error(`${funcTag} Erro ao deletar usuário:`, error);
      throw error;
    }
  }
}

module.exports = { UsersService };
