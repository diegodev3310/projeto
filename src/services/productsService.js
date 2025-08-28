const { ProductsRepository } = require('../repository/productsRepository');
const { ApiResponse } = require('../models/apiResponse');

class ProductsService {
  constructor() {
    this.ProductsRepository = new ProductsRepository();
  }

  async create() {}

  async readAll() {}
  
  async readProd(prodReq) {
    const funcTag = "[ProductsService.readProd]";
    try {
      console.log(`${funcTag} Recuperando produtos do repositorio...`);
      const result = await this.ProductsRepository.getProd(prodReq);
      console.log(`${funcTag} Produtos recuperados no repositorio`);
      const apiResponse = new ApiResponse(201, 'Produtos recuperados com sucesso', result);
      return apiResponse;
    } catch (error) {
      console.error(`${funcTag} Erro ao recuperar produtos:`, error);
      throw error;
    }
  }

  async update() {}

  async delete(id) {}
}

module.exports = { ProductsService };
