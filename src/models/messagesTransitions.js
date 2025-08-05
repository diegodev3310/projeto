class MessageTransitionsRequest {
  constructor(source_message_id = null, target_message_id = null, trigger_pattern = null) {
    this.source_message_id = source_message_id;
    this.target_message_id = target_message_id;
    this.trigger_pattern = trigger_pattern;
  }
}

class MessageTransitionsResponse {
  constructor() {
    this.id = '';
    this.source_message_id = '';
    this.target_message_id = '';
    this.trigger_pattern = '';
    this.createdAt = null;
    this.updatedAt = null;
  }
}

module.exports = {
  MessageTransitionsRequest,
  MessageTransitionsResponse
};