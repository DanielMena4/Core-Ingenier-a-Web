import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LineupService {

  api = 'http://localhost:3000/api/lineups';

  constructor(private http: HttpClient) { }

  getLineups() {
    return this.http.get<any[]>(this.api);
  }

  createLineup(data: any) {
    return this.http.post(this.api, data);
  }

  updateLineup(id: number, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  deleteLineup(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}