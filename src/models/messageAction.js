class MessageActionRequest {
  constructor(id, action_type, bot_message_id) {
    this.id = id;
    this.action_type = action_type;
    this.bot_message_id = bot_message_id;
  }
}

module.exports = { MessageActionRequest };