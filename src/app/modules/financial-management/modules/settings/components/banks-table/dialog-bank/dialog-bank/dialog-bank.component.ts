import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { DialogActionStorageComponent } from '../../../storage-table/dialog-action/dialog-action-storage/dialog-action-storage.component';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { BankService } from '../../../../services/bank.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'app-dialog-bank',
  templateUrl: './dialog-bank.component.html',
  styleUrls: ['./dialog-bank.component.scss'],
})
export class DialogBankComponent extends CoreBaseComponent {
  public form!: FormGroup;
  constructor(
    @Inject(INJECTOR) injector: Injector,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private _dialog: MatDialogRef<DialogBankComponent>,
    private _fb: FormBuilder,
    private _bankService: BankService
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
      nameEn: [null, [Validators.required, TextValidator.english]],
      nameAr: [null, [Validators.required, TextValidator.arabic]],
      accountId: [null, [Validators.required]],
    });
  }
  //#end region

  submit() {
    if (this.editData.update === false) {
      this._bankService
        .addBank(this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe(res => {
          this.closeDialog(res.data);
        });
    } else if (this.editData.update === true) {
      this._bankService
        .updateBank(this.editData.data.id, this.form.value)
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
