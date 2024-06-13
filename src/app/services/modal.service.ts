import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../shared/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private dialog: MatDialog) { }

  openModal(data: any): void {
    this.dialog.open(ModalComponent, {
      width: '400px',
      data: data,
      panelClass: 'modal-template'
    });
  }

  closeAllModals(): void {
    this.dialog.closeAll();
  }
}
