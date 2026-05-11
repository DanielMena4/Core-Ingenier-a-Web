import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environmets/environment';


@Injectable({
  providedIn: 'root'
})
export class LineupDetailsService {

  private api = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getLineupDetails() {
    return this.http.get<any[]>(this.api);
  }

  createLineupDetail(data: any) {
    return this.http.post(this.api, data);
  }

  deleteLineupDetail(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}