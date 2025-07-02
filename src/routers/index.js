const { startBot, generateQr } = require('../services/bot');

function router(express) {
  const router = express.Router();

  router.get('/start-bot', (req, res) => {
    try {
      startBot();
      res.status(200).send('Bot iniciado com sucesso!');
    } catch (error) {
      console.error('Erro ao iniciar o bot:', error);
      res.status(500).send('Erro ao iniciar o bot.');
    }
  });

  router.get('/generate-qr', async (req, res) => {
    try {
      const qrData = await generateQr();
      if (qrData) {
        res.status(200).json({ qrUrl: qrData });
      } else {
        res.status(500).send('Erro ao gerar QR Code.');
      }
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      res.status(500).send('Erro ao gerar QR Code.');
    }
  });

  return router;
}

exports.router = router;