import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventVera } from '../../../../shared/models/EventVera';
import { User } from '../models/User';
import { EventType } from '../../../../shared/models/EventType';
import { Person } from '../models/Person';
import { RoleType } from '../models/RoleType';
import { ActionType } from '../models/ActionType';
import { CareEvent } from '../models/CareEvent';

const baseUrl = 'http://localhost:4201';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  constructor(private http: HttpClient) { }

  getEvents(): Observable<any> {
    const url = `${baseUrl}/events`;
    return this.http.get(url, httpOptions);
  }

  getId() : Observable<any> {
    const url = `${baseUrl}/id`;
    return this.http.post(url, '', httpOptions);
  }

  createUser(user: User): Observable<any> {
    const url = `${baseUrl}/user`;
    return this.http.post(url, JSON.stringify(user), httpOptions);
  }

  createEditEvent(fieldId: string, status: boolean, senderId: string): Observable<any> {
    const url = `${baseUrl}/event`;

    const data = {
      fieldId,
      status,
    };

    const event = {
      senderId,
      eventType: EventType.EditEvent,
      data,
    };

    return this.http.post(url, event, httpOptions);
  }

  createCareEvent(senderId: string, senderPerson: Person, receivers: RoleType[],
    team: number, action: ActionType, comment: string) {
    const url = `${baseUrl}/event`;
    const careEvent = new CareEvent(senderPerson, receivers, team, action, comment);
    const data = {
      careEvent,
    };

    const event = {
      senderId,
      eventType: EventType.CareEvent,
      data,
    };
  }
}
