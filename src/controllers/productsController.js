const { ProductsService } = require('../services/productsService');
const { ProductsRequest } = require('../models/productsRequest');

class ProductsController {
  constructor() {
    this.ProductsService = new ProductsService();
  }

  async create(req, res) {
    const funcTag = '[ProductsController.create]';
    try {
      console.log(`${funcTag} Iniciando criação de produto...`);
      const productRequest = new ProductsRequest(null, req.body.productCode, req.body.quantityCode);
      const result = await this.ProductsService.create(productRequest);
      console.log(`${funcTag} Produto criado com sucesso`);
      res.status(result.status || 201).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao criar produto:`, error);
      res.status(500).json({ error: 'Erro ao criar produto' });
    }
  }

  async readAll(req, res) {
    const funcTag = '[ProductsController.readAll]';
    try {
      console.log(`${funcTag} Buscando todos os produtos...`);
      const result = await this.ProductsService.readAll();
      console.log(`${funcTag} Produtos encontrados`);
      res.status(result.status || 200).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao buscar produtos:`, error);
      res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
  }

  async readProd(req, res) {
    const funcTag = '[ProductsController.readProd]';
    try {
      console.log(`${funcTag} Buscando produto...`);
      const prodReq = new ProductsRequest(null, req.params.productCode, req.params.quantityCode);
      console.log(`${funcTag} Requisitando produto`);
      const result = await this.ProductsService.readProd(prodReq);
      console.log(`${funcTag} Produto encontrado`);
      res.status(result.status || 200).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao buscar produto:`, error);
      res.status(500).json({ error: 'Erro ao buscar produto' });
    }
  }

  async update(req, res) {
    const funcTag = '[ProductsController.update]';
    try {
      const { id } = req.params;
      console.log(`${funcTag} Requisição para atualizar produto com ID: ${id}`);
      const productRequest = new ProductsRequest(id, req.body.productCode, req.body.quantityCode);
      const result = await this.ProductsService.update(productRequest);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao atualizar produto:`, error);
      return res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
  }

  async delete(req, res) {
    const funcTag = '[ProductsController.delete]';
    try {
      const { id } = req.params;
      console.log(`${funcTag} Requisição para deletar produto com ID: ${id}`);
      const result = await this.ProductsService.delete(id);
      return res.status(result.status).json(result);
    } catch (error) {
      console.error(`${funcTag} Erro ao deletar produto:`, error);
      return res.status(500).json({ error: 'Erro ao deletar produto' });
    }
  }
}

module.exports = { ProductsController };
