import { Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ExperienceTypeService } from 'src/app/modules/settings/services/experience-type.service';

interface ServiceCellRendererAngularComp extends ICellRendererParams {
  formGroup: UntypedFormGroup;
}

@Component({
  template: `
    <div class="actions-row-container">
      <button mat-icon-button (click)="edit()">
        <mat-icon svgIcon="edit-row"></mat-icon>
      </button>
      <button mat-icon-button (click)="delete()">
        <mat-icon svgIcon="delete-row"></mat-icon>
      </button>
    </div>
  `,
})
export class SubServicesActionCell implements ICellRendererAngularComp {

  public cell!: ServiceCellRendererAngularComp;

  constructor(private _experienceTypeService: ExperienceTypeService) { }

  agInit(params: ServiceCellRendererAngularComp): void {
    this.cell = params;
  }

  refresh(params: ServiceCellRendererAngularComp): boolean {
    this.cell = params;
    return true;
  }

  delete() {
    if (!this.cell.data.id && this.cell.data.nameAr && this.cell.data.nameEn)
      this.cell.api.applyTransaction({ remove: [this.cell.data] });
    else
      this._experienceTypeService.deleteExperienceType(this.cell.data.id).subscribe(res => {
        this.cell.context.parentComp.update = false;
        this.cell.api.applyTransaction({ remove: [this.cell.data] });
        this.cell.formGroup.reset();
      });
  }

  edit() {
    this.cell.context.parentComp.update = true;
    this.cell.formGroup.patchValue({
      id: this.cell.data.id,
      serviceMain: this.cell.data.serviceMain,
      nameAr: this.cell.data.nameAr,
      nameEn: this.cell.data.nameEn,
    });
  }
}
