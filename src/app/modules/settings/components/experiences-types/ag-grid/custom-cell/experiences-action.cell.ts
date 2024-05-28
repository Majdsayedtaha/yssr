import { Component } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ExperienceTypeService } from 'src/app/modules/settings/services/experience-type.service';
interface ExperienceCellRendererAngularComp extends ICellRendererParams {
  formGroup: UntypedFormGroup;
}
@Component({
  template: `
    <div class="actions-row-container">
      <button mat-icon-button (click)="editExperienceType()">
        <mat-icon svgIcon="edit-row"></mat-icon>
      </button>
      <button mat-icon-button (click)="deleteExperienceType()">
        <mat-icon svgIcon="delete-row"></mat-icon>
      </button>
    </div>
  `,
})
export class ExperienceActionCell implements ICellRendererAngularComp {
  public cell!: ExperienceCellRendererAngularComp;
  constructor(private _experienceTypeService: ExperienceTypeService) {}

  agInit(params: ExperienceCellRendererAngularComp): void {
    this.cell = params;
  }

  refresh(params: ExperienceCellRendererAngularComp): boolean {
    this.cell = params;
    return true;
  }

  deleteExperienceType() {
    if (!this.cell.data.id && this.cell.data.nameAr && this.cell.data.nameEn)
      this.cell.api.applyTransaction({ remove: [this.cell.data] });
    else
      this._experienceTypeService.deleteExperienceType(this.cell.data.id).subscribe(res => {
        this.cell.context.parentComp.update = false;
        this.cell.api.applyTransaction({ remove: [this.cell.data] });
        this.cell.formGroup.reset();
      });
  }
  editExperienceType() {
    this.cell.context.parentComp.update = true;
    this.cell.formGroup.patchValue({
      id: this.cell.data.id,
      nameAr: this.cell.data.nameAr,
      nameEn: this.cell.data.nameEn,
    });
  }
}
