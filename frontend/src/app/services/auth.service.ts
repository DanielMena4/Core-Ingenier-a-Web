import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {

    return this.http.post<any>(
      `${this.apiUrl}/login`,
      {
        email,
        password
      }
    ).pipe(
      tap(res => {

        if (typeof window !== 'undefined') {

          localStorage.setItem(
            'token',
            res.token
          );

          localStorage.setItem(
            'user',
            JSON.stringify(res.user)
          );
        }
      })
    );
  }

  register(
    username: string,
    email: string,
    password: string
  ) {

    return this.http.post(
      `${this.apiUrl}/register`,
      {
        username,
        email,
        password
      }
    );
  }

  logout() {

    if (typeof window !== 'undefined') {

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  isLoggedIn(): boolean {

    if (typeof window === 'undefined') {
      return false;
    }

    return !!localStorage.getItem('token');
  }

  getUser() {

    if (typeof window === 'undefined') {
      return null;
    }

    const user = localStorage.getItem('user');

    return user ? JSON.parse(user) : null;
  }
  
  getRole(): string {

    const user = this.getUser();

    return user?.role || '';
  }
  isAdmin(): boolean {

    return this.getRole() === 'admin';
  }

  isUser(): boolean {

    return this.getRole() === 'user';
  }
}