import { UntypedFormGroup } from '@angular/forms';
import { IRoleEnum } from 'src/app/core/constants';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { CountryService } from 'src/app/modules/settings/services/country.service';
interface CountryCellRendererAngularComp extends ICellRendererParams {
  formGroup: UntypedFormGroup;
}
@Component({
  template: `
    <div class="actions-row-container">
      <button mat-icon-button (click)="editCountry()" authorization [roleValue]="role" [authName]="authCanUpdate">
        <mat-icon svgIcon="edit-row"></mat-icon>
      </button>
      <button mat-icon-button (click)="deleteCountry()" authorization [roleValue]="role" [authName]="authCanDelete">
        <mat-icon svgIcon="delete-row"></mat-icon>
      </button>
    </div>
  `,
})
export class CountryActionCell extends CoreBaseComponent implements ICellRendererAngularComp {
  public cell!: CountryCellRendererAngularComp;
  public role = IRoleEnum.Country;

  constructor(@Inject(INJECTOR) injector: Injector, private _countryService: CountryService) {
    super(injector);
  }

  agInit(params: CountryCellRendererAngularComp): void {
    this.cell = params;
  }

  refresh(params: CountryCellRendererAngularComp): boolean {
    this.cell = params;
    return true;
  }

  deleteCountry() {
    if (
      !this.cell.data.id &&
      this.cell.data.nameAr &&
      this.cell.data.nameEn &&
      this.cell.data.nationalityNameAr &&
      this.cell.data.nationalityNameEn &&
      this.cell.data.arrivalDestination
    )
      this.cell.api.applyTransaction({ remove: [this.cell.data] });
    else
      this._countryService.deleteCountry(this.cell.data.id).subscribe(res => {
        this.cell.context.parentComp.update = false;
        this.cell.api.applyTransaction({ remove: [this.cell.data] });
        this.cell.formGroup.reset();
      });
  }

  editCountry() {
    this.cell.context.parentComp.update = true;
    this.cell.formGroup.patchValue({
      id: this.cell.data.id,
      nameAr: this.cell.data.nameAr,
      nameEn: this.cell.data.nameEn,
      nationalityNameAr: this.cell.data.nationalityNameAr,
      nationalityNameEn: this.cell.data.nationalityNameEn,
      arrivalDestination: this.cell.data.arrivalDestination,
    });
  }
}
