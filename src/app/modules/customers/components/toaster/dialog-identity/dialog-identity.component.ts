import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CustomerService } from '../../../services/customer.service';
import { finalize } from 'rxjs';
import { IEnum } from 'src/app/core/interfaces';
import { IResponse } from 'src/app/core/models';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { ICustomer } from '../../../models';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/core/constants';
import { FakeLengthNumberValidator } from 'src/app/core/validators/fakeLengthNumber-number.validator';

@UntilDestroy()
@Component({
  selector: 'dialog-identity',
  templateUrl: './dialog-identity.component.html',
  styleUrls: ['./dialog-identity.component.scss'],
})
export class DialogIdentityComponent extends CoreBaseComponent {
  //#region Variables
  public form!: FormGroup;
  public customer!: ICustomer;
  public loading: boolean;
  public isExist: boolean = true;
  public fetchedBefore: boolean;
  public allIdentificationTypes!: IEnum[];
  public startWithNumber: string = '-1';
  //#end region

  get f() {
    return this.form.controls;
  }

  get identificationTypeValue(): number {
    console.log(this.f['identificationTypeId']?.value);
    const identificationTypeId = this.f['identificationTypeId']?.value?.id;
    return (
      this.allIdentificationTypes?.find(r => {
        return r.id === identificationTypeId;
      })?.value || -1
    );
  }

  get prefixValue(): string {
    return +this.identificationTypeValue === 1 ? '-1' : +this.identificationTypeValue === 2 ? '-2' : '-1';
  }

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _customerService: CustomerService,
    private _dialog: MatDialogRef<DialogIdentityComponent>,
    private _fb: FormBuilder,
    private _router: Router
  ) {
    super(injector);
    this.loading = false;
    this.fetchedBefore = false;
  }

  //#region Life Cycle
  ngOnInit(): void {
    this.initialForm();
    this.fetchData();
    this.watchIdentificationType();
  }
  //#end region

  fetchData() {
    this.getIdentificationTypes().subscribe(response => (this.allIdentificationTypes = response.data));
  }

  //#region Form
  initialForm() {
    this.form = this._fb.group({
      identificationTypeId: [null, Validators.required],
      identificationNumber: [null, [Validators.required, FakeLengthNumberValidator.number()]],
    });
  }

  watchIdentificationType() {
    this.form.controls['identificationTypeId'].valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.startWithNumber = this.prefixValue;
    });
  }

  //#end region

  //#region Actions
  confirm() {
    if (this.form.valid) {
      this.fetchedBefore = true;
      this.loading = true;
      const checkForm = {
        identificationTypeId: this.form.value.identificationTypeId.id,
        identificationNumber: this.prefixValue + this.form.value.identificationNumber,
      };
      this._customerService
        .checkingCustomerIdentity(checkForm)
        .pipe(
          untilDestroyed(this),
          finalize(() => (this.loading = false))
        )
        .subscribe({
          next: (response: IResponse<ICustomer>) => {
            this.customer = response.data;
            if (this.customer) {
              this.isExist = true;
              this.form.disable();
              setTimeout(() => {
                this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.customers}/update/${this.customer.id}`);
                this.closedDialog();
              }, 3000);
            } else this.isExist = false;
          },
        });
    }
  }

  closedDialog() {
    if (!this.loading) {
      this.loading = false;
      this._dialog.close({ form: this.form.value, customer: this.customer });
    }
  }
  //#end region
}
