const { Fruit } = require('../models');
const { Op } = require('sequelize');

class FruitService {
  // Get all fruits
  async getAllFruits() {
    try {
      const fruits = await Fruit.findAll({
        where: { isAvailable: true },
        order: [['name', 'ASC']]
      });
      return fruits;
    } catch (error) {
      throw new Error(`Error fetching fruits: ${error.message}`);
    }
  }

  // Get fruit by ID
  async getFruitById(id) {
    try {
      const fruit = await Fruit.findByPk(id);
      if (!fruit) {
        throw new Error('Fruit not found');
      }
      return fruit;
    } catch (error) {
      throw new Error(`Error fetching fruit: ${error.message}`);
    }
  }

  // Create new fruit
  async createFruit(fruitData) {
    try {
      const fruit = await Fruit.create(fruitData);
      return fruit;
    } catch (error) {
      throw new Error(`Error creating fruit: ${error.message}`);
    }
  }

  // Update fruit
  async updateFruit(id, updateData) {
    try {
      const fruit = await Fruit.findByPk(id);
      if (!fruit) {
        throw new Error('Fruit not found');
      }
      await fruit.update(updateData);
      return fruit;
    } catch (error) {
      throw new Error(`Error updating fruit: ${error.message}`);
    }
  }

  // Delete fruit
  async deleteFruit(id) {
    try {
      const fruit = await Fruit.findByPk(id);
      if (!fruit) {
        throw new Error('Fruit not found');
      }
      await fruit.destroy();
      return { message: 'Fruit deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting fruit: ${error.message}`);
    }
  }

  // Search fruits by name
  async searchFruits(searchTerm) {
    try {
      const fruits = await Fruit.findAll({
        where: {
          name: {
            [Op.iLike]: `%${searchTerm}%`
          },
          isAvailable: true
        },
        order: [['name', 'ASC']]
      });
      return fruits;
    } catch (error) {
      throw new Error(`Error searching fruits: ${error.message}`);
    }
  }

  // Get fruits by category
  async getFruitsByCategory(category) {
    try {
      const fruits = await Fruit.findAll({
        where: {
          category,
          isAvailable: true
        },
        order: [['name', 'ASC']]
      });
      return fruits;
    } catch (error) {
      throw new Error(`Error fetching fruits by category: ${error.message}`);
    }
  }

  // Update stock quantity
  async updateStock(id, quantity) {
    try {
      const fruit = await Fruit.findByPk(id);
      if (!fruit) {
        throw new Error('Fruit not found');
      }
      
      const newStock = fruit.stockQuantity + quantity;
      if (newStock < 0) {
        throw new Error('Stock cannot be negative');
      }
      
      await fruit.update({ stockQuantity: newStock });
      return fruit;
    } catch (error) {
      throw new Error(`Error updating stock: ${error.message}`);
    }
  }
}

module.exports = new FruitService(); 