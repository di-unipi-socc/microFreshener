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

  isArchitectureWriteAllowed(cell) {
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

  allowAddNode(isActive: boolean) {
    this.editingPermissions.addNodeAllowed = isActive;
  }

  isAddNodeAllowed(): boolean {
    return this.editingPermissions.addNodeAllowed;
  }

  allowAddLink(isActive: boolean) {
      this.editingPermissions.addLinkAllowed = isActive;
  }

  isAddLinkAllowed(): boolean {
    return this.editingPermissions.addLinkAllowed;
  }

}
