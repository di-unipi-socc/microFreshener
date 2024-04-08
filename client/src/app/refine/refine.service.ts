import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogRefineComponent } from './dialog-refine/dialog-refine.component';

@Injectable({
  providedIn: 'root'
})
export class RefineService {

  constructor(
    private dialogService: DialogService,
  ) {}

  refine() {
  const ref = this.dialogService.open(DialogRefineComponent, {
      header: 'Refine the model',
      width: '70%',
      draggable: true
  });
  ref.onClose.subscribe((data) => {

  });
  }
}
