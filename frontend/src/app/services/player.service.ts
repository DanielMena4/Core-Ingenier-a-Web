import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private baseUrl = environment.apiUrl;

  private playersUrl = `${this.baseUrl}/players`;
  private analyticsUrl = `${this.baseUrl}/analytics`;
  private impactUrl = `${this.baseUrl}/impact`;

  constructor(private http: HttpClient) { }

  getPlayers() {
    return this.http.get<any[]>(this.playersUrl);
  }

  createPlayer(player: any) {
    return this.http.post(this.playersUrl, player);
  }

  updatePlayer(id: number, player: any) {
    return this.http.put(`${this.playersUrl}/${id}`, player);
  }

  deletePlayer(id: number) {
    return this.http.delete(`${this.playersUrl}/${id}`);
  }

  getPlayerAnalytics(playerId: number) {
    return this.http.get<any>(`${this.analyticsUrl}/${playerId}`);
  }

  getPlayerImpact() {
    return this.http.get<any[]>(this.impactUrl);
  }
}