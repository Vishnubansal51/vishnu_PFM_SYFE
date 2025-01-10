const express = require('express');
const { generateMonthlyReport, generateYearlyReport } = require('../controllers/reportController');

const router = express.Router();

router.get('/monthly', generateMonthlyReport);
router.get('/yearly',generateYearlyReport );

module.exports = router;
