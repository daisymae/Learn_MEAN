import { Component, OnInit } from '@angular/core';
import { Message } from './message.model';
import { MessageService } from './message.service';

@Component({
  selector: 'app-message-list',
  template: `
    <div class="col-md-8 col-mid-offset-2">
    <app-message 
    [aMessage]="message" 
    *ngFor="let message of messages"></app-message>
    </div>
    `
})
export class MessageListComponent implements OnInit {
  messages: Message[];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    // this.messages = this.messageService.getMessages(); <= pre server hook-up
    this.messageService.getMessages()
      .subscribe(
        (messages: Message[]) => {
          this.messages = messages;
        }
      );
  }

}