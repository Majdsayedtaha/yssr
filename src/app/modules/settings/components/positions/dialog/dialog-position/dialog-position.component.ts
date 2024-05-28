import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IResponse } from 'src/app/core/models';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { IPosition } from 'src/app/modules/settings/models/position.interface';
import { PositionsService } from 'src/app/modules/settings/services/position.service';
@UntilDestroy()
@Component({
  selector: 'app-dialog-position',
  templateUrl: './dialog-position.component.html',
  styleUrls: ['./dialog-position.component.scss'],
})
export class DialogPositionComponent extends CoreBaseComponent {
  //#region Variables
  public form!: FormGroup;
  public position!: IPosition;
  public loading: boolean = false;
  public editMode: boolean = false;
  public isGettingData: boolean = false;
  //#end region

  constructor(
    private _fb: FormBuilder,
    @Inject(INJECTOR) injector: Injector,
    private _positionsService: PositionsService,
    @Inject(MAT_DIALOG_DATA) public passParamsData: { id: string },
    private _dialog: MatDialogRef<DialogPositionComponent>
  ) {
    super(injector);
  }

  //#region Life Cycle
  ngOnInit(): void {
    this.initialForm();
    if (this.passParamsData) {
      this.editMode = true;
      this.fetchPositionInfo(this.passParamsData.id);
    }
  }
  //#end region

  //#region Form
  initialForm() {
    this.form = this._fb.group({
      nameAr: [null, [Validators.required, TextValidator.arabic]],
      nameEn: [null, [Validators.required, TextValidator.english]],
    });
  }

  fillFormData(template: IPosition) {
    this.form.patchValue({
      nameAr: template.nameAr,
      nameEn: template.nameEn,
    });
  }
  //#endregion

  //#region Fetch
  fetchPositionInfo(Id: string) {
    this.isGettingData = true;
    this._positionsService
      .getRoleInfo(Id)
      .pipe(untilDestroyed(this))
      .subscribe((response: IResponse<any>) => {
        this.position = response.data;
        this.fillFormData(this.position);
        this.isGettingData = false;
      });
  }
  // #endregion

  //#region Actions
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }
    if (this.form.valid) {
      this.loading = true;
      if (this.editMode) {
        //Edit Mode
        this._positionsService
          .updateRole(this.form.value, this.passParamsData.id)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (response: IResponse<any>) => {
              this.position = response.data;
              this.loading = false;
              this.closeDialog('edit');
            },
            error: () => {
              this.loading = false;
            },
          });
      } else {
        //Add Mode
        this._positionsService
          .addRole(this.form.value)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (response: IResponse<any>) => {
              this.position = response.data;
              this.loading = false;
              this.closeDialog('add');
            },
            error: () => {
              this.loading = false;
            },
          });
      }
    }
  }

  closeDialog(type: string) {
    if (!this.loading) {
      this.loading = false;
      this._dialog.close({ position: this.position, type: type });
    }
  }
  //#end region
}
