import { UntypedFormGroup } from '@angular/forms';
import { IRoleEnum } from 'src/app/core/constants';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { CareerService } from 'src/app/modules/settings/services/career.service';
interface CareerCellRendererAngularComp extends ICellRendererParams {
  formGroup: UntypedFormGroup;
}
@Component({
  template: `
    <div class="actions-row-container">
      <button mat-icon-button (click)="editCareer()" authorization [roleValue]="role" [authName]="authCanUpdate">
        <mat-icon svgIcon="edit-row"></mat-icon>
      </button>
      <button mat-icon-button (click)="deleteCareer()" authorization [roleValue]="role" [authName]="authCanDelete">
        <mat-icon svgIcon="delete-row"></mat-icon>
      </button>
    </div>
  `,
})
export class CareerActionCell extends CoreBaseComponent implements ICellRendererAngularComp {

  public cell!: CareerCellRendererAngularComp;
  public role = IRoleEnum.Job;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _careerService: CareerService) {
    super(injector);
  }

  agInit(params: CareerCellRendererAngularComp): void {
    this.cell = params;
  }

  refresh(params: CareerCellRendererAngularComp): boolean {
    this.cell = params;
    return true;
  }

  deleteCareer() {
    if (!this.cell.data.id && this.cell.data.nameAr && this.cell.data.nameEn)
      this.cell.api.applyTransaction({ remove: [this.cell.data] });
    else
      this._careerService.deleteCareer(this.cell.data.id).subscribe(res => {
        this.cell.context.parentComp.update = false;
        this.cell.api.applyTransaction({ remove: [this.cell.data] });
        this.cell.formGroup.reset();
      });
  }

  editCareer() {
    this.cell.context.parentComp.update = true;
    this.cell.formGroup.patchValue({
      id: this.cell.data.id,
      nameAr: this.cell.data.nameAr,
      nameEn: this.cell.data.nameEn,
    });
  }
}
