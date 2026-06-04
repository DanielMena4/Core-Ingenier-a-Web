import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private api = `${environment.apiUrl}/stats`;


  constructor(private http: HttpClient) { }

  getStats() {
    return this.http.get<any[]>(this.api);
  }

  createStat(data: any) {
    return this.http.post(this.api, data);
  }

  updateStat(id: number, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  deleteStat(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
  getStatsByMatch(id: any) {
    return this.http.get<any[]>(`${this.api}/match/${id}`);
  }
}