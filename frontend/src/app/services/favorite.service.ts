import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoriteService {

  private apiUrl = 'http://localhost:3000/api/favorites';

  constructor(private http: HttpClient) { }

  addFavorite(playerId: number) {
    return this.http.post(this.apiUrl, { player_id: playerId });
  }

  getFavorites() {
    return this.http.get<any[]>(this.apiUrl);
  }

  removeFavorite(playerId: number) {
    return this.http.delete(`${this.apiUrl}/${playerId}`);
  }
}