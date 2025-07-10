const { BotController } = require('../controllers/bot');
const { MesssageBotController } = require('../controllers/messagesBotController');

function router(express) {
  const router = express.Router();
  const botCtrl = new BotController();
  const messagesBotCtrl = new MesssageBotController();

  router.get('/generate-qr', botCtrl.getQrCode);
  router.get('/status', botCtrl.getClientStatus);
  
  router.post('/messages', messagesBotCtrl.create);

  return router;
}

exports.router = router;