import { Component } from '@angular/core';
import { SessionService } from '../session/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  username: string;

  constructor(
      private session: SessionService,
      private router: Router
    ) {}

  login() {
    this.session.login(this.username);
    this.router.navigate(['/editor']);
  }

}
