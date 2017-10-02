export class Message {
  content: string; // limited to this type
  username: string; // creator of the message
  messageId?: string; // since mongoDB creates ID w/strings not numbers (well, you can override that, I think)
  userId?: string; // ? makes it optional; do so in ctor as well

  // NOTE: TS gave me an error after I made messageId optional
  // - optional parameters must be last; it didn't like that userId was not optional at tha time
  constructor(content: string, username: string, messageId?: string, userId?: string) {
    this.content = content;
    this.username = username;
    this.messageId = messageId;
    this.userId = userId;
  }
}