class ProductsRequest {
  constructor(id = null, product_code = null, quantity_code = null, price = null, description = null) {
    this.id = id;
    this.product_code = product_code;
    this.quantity_code = quantity_code;
    this.price = price;
    this.description = description;
  }
}

class ProductsResponse {
  constructor(id, product_code, quantity_code, price, description, createdAt, updatedAt) {
    this.id = id;
    this.product_code = product_code;
    this.quantity_code = quantity_code;
    this.price = price;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = { ProductsRequest, ProductsResponse };