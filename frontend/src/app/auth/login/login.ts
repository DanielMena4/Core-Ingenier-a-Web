import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html'
})
export class Login {

  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: err => this.error = err.error.message
    });
  }
}