import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditorPermissionsService {

  constructor() {
    this.writePermissions = {};
    this.editingPermissions = {
      addNodeAllowed: false,
      addLinkAllowed: false
    };
  }

  private writePermissions;

  setIsAllowed(callback: (...any) => boolean) {
    this.writePermissions.isAllowed = callback;
  }

  isEditingAllowed(cell) {
    return this.writePermissions.isAllowed(cell);
  }

  setIsTeamWriteAllowed(callback: (...any) => boolean) {
    this.writePermissions.isTeamWriteAllowed = callback;
  }

  isTeamWriteAllowed() {
    return this.writePermissions.isTeamWriteAllowed();
  }

  ////////////////////////////////////////////////

  private editingPermissions;

  enableAddNode(isActive: boolean) {
    this.editingPermissions.addNodeAllowed = isActive;
  }

  isAddNodeEnabled(cell?): boolean {
    return this.editingPermissions.addNodeAllowed && (cell ? this.isEditingAllowed(cell) : true);
  }

  enableAddLink(isActive: boolean) {
      this.editingPermissions.addLinkAllowed = isActive;
  }

  isAddLinkEnabled(source?, target?): boolean {
    return this.editingPermissions.addLinkAllowed;
  }

  setLinkable(callback: (n: joint.shapes.microtosca.Node, n2?: joint.shapes.microtosca.Node) => boolean) {
    this.editingPermissions.linkable = callback;
  }

  linkable(n: joint.shapes.microtosca.Node, n2?: joint.shapes.microtosca.Node) {
    if(this.editingPermissions.linkable)
      return this.editingPermissions.linkable(n, n2);
    else
      return true;
  }

}
