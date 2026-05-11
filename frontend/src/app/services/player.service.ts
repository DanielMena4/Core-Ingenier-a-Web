import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environmets/environment';


@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private apiUrl = `${environment.apiUrl}`;
  

  constructor(private http: HttpClient) { }

  getPlayers() {
    return this.http.get<any[]>(this.apiUrl);
  }

  createPlayer(player: any) {
    return this.http.post(this.apiUrl, player);
  }

  updatePlayer(id: number, player: any) {
    return this.http.put(`${this.apiUrl}/${id}`, player);
  }

  deletePlayer(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}