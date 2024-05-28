import { FormGroup } from '@angular/forms';
import { IRoleEnum } from 'src/app/core/constants';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { RecruitmentProceduresService } from 'src/app/modules/settings/services/recruitment-procedures.service';

interface CustomCellRendererParams extends ICellRendererParams {
  formGroup: FormGroup;
}

@UntilDestroy()
@Component({
  template: `
    <div class="actions-row-container" *ngIf="!cell.data.isMain">
      <button mat-icon-button (click)="editRecruitmentProcedure()" authorization [roleValue]="role" [authName]="authCanUpdate">
        <mat-icon svgIcon="edit-row"></mat-icon>
      </button>
      <button mat-icon-button (click)="deleteRecruitmentProcedure()" authorization [roleValue]="role" [authName]="authCanDelete">
        <mat-icon svgIcon="delete-row"></mat-icon>
      </button>
    </div>
  `,
})
export class RecruitmentProceduresActionCell extends CoreBaseComponent implements ICellRendererAngularComp {

  public cell!: CustomCellRendererParams;
  public role = IRoleEnum.Procedure;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _recruitmentProceduresService: RecruitmentProceduresService) {
    super(injector);
  }
  agInit(params: CustomCellRendererParams): void {
    this.cell = params;
  }

  refresh(params: CustomCellRendererParams): boolean {
    this.cell = params;
    return true;
  }

  deleteRecruitmentProcedure() {
    if (!this.cell.data.id && this.cell.data.nameAr && this.cell.data.nameEn)
      this.cell.api.applyTransaction({ remove: [this.cell.data] });
    else
      this._recruitmentProceduresService.deleteRecruitmentProcedure(this.cell.data.id).pipe(untilDestroyed(this)).subscribe(res => {
        this.cell.context.parentComp.update = false;
        this.cell.api.applyTransaction({ remove: [this.cell.data] });
        this.cell.formGroup.reset();
      });
  }

  editRecruitmentProcedure() {
    this.cell.context.parentComp.update = true;
    this.cell.formGroup.patchValue({
      id: this.cell.data.id,
      smsTemplate: this.cell.data.smsTemplate,
      emailTemplate: this.cell.data.emailTemplate,
      email: this.cell.data.email,
      phoneNumber: this.cell.data.phoneNumber,
      isShownForCustomer: this.cell.data.isShownForCustomer,
      nameAr: this.cell.data.nameAr,
      nameEn: this.cell.data.nameEn,
      sendEmailToCustomerAfterSave: this.cell.data.sendEmailToCustomerAfterSave,
      sendSmsAfterSave: this.cell.data.sendSmsAfterSave,
    });
  }
}
