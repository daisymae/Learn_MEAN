import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { Message } from "./message.model";
import { ErrorService } from "../errors/error.service";

@Injectable()
export class MessageService{
  private messages: Message[] = [];
  messageIsEdit = new EventEmitter<Message>();

  constructor(private http: Http, private errorService: ErrorService) {}

  addMessage(message: Message) {
    //this.messages.push(message); <-- before server hook-up
    const body = JSON.stringify(message);
    const headers = new Headers({'Content-Type': 'application/json'});
    // get the authentication token if it exists to pass to the server calls
    const token = localStorage.getItem('token') 
      ? '?token=' + localStorage.getItem('token')
      : '';
    // json() on the response and error will remove the status code and headers
    // and return the body automatically converted to a JS Object
    // the path for the server here should match what is used in app.use set up in app.js
    // NOTE: had some issues because had 'messages' not 'message'
    return this.http.post('http://localhost:3000/message' + token, body, {headers: headers})
      .map((response: Response) => {
        const result = response.json();
        // create a new message so the object pushed onto the array has a valid id 
        // for use in updates/deletes w/o needing to refresh the page
        const message = new Message(
          result.obj.content, 
          result.obj.user.firstName, 
          result.obj._id, 
          result.obj.user._id);
        this.messages.push(message);
        console.log("Message from result: " + result.message);
        return message;
      })
      .catch((error: Response) => {
        // run own code before continuing with 
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
    //console.log(this.messages);
  }

  getMessages(){
    // return this.messages; <-- before server hook-up
    // no body or headers here because not sending data
    return this.http.get('http://localhost:3000/message')
      .map((response: Response) => {
        const messages = response.json().obj;
        let transformedMessages: Message[] = [];
        for (let message of messages) {
          transformedMessages.push(new Message(
              message.content, 
              message.user.firstName, 
              message._id, 
              message.user._id))
        }
        this.messages = transformedMessages; // update the array
        return transformedMessages;
      })
      .catch((error: Response) => {
        // run own code before continuing with 
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  editMessage(message: Message) {
    this.messageIsEdit.emit(message);
  }

  updateMessage(message: Message) {
    const body = JSON.stringify(message);
    const headers = new Headers({'Content-Type': 'application/json'});
    const token = localStorage.getItem('token') 
    ? '?token=' + localStorage.getItem('token')
    : '';
    return this.http.patch('http://localhost:3000/message/' + message.messageId + token, body, {headers: headers})
      .map((response: Response) => response.json())
      .catch((error: Response) => {
        // run own code before continuing with 
        this.errorService.handleError(error.json());
        return Observable.throw(error.json());
      });
  }

  deleteMessage(message: Message) {
    this.messages.splice(this.messages.indexOf(message), 1);
    const token = localStorage.getItem('token') 
    ? '?token=' + localStorage.getItem('token')
    : '';
    return this.http.delete('http://localhost:3000/message/' + message.messageId + token)
    .map((response: Response) => response.json())
    .catch((error: Response) => {
      // run own code before continuing with 
      this.errorService.handleError(error.json());
      return Observable.throw(error.json());
    });
}
}