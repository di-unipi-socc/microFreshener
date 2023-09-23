import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserRole } from 'src/app/core/user-role';

@Component({
  selector: 'app-dialog-select-role',
  templateUrl: './dialog-select-role.component.html',
  styleUrls: ['./dialog-select-role.component.css']
})
export class DialogSelectRoleComponent implements OnInit {

  /*public static readonly PRODUCT_OWNER_ROLE = "po";
  public static readonly TEAM_MEMBER_ROLE = "team";*/

  constructor(public ref: DynamicDialogRef) { }

  ngOnInit() {
  }

  closeAsProductOwner() {
    //this.ref.close({ role: DialogSelectRoleComponent.PRODUCT_OWNER_ROLE});
    this.ref.close({ role: UserRole.ADMIN });
  }

  closeAsTeam() {
    //this.ref.close({ role: DialogSelectRoleComponent.TEAM_MEMBER_ROLE});
    this.ref.close({ role: UserRole.TEAM });
  }

}
