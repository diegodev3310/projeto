const { BotController } = require('../controllers/bot');
const { MesssageBotController } = require('../controllers/messagesBotController');

function router(express) {
  const router = express.Router();
  const botCtrl = new BotController();
  const messagesBotCtrl = new MesssageBotController();

  router.get('/generate-qr', botCtrl.getQrCode);
  router.get('/status', botCtrl.getClientStatus);
  
  router.get('/messages', messagesBotCtrl.readAll.bind(messagesBotCtrl));
  router.post('/messages', messagesBotCtrl.create.bind(messagesBotCtrl));

  return router;
}

exports.router = router;