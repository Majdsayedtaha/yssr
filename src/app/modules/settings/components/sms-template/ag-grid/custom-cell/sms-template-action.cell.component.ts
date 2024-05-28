import { UntypedFormGroup } from '@angular/forms';
import { IRoleEnum } from 'src/app/core/constants';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ITemplate } from 'src/app/modules/settings/models';
import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { TemplatesService } from 'src/app/modules/settings/services/template.service';
import { DialogSMSTemplateFormComponent } from '../../toaster/dialog-sms-template-form/dialog-sms-template-form.component';
import { DialogService } from 'src/app/core/services/dialog.service';

interface ArrivalAirportCellRendererAngularComp extends ICellRendererParams {
  formGroup: UntypedFormGroup;
}

@Component({
  template: `
    <div class="actions-row-container">
      <button mat-icon-button (click)="edit()" authorization [roleValue]="role" [authName]="authCanUpdate">
        <mat-icon svgIcon="edit-row"></mat-icon>
      </button>
      <button mat-icon-button (click)="deleteRow()" authorization [roleValue]="role" [authName]="authCanDelete">
        <mat-icon svgIcon="delete-row"></mat-icon>
      </button>
    </div>
  `,
})
export class SMSTemplateActionCellComponent extends CoreBaseComponent implements ICellRendererAngularComp {
  public cell!: ArrivalAirportCellRendererAngularComp;
  public role = IRoleEnum.Template;

  constructor(
    private _matDialog: DialogService,
    @Inject(INJECTOR) injector: Injector,
    private _templateService: TemplatesService
  ) {
    super(injector);
  }

  agInit(params: ArrivalAirportCellRendererAngularComp): void {
    this.cell = params;
  }

  refresh(params: ArrivalAirportCellRendererAngularComp): boolean {
    this.cell = params;
    return true;
  }

  deleteRow() {
    this._templateService.deleteSMSTemplate(this.cell.data.id).subscribe(res => {
      this.cell.context.parentComp.gridApi.applyTransaction({ remove: [this.cell.data] });
    });
  }

  edit() {
    this._matDialog
      .openDialog(DialogSMSTemplateFormComponent, {
        data: {
          id: this.cell.data.id,
        },
      })
      .subscribe(res => {
        if (res && res.template) {
          const template: ITemplate = res.template;
          this.cell.context.parentComp.gridApi.applyTransaction({ update: [template] });
        }
      });
  }
}
