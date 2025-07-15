const { BotController } = require('../controllers/bot');
const { MessageBotController } = require('../controllers/messagesBotController');
const { externalAccessAuth } = require('../middleware/externalAccessAuth');

function router(express) {
  const router = express.Router();
  const botCtrl = new BotController();
  const messagesBotCtrl = new MessageBotController();

  router.get('/generate-qr', botCtrl.getQrCode.bind(botCtrl));
  router.get('/status', botCtrl.getClientStatus.bind(botCtrl));

  router.get('/messages', messagesBotCtrl.readAll.bind(messagesBotCtrl));
  router.post('/messages', messagesBotCtrl.create.bind(messagesBotCtrl));
  router.put('/messages/:id', messagesBotCtrl.update.bind(messagesBotCtrl));
  router.delete('/messages/:id', messagesBotCtrl.delete.bind(messagesBotCtrl));

  return router;
}

exports.router = router;
