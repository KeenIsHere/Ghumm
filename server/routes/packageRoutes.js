const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const {
  getAllPackages, getAdminPackages, getPackage, createPackage, updatePackage, deletePackage
} = require('../controllers/packageController');

router.get('/', getAllPackages);
router.get('/admin/all', auth, adminOnly, getAdminPackages);
router.get('/:id', getPackage);
router.post('/', auth, adminOnly, createPackage);
router.put('/:id', auth, adminOnly, updatePackage);
router.delete('/:id', auth, adminOnly, deletePackage);

module.exports = router;
