import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MatchesService {

  private api = 'http://localhost:3000/api/matches';

  constructor(private http: HttpClient) { }

  getMatches() {
    return this.http.get<any[]>(this.api);
  }

  createMatch(match: any) {
    return this.http.post(this.api, match);
  }

  updateMatch(id: number, match: any) {
    return this.http.put(`${this.api}/${id}`, match);
  }

  deleteMatch(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}