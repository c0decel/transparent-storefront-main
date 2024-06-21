import { Injectable, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../shared/components/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  @Input() modalType: 'newpic' | ''='';

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    console.log(this.modalType)
  }

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
