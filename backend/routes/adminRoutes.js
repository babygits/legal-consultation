const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

router.get('/lawyers/pending', auth, requireAdmin, adminController.getPendingLawyers);
router.post('/lawyers/:id/verify', auth, requireAdmin, adminController.verifyLawyer);
router.get('/users', auth, requireAdmin, adminController.getAllUsers)
router.post('/users', auth, requireAdmin, adminController.createUser);
router.put('/users/:id', auth, requireAdmin, adminController.updateUser);
router.delete('/users/:id', auth, requireAdmin, adminController.deleteUser);
router.get('/cases', auth, requireAdmin, adminController.getAllCases);
router.put('/cases/:id', auth, requireAdmin, adminController.updateCaseStatus);
router.delete('/cases/:id', auth, requireAdmin, adminController.deleteCase);
router.get('/cases/:id', auth, requireAdmin, adminController.getCaseDetail);
router.get('/consults', auth, requireAdmin, adminController.getAllConsults)
router.delete('/consults/:id', auth, requireAdmin, adminController.deleteConsult)
router.get('/consults/:id', auth, requireAdmin, adminController.getConsultDetail)
router.get('/feedbacks', auth, requireAdmin, adminController.getAllFeedbacks)
router.get('/stats', auth, requireAdmin, adminController.getAdminStats)
router.get('/stats/growth', auth, requireAdmin, adminController.getUserGrowth);
router.get('/stats/roles', auth, requireAdmin, adminController.getUserRoles);
router.get('/stats/cases', auth, requireAdmin, adminController.getCaseStatusStats);
router.get('/stats/case-trend', auth, requireAdmin, adminController.getCaseTrend);
router.get('/stats/consult-daily', auth, requireAdmin, adminController.getConsultDaily);



module.exports = router;
