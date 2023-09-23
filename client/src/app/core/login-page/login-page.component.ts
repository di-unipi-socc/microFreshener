import { Component } from '@angular/core';
import { SessionService } from '../session/session.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  username: string;

  constructor(private session: SessionService) {}

  login() {
    this.session.login(this.username);
  }

}
