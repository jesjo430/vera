import { Component, OnInit } from '@angular/core';
import { EventSocketService } from '../services/event-socket.service';
import { EventType } from '../../../../shared/models/EventType';
import { EditEventData } from '../../../../shared/models/EditEventData';
import { EventVera } from '../../../../shared/models/EventVera';


export class TestMessage {
  type: string;

  data: string;
}
@Component({
  selector: 'app-test-event-socket',
  templateUrl: './test-event-socket.component.html',
  styleUrls: ['./test-event-socket.component.css'],
})
export class TestEventSocketComponent implements OnInit {
  messages: string[] = [];

  activeUsers: string[] = [];

  senderId: string = 'default';

  constructor(private eventService: EventSocketService) { }

  ngOnInit(): void {
    this.eventService.connect();
    this.eventService.getEventObservable().subscribe((msg) => {
      console.log(`COMPoNENT RECEIVED MSG: ${msg[msg.length - 1].eventType}`);

      const lastMsg = msg[msg.length - 1];
      if (lastMsg.eventType === EventType.EditEvent) {
        console.log('EditEvent! :D');
        const data = lastMsg.data as EditEventData;
        this.messages.push(lastMsg.senderId + " field: " + data.fieldId + " start: " + data.status);

        if (data.status && !this.activeUsers.includes(lastMsg.senderId)) {
          this.activeUsers.push(lastMsg.senderId);
        } else if (!data.status && this.activeUsers.includes(lastMsg.senderId)) {
          const index = this.activeUsers.indexOf(lastMsg.senderId);

          if (index > -1) {
            this.activeUsers.splice(index, 1);
          }
          //delete this.activeUsers[index];
        }
      }
    });
  }

  sendMessage() {
    this.eventService.sendMessage('TestMessageFromClient');
  }


  // TODO make this an interface to implement in other components
  // get uuid for fields from a service generator?
  sendStartEdit() {
    const data = {
      fieldId: '1',
      status: true,
    };

    const event = {
      senderId: this.senderId,
      eventType: EventType.EditEvent,
      data,
    };

    this.eventService.sendMessage(event);
  }

  sendStopEdit() {
    const data = {
      fieldId: '1',
      status: false,
    };

    const event = {
      senderId: this.senderId,
      eventType: EventType.EditEvent,
      data,
    };

    this.eventService.sendMessage(event);
  }
}
