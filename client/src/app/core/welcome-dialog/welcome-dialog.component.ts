import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'welcome-dialog',
  templateUrl: './welcome-dialog.component.html',
  styleUrls: ['./welcome-dialog.component.css']
})
export class WelcomeDialogComponent implements OnInit {

  visible: boolean;
  firstAccess: boolean;

  constructor() {
    this.firstAccess = true;
  }

  ngOnInit() {
    if(this.firstAccess) {
      this.firstAccess = false;
      this.visible = true;
    }
  }

  new() {}

  import() {}

  close() {
    this.visible = false;
  }

}
