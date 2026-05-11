import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environmets/environment';


@Injectable({
  providedIn: 'root'
})
export class LineupService {

  private api = `${environment.apiUrl}`;
  

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