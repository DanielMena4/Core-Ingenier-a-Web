import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private API = `${environment.apiUrl}/teams`;
  

  constructor(private http: HttpClient) { }

  getTeams() {
    return this.http.get<any[]>(this.API);
  }

  createTeam(team: any) {
    return this.http.post(this.API, team);
  }

  updateTeam(id: number, team: any) {
    return this.http.put(`${this.API}/${id}`, team);
  }

  deleteTeam(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }
}