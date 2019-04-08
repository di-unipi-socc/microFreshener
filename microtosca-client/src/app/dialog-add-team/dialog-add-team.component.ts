import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';

@Component({
  selector: 'app-dialog-add-team',
  templateUrl: './dialog-add-team.component.html',
  styleUrls: ['./dialog-add-team.component.css']
})
export class DialogAddTeamComponent implements OnInit {

  teamName: string;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) { }

  ngOnInit() {
    this.teamName = null;
  }


  isDisableSave() {
    return this.teamName == null;
  }

  save(){
    this.ref.close({ name: this.teamName});
  }

}
