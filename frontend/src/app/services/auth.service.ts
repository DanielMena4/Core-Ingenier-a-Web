import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
        })
      );
  }

  register(username: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, {
      username,
      email,
      password
    });
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }

  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  }

  getUser() {
    if (typeof window !== 'undefined' && localStorage) {
      return JSON.parse(localStorage.getItem('user') || '{}');
    }
    return null;
  }
}