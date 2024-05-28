import { finalize } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { ContractService } from 'src/app/modules/recruitment-contracts/services/contract.service';

@UntilDestroy()
@Component({
  selector: 'dialog-extension-contract',
  templateUrl: './dialog-extension-contract.component.html',
  styleUrls: ['./dialog-extension-contract.component.scss'],
})
export class DialogExtensionContractComponent extends CoreBaseComponent {
  //#region Variables
  public form!: FormGroup;
  public loading: boolean = false;
  public isExist: boolean = true;
  public hintExtensionDateNewContractMessage!: string;
  public warrantyDateAfter!: Date;
  //#end region

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fb: FormBuilder,
    private _contractService: ContractService,
    @Inject(MAT_DIALOG_DATA) public data: { warrantyDate: string, contractId: string },
    private _dialog: MatDialogRef<DialogExtensionContractComponent>,
  ) {
    super(injector);
  }

  //#region Life Cycle
  ngOnInit(): void {
    this.initialForm();
    this.watchChanges();
  }
  //#end region

  //#region Form
  initialForm() {
    this.form = this._fb.group({
      days: [null, [Validators.min(1), Validators.required]],
    });
  }

  watchChanges() {
    this.form.valueChanges.subscribe(data => {
      const day = data['days'];
      if (day >= 1) {
        const date = new Date(this.data.warrantyDate);
        const warrantyDate = new Date(this.data.warrantyDate);
        warrantyDate.setDate(+date.getDate() + +day);
        this.warrantyDateAfter = warrantyDate;
        this.hintExtensionDateNewContractMessage = this.getTranslation('contract_end_expected', { value: this.helperService.formatDate(warrantyDate, false) });
      }
    });
  }

  //#end region

  //#region Actions
  submit() {
    if (this.form.valid) {
      this.loading = true;
      this._contractService
        .extendWarranty(this.form.value, this.data.contractId)
        .pipe(
          untilDestroyed(this),
          finalize(() => (this.loading = false))
        )
        .subscribe({
          next: () => {
            this.close();
          },
        });
    }
  }

  close(option = true) {
    if (option)
      this._dialog.close({ form: this.warrantyDateAfter });
    else
      this._dialog.close();
  }
  //#end region
}
