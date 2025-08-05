const { BotController } = require('../controllers/bot');
const { MessageBotController } = require('../controllers/messagesBotController');
const { MessagesActionsController } = require('../controllers/messagesActionsController');
const { MessageTransitionsController } = require('../controllers/messagesTransitionsController');
const { ProductsController } = require('../controllers/productsController');
const { externalAccessAuth } = require('../middleware/externalAccessAuth');

function router(express) {
  const router = express.Router();
  const botCtrl = new BotController();
  const messagesBotCtrl = new MessageBotController();
  const actionsCtrl = new MessagesActionsController();
  const productsCtrl = new ProductsController();
  const messagesTransitionsCtrl = new MessageTransitionsController();

  router.get('/actions', actionsCtrl.readAll.bind(actionsCtrl));
  router.post('/actions', externalAccessAuth, actionsCtrl.create.bind(actionsCtrl));
  router.put('/actions/:id', externalAccessAuth, actionsCtrl.update.bind(actionsCtrl));
  router.delete('/actions/:id', externalAccessAuth, actionsCtrl.delete.bind(actionsCtrl));

  router.get('/generate-qr', botCtrl.getQrCode.bind(botCtrl));
  router.get('/status', botCtrl.getClientStatus.bind(botCtrl));

  router.get('/product/:productCode/:quantityCode', productsCtrl.readProd.bind(productsCtrl));
  router.post('/product', externalAccessAuth, productsCtrl.createProd.bind(productsCtrl));
  router.put('/product/:id', externalAccessAuth, productsCtrl.updateProd.bind(productsCtrl));
  router.delete('/product/:id', externalAccessAuth, productsCtrl.deleteProd.bind(productsCtrl));

  router.get('/transitions', messagesTransitionsCtrl.readAll.bind(messagesTransitionsCtrl));
  router.post('/transitions', externalAccessAuth, messagesTransitionsCtrl.create.bind(messagesTransitionsCtrl));
  router.put('/transitions', externalAccessAuth, messagesTransitionsCtrl.update.bind(messagesTransitionsCtrl));
  router.delete('/transitions/:id', externalAccessAuth, messagesTransitionsCtrl.delete.bind(messagesTransitionsCtrl));

  router.get('/messages', messagesBotCtrl.readAll.bind(messagesBotCtrl));
  router.post('/messages', externalAccessAuth, messagesBotCtrl.create.bind(messagesBotCtrl));
  router.put('/messages/:id', externalAccessAuth, messagesBotCtrl.updateMessage.bind(messagesBotCtrl));
  router.delete('/messages/:id', externalAccessAuth, messagesBotCtrl.delete.bind(messagesBotCtrl));

  return router;
}

exports.router = router;
