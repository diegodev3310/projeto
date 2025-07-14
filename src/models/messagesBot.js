class MessageRequest {
  constructor(id = null, message = null) {
    this.id = id;
    this.message = message;
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