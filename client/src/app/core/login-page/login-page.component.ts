import { Component } from '@angular/core';
import { SessionService } from '../session/session.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

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

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.router.url === '/') {
        window.location.reload();
      }
    });
  }

  login() {
    this.session.login(this.username);
    this.router.navigate(['/editor']);
  }

}
