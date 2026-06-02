import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environmets/environment';


@Injectable({ providedIn: 'root' })
export class MatchesService {

  private api = `${environment.apiUrl}/matches`;


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
  getMatchById(id: any) {
    return this.http.get<any>(`${this.api}/${id}`);
  }
}