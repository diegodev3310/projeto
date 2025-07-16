class MessageRequest {
  constructor(id = null, message = null, action = null) {
    this.id = id;
    this.message = message;
    this.action = action;
  }
}

class MessageRespose {
  constructor() {
    this.id = '';
    this.message = '';
    this.index = 0;
    this.createdAt = null;
    this.updatedAt = null;
  }
}

module.exports = {
  MessageRequest,
  MessageRespose
};