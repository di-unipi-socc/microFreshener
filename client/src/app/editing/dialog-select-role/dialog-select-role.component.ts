import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/api';

@Component({
  selector: 'app-dialog-select-role',
  templateUrl: './dialog-select-role.component.html',
  styleUrls: ['./dialog-select-role.component.css']
})
export class DialogSelectRoleComponent implements OnInit {

  constructor(public ref: DynamicDialogRef) { }

  ngOnInit() {
  }

  closeAsProductOwner() {
    this.ref.close({ role: "po"});
  }

  closeAsTeam() {
    this.ref.close({ role: "team"});
  }

}
