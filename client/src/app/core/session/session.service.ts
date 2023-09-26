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
    this.name = username;
    switch(username) {
      case "admin":
        this.role = UserRole.ADMIN;
        break;
      default:
        this.role = UserRole.TEAM;
    }
  }

  logout() {
    this.name = undefined;
    this.role = undefined;
  }

  getName(): string {
    return this.name;
  }

  getRole(): UserRole {
    return this.role;
  }

  isAdmin(): boolean {
    return this.role == UserRole.ADMIN;
  }

  isTeam(): boolean {
    return this.role == UserRole.TEAM;
  }

}
