const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');
const auth = require('../middleware/auth');

router.get('/total', auth, incomeController.getTotalIncome);
router.get('/details', auth, incomeController.getIncomeDetails);
router.post('/withdraw', auth, incomeController.withdraw);
router.get('/withdrawals', auth, incomeController.getWithdrawals);


module.exports = router;
