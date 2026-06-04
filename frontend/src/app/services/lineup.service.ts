import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';


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
  getOptimalLineup(params: any) {

    let httpParams = new HttpParams()
      .set('teamId', params.teamId);

    if (params.opponentTeamId !== null && params.opponentTeamId !== undefined) {
      httpParams = httpParams.set('opponentTeamId', params.opponentTeamId.toString());
    }

    return this.http.get(
      `${environment.apiUrl}/lineup-optimizer/team/${params.teamId}`,
      {
        params: httpParams
      }
    );
  }
}