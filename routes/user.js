const router = require('express').Router();
const controller = require('../controllers/user');

router.post('/create', controller.createControl);
router.delete('/delete', controller.deleteControl);

module.exports = router;