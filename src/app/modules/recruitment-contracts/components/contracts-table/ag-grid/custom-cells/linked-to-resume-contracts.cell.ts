import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-linked-to-resume-contracts',
  template: `
    <span class="red-status" *ngIf="params.value === false"> {{ 'not-linked' | translate }} </span>
    <span class="green-status" *ngIf="params.value === true"> {{ 'linked' | translate }} </span>
  `,
  styles: [``],
})
export class LinkedToResumeContractsCell implements ICellRendererAngularComp {
  params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }
}
