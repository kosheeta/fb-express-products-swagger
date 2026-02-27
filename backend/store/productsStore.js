const initialProducts = require("../data/products");

let products = [...initialProducts];

const productsStore = {
  async readAll() {
    return products;
  },

  async readById(id) {
    return products.find((p) => p.id === id);
  },

  async add(product) {
    products.push(product);
    return product;
  },

  async patch(id, updates) {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updates,
      id: products[index].id,
    };

    return products[index];
  },

  async remove(id) {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;

    products.splice(index, 1);
    return true;
  },

  async reset() {
    products = [...initialProducts];
  },
};

module.exports = productsStore;
