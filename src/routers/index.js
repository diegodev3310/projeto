const { BotController } = require('../controllers/bot');
const { externalAccessAuth } = require('../middleware/externalAccessAuth');

function router(express) {
  const router = express.Router();
  const botCtrl = new BotController();

  router.get('/generate-qr', botCtrl.getQrCode);
  router.get('/status', botCtrl.getClientStatus);

  return router;
}

exports.router = router;