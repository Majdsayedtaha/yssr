import { IRoleEnum } from 'src/app/core/constants';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { RegionService } from 'src/app/modules/settings/services/region.service';
@UntilDestroy()
@Component({
  template: `
    <div class="actions-row-container">
      <button mat-icon-button (click)="editRegion()" authorization [roleValue]="role" [authName]="authCanUpdate">
        <mat-icon svgIcon="edit-row"></mat-icon>
      </button>
      <button mat-icon-button (click)="deleteRegion()" authorization [roleValue]="role" [authName]="authCanDelete">
        <mat-icon svgIcon="delete-row"></mat-icon>
      </button>
    </div>
  `,
})
export class RegionsActionCell extends CoreBaseComponent implements ICellRendererAngularComp {

  public cell!: ICellRendererParams;
  public role = IRoleEnum.Region;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _regionService: RegionService) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.cell = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cell = params;
    return false;
  }

  deleteRegion() {
    if (!this.cell.data.id && this.cell.data.nameAr && this.cell.data.nameEn)
      this.cell.api.applyTransaction({ remove: [this.cell.data] });
    else {
      this._regionService
        .deleteRegion(this.cell.data.id)
        .pipe(untilDestroyed(this))
        .subscribe(res => {
          this.cell.context.parentComp.update = false;
          this.cell.api.applyTransaction({ remove: [this.cell.data] });
          this.cell.context.parentComp.regionForm.reset();
        });
    }
  }

  editRegion() {
    this.cell.context.parentComp.update = true;
    this.cell.context.parentComp.regionForm.patchValue({
      id: this.cell.data.id,
      nameAr: this.cell.data.nameAr,
      nameEn: this.cell.data.nameEn,
      countryId: this.cell.data.country,
    });
  }
}
