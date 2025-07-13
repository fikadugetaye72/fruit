const express = require('express');
const fruitController = require('../controllers/fruitController');

const router = express.Router();

// GET /api/fruits - Get all fruits
router.get('/', fruitController.getAllFruits);

// GET /api/fruits/search?q=apple - Search fruits
router.get('/search', fruitController.searchFruits);

// GET /api/fruits/category/:category - Get fruits by category
router.get('/category/:category', fruitController.getFruitsByCategory);

// GET /api/fruits/:id - Get fruit by ID
router.get('/:id', fruitController.getFruitById);

// POST /api/fruits - Create new fruit
router.post('/', fruitController.createFruit);

// PUT /api/fruits/:id - Update fruit
router.put('/:id', fruitController.updateFruit);

// DELETE /api/fruits/:id - Delete fruit
router.delete('/:id', fruitController.deleteFruit);

// PATCH /api/fruits/:id/stock - Update stock quantity
router.patch('/:id/stock', fruitController.updateStock);

module.exports = router; 