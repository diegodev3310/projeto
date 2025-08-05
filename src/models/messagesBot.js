class MessageRequest {
  constructor(id = null, message = null, logical_key = null, node_type = null, initial_node = false) {
    this.id = id;
    this.message = message;
    this.logical_key = logical_key;
    this.node_type = node_type;
    this.initial_node = initial_node;
  }
}

class MessageRespose {
  constructor() {
    this.id = '';
    this.message = '';
    this.logical_key = 0;
    this.node_type = '';
    this.initial_node = false;
    this.createdAt = null;
    this.updatedAt = null;
  }
}

module.exports = {
  MessageRequest,
  MessageRespose
};