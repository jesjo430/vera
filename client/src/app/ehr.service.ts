import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//Interface for creating party data.
export interface partyData {
    additionalInfo: {
        active: boolean;
        arrivalTime: string;
        arrivalMethod: string;
        dr?: string;
        nurse?: string;
        astNurse?: string;
        personnummer: string;
        projekt: string;
        search: string;
        team: string;
        ehrId: string;
        prio: string;
        age: string;
        tystnadsplikt: boolean;
        mottagning: string;
        remiss: boolean;
    };
    dateOfBirth: string;
    firstNames: string;
    gender?: string;
    id?: string;
    lastNames: string;
    version?: number;
}

const testParty : partyData = {
    firstNames: 'inter',
    lastNames: 'test',
    projekt: 'VERA2020',


}

}
/*
const partyData = {

        firstNames: name,
        lastNames: name,
        dateOfBirth: '1962-10-02',
        gender: 'FEMALE',
        // id: 123456,

        partyAdditionalInfo: [
        {
          key: 'personnummer',
          value: '860102-0000'
        },
        {
          key: 'projekt',
          value: 'VERA2020'
        },
        {
          key: 'search',
          value: 'Feber 154',
        },
        {
          key: 'arrivalTime',
          value: '12:00-4/5',
        },
        {
          key: 'age',
          value: '33',
        },
        {
          key: 'ehrId',
          value: "7cefe311-6911-4cb5-a577-360c12002599",
        },
        {
          key: 'active',
          value: true,
        },
        {
          key: 'arrivalMethod',
          value: 'bil',
        },
        {
          key: 'team',
          value: 'A',
        },
        {
          key: 'dr',
          value: 'Test läk',
        },
        {
          key: 'nurse',
          value: 'Test ssk',
        },
        {
          key: 'astNurse',
          value: 'Test usk'
        },
        {
          key: 'prio',
          value: 'yellow'
        },
        {
          key: 'tystnadsplikt',
          value: true
        },
        {
          key: 'mottagning',
          value: 'Linköping'
        },
        {
          key: 'remiss',
          value: false
        },
      ],
    }
*/
@Injectable({
  providedIn: 'root',
})
export class EhrService {
  httpOptions1 = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa('lio.se1:lio.se123')}`,
    }),
  };

  httpOptions2 = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa('lio.se2:ehr4lio.se2')}`,
    }),

  };

  baseUrl = 'https://rest.ehrscape.com/rest/v1';

  urlCreateId = 'https://rest.ehrscape.com/rest/v1/ehr';

  urlPartyData = `${this.baseUrl}/demographics/party`;

  urlpnr = '/demographics/party/query/?Personnummer=';

  urlPnr = this.baseUrl + this.urlpnr;

  urlActive = `${this.baseUrl}/demographics/party/query/?Active=True`;


  constructor(private http: HttpClient) { }

  /* Hämtar party-data från givet personnumemer, bör endast hämta ett party */
  getPnr(pnr: string) {
    const url = this.urlPnr + pnr;
    return this.http.get(url, this.httpOptions1);
  }


  /* Postar party data för en person, kommer innehålla bl.a. ehrid, pnr och namn, dummydata */
  postPartyData(partyData) {
    //const ehrid = ehr.ehrId;
    return this.http.post(this.urlPartyData, partyData, this.httpOptions2);
  }

  /* Skapar ett ehrID om det saknas för givet personnummer, annars hämtar den party datan för det personnummret
  * Egentligen ska det skickas med partydata som input för att fylla på om det inte finns ett ehrid */
  async createPerson(name, personnummer) {
    this.getPnr(personnummer.toString()).subscribe((resp: any) => {
      if (resp === null) {
        console.log('Skapa nytt ehrId och lägg till party data');
        const ehr = this.http.post(this.urlCreateId, '', this.httpOptions2);
        ehr.subscribe((resp2) => {
          this.postPartyData(name, resp2, personnummer).subscribe((ans1) => {
            console.log(ans1);
          });
        });
      } else {
        console.log('Hämta befintlig party data');
        console.log(resp.parties[0]); // Antag att en träff per personnummer
        return resp.parties[0];
      }
    });
  }

  /* Hämta alla aktiva patienter från EHRscape */
  getActivePatients(location: string) {
    return this.http.get(this.urlActive, this.httpOptions1);
  }
}
