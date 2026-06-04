import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environmets/environment';


@Injectable({
  providedIn: 'root'
})
export class LineupService {

  private api = `${environment.apiUrl}/lineups`;


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

  getOptimalLineup(teamId: number, mode: string) {
    return this.http.get<any>(
      `${environment.apiUrl}/lineup-optimizer/team/${teamId}?mode=${mode}`
    );
  }
  calculateLineup(id: number) {

    return this.http.get<any>(
      `${environment.apiUrl}/lineups/${id}/calculate`
    );
  }
  getLineup(id: number) {

    return this.http.get<any>(
      `${environment.apiUrl}/lineups/${id}`
    );
  }

  addPlayer(
    lineupId: number,
    playerId: number
  ) {

    return this.http.post(
      `${environment.apiUrl}/lineups/${lineupId}/players`,
      {
        player_id: playerId
      }
    );
  }

  removePlayer(
    lineupId: number,
    playerId: number
  ) {

    return this.http.delete(
      `${environment.apiUrl}/lineups/${lineupId}/players/${playerId}`
    );
  }
}