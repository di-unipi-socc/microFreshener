import { Injectable } from '@angular/core';
import { UserRole } from '../user-role';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  
  private name: string;
  private role: UserRole;

  constructor() {}

  login(username: string) {
    console.log("Logged as " + username);
    switch(username) {
      case "admin":
        this.loginAsAdmin();
        break;
      default:
        this.loginAsTeam(username);
    }
  }

  loginAsAdmin() {
    this.name = "admin";
    this.role = UserRole.ADMIN;
  }

  loginAsTeam(teamName: string) {
    this.name = teamName;
    this.role = UserRole.TEAM;
  }

  logout() {
    this.name = undefined;
    this.role = undefined;
  }

  getName(): string {
    return this.name;
  }

  isAdmin(): boolean {
    return this.role == UserRole.ADMIN;
  }

  isTeam(): boolean {
    return this.role == UserRole.TEAM;
  }

}
