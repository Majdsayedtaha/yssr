import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExpenseService } from '../../../services/expense.service';
@UntilDestroy()
@Component({
  selector: 'app-dialog-expense',
  templateUrl: './dialog-expense.component.html',
  styleUrls: ['./dialog-expense.component.scss'],
})
export class DialogExpenseComponent extends CoreBaseComponent {
  public form!: FormGroup;
  constructor(
    @Inject(INJECTOR) injector: Injector,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private _dialog: MatDialogRef<DialogExpenseComponent>,
    private _fb: FormBuilder,
    private _expenseService: ExpenseService
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
        accountNumber: this.editData.data.accountNumber,
      });
    }
  }
  //#end region

  //#region Form
  initialForm() {
    this.form = this._fb.group({
      nameEn: [null, [Validators.required, TextValidator.english]],
      nameAr: [null, [Validators.required, TextValidator.arabic]],
      accountNumber: [null, [Validators.required]],
    });
  }
  //#end region

  submit() {
    if (this.editData.update === false) {
      this._expenseService
        .addExpense(this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe(res => {
          this.closeDialog(res.data);
        });
    } else if (this.editData.update === true) {
      this._expenseService
        .updateExpense(this.editData.data.id, this.form.value)
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
