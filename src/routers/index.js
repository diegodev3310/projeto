const { BotController } = require('../controllers/bot');
const { MessageBotController } = require('../controllers/messagesBotController');
const { MessagesActionsController } = require('../controllers/messagesActionsController');
const { externalAccessAuth } = require('../middleware/externalAccessAuth');

function router(express) {
  const router = express.Router();
  const botCtrl = new BotController();
  const messagesBotCtrl = new MessageBotController();
  const actionsCtrl = new MessagesActionsController();

  router.get('/actions', actionsCtrl.readAll.bind(actionsCtrl));
  router.post('/actions', externalAccessAuth, actionsCtrl.create.bind(actionsCtrl));
  router.put('/actions/:id', externalAccessAuth, actionsCtrl.update.bind(actionsCtrl));
  router.delete('/actions/:id', externalAccessAuth, actionsCtrl.delete.bind(actionsCtrl));


  router.get('/generate-qr', botCtrl.getQrCode.bind(botCtrl));
  router.get('/status', botCtrl.getClientStatus.bind(botCtrl));

  router.get('/messages', messagesBotCtrl.readAll.bind(messagesBotCtrl));
  router.post('/messages', externalAccessAuth, messagesBotCtrl.create.bind(messagesBotCtrl));
  router.put('/messages/:id', externalAccessAuth, messagesBotCtrl.update.bind(messagesBotCtrl));
  router.delete('/messages/:id', externalAccessAuth, messagesBotCtrl.delete.bind(messagesBotCtrl));

  return router;
}

exports.router = router;
