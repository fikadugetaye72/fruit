const fruitService = require('../services/fruitService');

class FruitController {
  // Get all fruits
  async getAllFruits(req, res) {
    try {
      const fruits = await fruitService.getAllFruits();
      res.status(200).json({
        success: true,
        data: fruits
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get fruit by ID
  async getFruitById(req, res) {
    try {
      const { id } = req.params;
      const fruit = await fruitService.getFruitById(id);
      res.status(200).json({
        success: true,
        data: fruit
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  // Create new fruit
  async createFruit(req, res) {
    try {
      const fruitData = req.body;
      const fruit = await fruitService.createFruit(fruitData);
      res.status(201).json({
        success: true,
        data: fruit
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // Update fruit
  async updateFruit(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const fruit = await fruitService.updateFruit(id, updateData);
      res.status(200).json({
        success: true,
        data: fruit
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  // Delete fruit
  async deleteFruit(req, res) {
    try {
      const { id } = req.params;
      const result = await fruitService.deleteFruit(id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  // Search fruits
  async searchFruits(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Search term is required'
        });
      }
      const fruits = await fruitService.searchFruits(q);
      res.status(200).json({
        success: true,
        data: fruits
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get fruits by category
  async getFruitsByCategory(req, res) {
    try {
      const { category } = req.params;
      const fruits = await fruitService.getFruitsByCategory(category);
      res.status(200).json({
        success: true,
        data: fruits
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Update stock
  async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number') {
        return res.status(400).json({
          success: false,
          error: 'Quantity must be a number'
        });
      }
      
      const fruit = await fruitService.updateStock(id, quantity);
      res.status(200).json({
        success: true,
        data: fruit
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new FruitController(); 