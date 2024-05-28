import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { StoreService } from '../../../../services/store.service';
@UntilDestroy()
@Component({
  selector: 'app-dialog-action-storage',
  templateUrl: './dialog-action-storage.component.html',
  styleUrls: ['./dialog-action-storage.component.scss'],
})
export class DialogActionStorageComponent extends CoreBaseComponent {
  public form!: FormGroup;
  constructor(
    @Inject(INJECTOR) injector: Injector,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private _dialog: MatDialogRef<DialogActionStorageComponent>,
    private _fb: FormBuilder,
    private _storeService: StoreService
  ) {
    super(injector);
  }

  //#region Life Cycle
  ngOnInit(): void {
    this.initialForm();
    if (this.editData.update) {
      this.form.patchValue({
        nameEn: this.editData.data.nameEn,
        nameAr: this.editData.data.nameAr,
      });
    }
  }
  //#end region

  //#region Form
  initialForm() {
    this.form = this._fb.group({
      nameAr: [null, [Validators.required, TextValidator.arabic]],
      nameEn: [null, [Validators.required, TextValidator.english]],
      accountId: [null, Validators.required],
    });
  }
  //#end region

  submit() {
    if (this.editData.update === false) {
      this._storeService
        .addStore(this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe(res => {
          this.closeDialog(res.data);
        });
    } else if (this.editData.update === true) {
      this._storeService
        .updateStore(this.editData.data.id, this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe(res => {
          this.closeDialog(res.data);
        });
    }
  }

  closeDialog(data: any) {
    this._dialog.close(data);
  }
  //#end region
}
