const { MessageBotController } = require('../controllers/messagesBotController');

function router(express) {
  const router = express.Router();
  const messagesBotCtrl = new MessageBotController();

  router.get('/messages', (req, res) => messagesBotCtrl.readAll(req, res));
  router.post('/messages', (req, res) => messagesBotCtrl.create(req, res));
  router.put('/messages/:id', (req, res) => messagesBotCtrl.update(req, res));
  router.delete('/messages/:id', (req, res) => messagesBotCtrl.delete(req, res));

  return router;
}

exports.router = router;
