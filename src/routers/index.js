const { BotController } = require('../controllers/bot');
const { MessageBotController } = require('../controllers/messagesBotController');
const { MessagesActionsController } = require('../controllers/messagesActionsController');
const { MessageTransitionsController } = require('../controllers/messagesTransitionsController');
const { ProductsController } = require('../controllers/productsController');
const { externalAccessAuth } = require('../middleware/externalAccessAuth');
const { UsersController } = require('../controllers/usersController');

function router(express) {
  const router = express.Router();
  const botCtrl = new BotController();
  const usersCtrl = new UsersController();
  const productsCtrl = new ProductsController();
  const messagesBotCtrl = new MessageBotController();
  const actionsCtrl = new MessagesActionsController();
  const messagesTransitionsCtrl = new MessageTransitionsController();

  router.post('/login', usersCtrl.login.bind(usersCtrl));
  router.post('/users', externalAccessAuth, usersCtrl.create.bind(usersCtrl));
  router.get('/users', externalAccessAuth, usersCtrl.getAll.bind(usersCtrl));
  router.put('/users', externalAccessAuth, usersCtrl.update.bind(usersCtrl));
  router.delete('/users/:id', externalAccessAuth, usersCtrl.delete.bind(usersCtrl));

  router.get('/actions', externalAccessAuth, actionsCtrl.readAll.bind(actionsCtrl));
  router.post('/actions', externalAccessAuth, actionsCtrl.create.bind(actionsCtrl));
  router.put('/actions/:id', externalAccessAuth, actionsCtrl.update.bind(actionsCtrl));
  router.delete('/actions/:id', externalAccessAuth, actionsCtrl.delete.bind(actionsCtrl));

  router.get('/generate-qr', botCtrl.getQrCode.bind(botCtrl));
  router.get('/status', botCtrl.getClientStatus.bind(botCtrl));

  router.get('/product/:productCode/:quantityCode', externalAccessAuth, productsCtrl.readProd.bind(productsCtrl));
  router.post('/product', externalAccessAuth, productsCtrl.create.bind(productsCtrl));
  router.put('/product/:id', externalAccessAuth, productsCtrl.update.bind(productsCtrl));
  router.delete('/product/:id', externalAccessAuth, productsCtrl.delete.bind(productsCtrl));

  router.get('/transitions', externalAccessAuth, messagesTransitionsCtrl.readAll.bind(messagesTransitionsCtrl));
  router.post('/transitions', externalAccessAuth, messagesTransitionsCtrl.create.bind(messagesTransitionsCtrl));
  router.put('/transitions', externalAccessAuth, messagesTransitionsCtrl.update.bind(messagesTransitionsCtrl));
  router.delete('/transitions/:id', externalAccessAuth, messagesTransitionsCtrl.delete.bind(messagesTransitionsCtrl));

  router.get('/messages', externalAccessAuth, messagesBotCtrl.readAll.bind(messagesBotCtrl));
  router.post('/messages', externalAccessAuth, messagesBotCtrl.create.bind(messagesBotCtrl));
  router.put('/messages', externalAccessAuth, messagesBotCtrl.updateMessage.bind(messagesBotCtrl));
  router.delete('/messages/:id', externalAccessAuth, messagesBotCtrl.delete.bind(messagesBotCtrl));

  return router;
}

exports.router = router;
