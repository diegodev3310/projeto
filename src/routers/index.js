const { botController } = require('../controllers/bot');

function router(express) {
  const router = express.Router();
  const botCtrl = new botController();

  router.get('/generate-qr', botCtrl.getQrCode);
  router.get('/status', botCtrl.getClientStatus);

  return router;
}

exports.router = router;