import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import {  ArrivalAirportService } from 'src/app/modules/settings/services/arrival-airport.service';
import { UntypedFormGroup } from '@angular/forms';
interface ArrivalAirportCellRendererAngularComp extends ICellRendererParams {
  formGroup: UntypedFormGroup;
}
@Component({
  template: `
    <div class="actions-row-container">
      <button mat-icon-button (click)="editArrivalAirport()">
        <mat-icon svgIcon="edit-row"></mat-icon>
      </button>
      <button mat-icon-button (click)="deleteArrivalAirport()">
        <mat-icon svgIcon="delete-row"></mat-icon>
      </button>
    </div>
  `,
})
export class ArrivalAirportActionCell implements ICellRendererAngularComp {
  public cell!: ArrivalAirportCellRendererAngularComp;

  constructor(private _arrivalAirportService: ArrivalAirportService) {}
  agInit(params: ArrivalAirportCellRendererAngularComp): void {
    this.cell = params;
  }

  refresh(params: ArrivalAirportCellRendererAngularComp): boolean {
    this.cell = params;
    return true;
  }

  deleteArrivalAirport() {
    if (!this.cell.data.id && this.cell.data.nameAr && this.cell.data.nameEn)
    this.cell.api.applyTransaction({ remove: [this.cell.data] });
  else
    this._arrivalAirportService.deleteArrivalAirport(this.cell.data.id).subscribe(res => {
      this.cell.context.parentComp.update = false;
      this.cell.api.applyTransaction({ remove: [this.cell.data] });
      this.cell.formGroup.reset();
    });
  }
  editArrivalAirport(){
    this.cell.context.parentComp.update = true;
    this.cell.formGroup.patchValue({
      id: this.cell.data.id,
      region: this.cell.data.region,
      cityId: this.cell.data.city,
      nameAr: this.cell.data.nameAr,
      nameEn: this.cell.data.nameEn,
    });
  }
}
34
