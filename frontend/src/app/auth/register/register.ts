import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html'
})
export class Register {

  username = '';
  email = '';
  password = '';

  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) { }

  register() {
    this.auth.register(this.username, this.email, this.password)
      .subscribe({

        next: () => {

          this.router.navigate(['/']);

        },

        error: (err) => {

          this.errorMessage =
            err.error.message;

        }

      });
  }
}