const express = require('express');

const router = express.Router();

const OngController = require('./controllers/OngController');
const IncidentController = require('./controllers/IncidentController');
const ProfileController = require('./controllers/ProfileController');
const SessionController = require('./controllers/SessionController');

router.post('/sessions', SessionController.create);

router.get('/profile', ProfileController.index);

router.get('/ongs', OngController.index);
router.post('/ongs', OngController.create);

router.get('/incidents', IncidentController.index);
router.post('/incidents', IncidentController.create);
router.delete('/incidents/:id', IncidentController.delete);

module.exports = router;
