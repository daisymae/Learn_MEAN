import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MessageService } from './message.service';
import { Message } from './message.model';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html'
})
export class MessageInputComponent implements OnInit {
  // this property allows us to load a message into the input field
  message: Message; // be default undefined so field is empty

  constructor(private messageService:MessageService) {}

  onSubmit(form: NgForm) {
    if(this.message) {
      //Edit
      this.message.content = form.value.content;
      //this.message = null; <-- pre server hookup
      this.messageService.updateMessage(this.message)
        .subscribe(
          result => console.log(result)
        );
      this.message = null; // to clear out the input field
    } else {
      // Create
      const message = new Message(form.value.content, 'Max');
      this.messageService.addMessage(message)
        .subscribe(
          data => console.log(data),
          error => console.error(error)
        );
      }
    form.resetForm();
  }

  onClear(form: NgForm) {
    this.message = null;
    form.resetForm();
  }

  ngOnInit() {
    this.messageService.messageIsEdit.subscribe(
      (message: Message) => this.message = message
    );
  }
}