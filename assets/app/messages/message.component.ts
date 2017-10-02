//import { Component, Input, Output, EventEmitter } from '@angular/core'; <-- pre server hook-up
import { Component, Input } from '@angular/core';
import { Message } from './message.model';
import { MessageService } from './message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styles: [`
    .author {
      display: inline-block;
      font-style: italic;
      font-size: 12px;
      width: 80%;
    }
    .config {
      display: inline-block;
      text-align: right;
      font-size: 12px;
      width: 19%;}
      `]
})
export class MessageComponent {
  @Input() aMessage: Message
 // @Output() editClicked = new EventEmitter<string>(); <-- pre server hook-up

  constructor(private messageService: MessageService) {}

  onDelete() {
    //this.messageService.deleteMessage(this.aMessage); <-- pre server hook-up
    // the service returns an observable, so subscribe to it
    this.messageService.deleteMessage(this.aMessage)
      .subscribe(
        result => console.log(result)
      );
  }

  onEdit() {
    //alert('it worked!');
    //this.editClicked.emit('A new value'); <-- pre server hook-up
    this.messageService.editMessage(this.aMessage);      
  }

  belongsToUser() {
    return localStorage.getItem('userId') == this.aMessage.userId;
  }
}