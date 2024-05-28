import { UntypedFormGroup } from '@angular/forms';
import { IRoleEnum } from 'src/app/core/constants';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { VisaTypeService } from 'src/app/modules/settings/services/visa-type.service';
interface VisaCellRendererAngularComp extends ICellRendererParams {
  formGroup: UntypedFormGroup;
}
@UntilDestroy()
@Component({
  template: `
    <div class="actions-row-container">
      <button mat-icon-button (click)="editVisaType()" authorization [roleValue]="role" [authName]="authCanUpdate">
        <mat-icon svgIcon="edit-row"></mat-icon>
      </button>
      <button mat-icon-button (click)="deleteVisaType()" authorization [roleValue]="role" [authName]="authCanDelete">
        <mat-icon svgIcon="delete-row"></mat-icon>
      </button>
    </div>
  `,
})
export class VisaActionCell extends CoreBaseComponent implements ICellRendererAngularComp {

  public cell!: VisaCellRendererAngularComp;
  public role = IRoleEnum.VisaType;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _visaTypeService: VisaTypeService) {
    super(injector);
  }

  agInit(params: VisaCellRendererAngularComp): void {
    this.cell = params;
  }

  refresh(params: VisaCellRendererAngularComp): boolean {
    this.cell = params;
    return true;
  }

  deleteVisaType() {
    if (!this.cell.data.id && this.cell.data.nameAr && this.cell.data.nameEn)
      this.cell.api.applyTransaction({ remove: [this.cell.data] });
    else
      this._visaTypeService.deleteVisaType(this.cell.data.id).pipe(untilDestroyed(this)).subscribe(res => {
        this.cell.context.parentComp.update = false;
        this.cell.api.applyTransaction({ remove: [this.cell.data] });
        this.cell.formGroup.reset();
      });
  }

  editVisaType() {
    this.cell.context.parentComp.update = true;
    this.cell.formGroup.patchValue({
      id: this.cell.data.id,
      nameAr: this.cell.data.nameAr,
      nameEn: this.cell.data.nameEn,
    });
  }
}
