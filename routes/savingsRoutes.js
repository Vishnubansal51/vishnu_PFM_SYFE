const express = require('express');
const { addSavingsGoal, getSavingsGoals } = require('../controllers/savingsController');

const router = express.Router();

router.post('/', addSavingsGoal);
router.get('/', getSavingsGoals);

module.exports = router;