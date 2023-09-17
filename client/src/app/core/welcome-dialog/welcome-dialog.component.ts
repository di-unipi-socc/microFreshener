import { Component, OnInit } from '@angular/core';
import { FileService } from '../file/file.service';

@Component({
  selector: 'welcome-dialog',
  templateUrl: './welcome-dialog.component.html',
  styleUrls: ['./welcome-dialog.component.css']
})
export class WelcomeDialogComponent implements OnInit {

  visible: boolean;
  firstAccess: boolean;

  constructor(public fileService: FileService) {
    this.firstAccess = true;
  }

  ngOnInit() {
    if(this.firstAccess) {
      this.firstAccess = false;
      this.visible = true;
    }
  }

  new() {
    this.fileService.newFile();
    this.close();
  }

  import() {
    this.fileService.import();
    this.close();
  }

  close() {
    this.visible = false;
  }

}
