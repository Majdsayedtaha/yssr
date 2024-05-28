import { IRoleEnum } from 'src/app/core/constants';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { CityService } from 'src/app/modules/settings/services/city.service';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
@UntilDestroy()
@Component({
  template: `
    <div class="actions-row-container">
      <button mat-icon-button (click)="editCity()" authorization [roleValue]="role" [authName]="authCanUpdate">
        <mat-icon svgIcon="edit-row"></mat-icon>
      </button>
      <button mat-icon-button (click)="deleteCity()" authorization [roleValue]="role" [authName]="authCanDelete">
        <mat-icon svgIcon="delete-row"></mat-icon>
      </button>
    </div>
  `,
})
export class CitiesActionCell extends CoreBaseComponent implements ICellRendererAngularComp {

  public cell!: ICellRendererParams;
  public role = IRoleEnum.City;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _cityService: CityService) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.cell = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cell = params;
    return false;
  }

  deleteCity() {
    if (!this.cell.data.id && this.cell.data.nameAr && this.cell.data.nameEn)
      this.cell.api.applyTransaction({ remove: [this.cell.data] });
    else {
      this._cityService.deleteCity(this.cell.data.id).pipe(untilDestroyed(this)).subscribe(res => {
        this.cell.context.parentComp.update = false;
        this.cell.api.applyTransaction({ remove: [this.cell.data] });
        this.cell.context.parentComp.cityForm.reset();
      });
    }
  }

  editCity() {
    this.cell.context.parentComp.update = true;
    this.cell.context.parentComp.cityForm.patchValue({
      id: this.cell.data.id,
      nameAr: this.cell.data.nameAr,
      nameEn: this.cell.data.nameEn,
      regionId: this.cell.data.region,
    });
  }
}
