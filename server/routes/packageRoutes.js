const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const {
  getAllPackages, getPackage, createPackage, updatePackage, deletePackage
} = require('../controllers/packageController');

router.get('/', getAllPackages);
router.get('/:id', getPackage);
router.post('/', auth, adminOnly, createPackage);
router.put('/:id', auth, adminOnly, updatePackage);
router.delete('/:id', auth, adminOnly, deletePackage);

module.exports = router;
