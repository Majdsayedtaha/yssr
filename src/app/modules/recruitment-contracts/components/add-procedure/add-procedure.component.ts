import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { ContractProcedureService } from '../../services/contract-procedure.service';
import { IContractProcedure } from '../../models';
import { mergeMap, of, switchMap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ContractService } from '../../services/contract.service';
@UntilDestroy()
@Component({
  selector: 'app-add-procedure',
  templateUrl: './add-procedure.component.html',
  styleUrls: ['./add-procedure.component.scss'],
})
export class AddProcedureComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  addProcedureForm!: FormGroup;
  contractProcedures!: IContractProcedure[];
  isLoading = false;
  resetCustomer: boolean = true;

  get f() {
    return this.addProcedureForm.controls;
  }

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _procedureService: ContractProcedureService,
    private _contractService: ContractService,
    private fb: FormBuilder
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initForm();
    this.watchCustomerControl();
    this.getLastProcedures();
  }

  initForm() {
    this.addProcedureForm = this.fb.group({
      customerId: [null, Validators.required],
      contractId: [null, [Validators.required]],
      procedureId: [null, Validators.required],
      statusId: [null, Validators.required],
      date: [null, Validators.required],
      note: [null],
    });
  }

  watchCustomerControl() {
    this.f['customerId'].valueChanges.pipe(untilDestroyed(this)).subscribe(id => {
      // this.isAllContractFetched = !(id && !this.f['contractId'].value);
      if (id) {
        if (this.f['contractId'].value && this.resetCustomer) {
          this.f['contractId'].reset(null);
        }
      }
    });
  }

  getLastProcedures() {
    this.addProcedureForm
      .get('contractId')
      ?.valueChanges.pipe(
        untilDestroyed(this),
        switchMap(value => {
          if (!value) {
            this.contractProcedures = [];
            return of([]);
          }
          return this._procedureService.getProcedureToContractDetail(value).pipe(
            mergeMap(res => {
              this.contractProcedures = res.data;
              return this._contractService.getCustomerOrContract('contract', value);
            })
          );
        })
      )
      .subscribe((res: any) => {
        if (res && res.data && !this.f['customerId'].value) {
          this.resetCustomer = false;
          this.addProcedureForm.get('customerId')?.setValue(res.data);
        }
      });
  }

  addProcedure() {
    this.isLoading = true;
    this._procedureService.linkProcedureWithContract(this.addProcedureForm.value).subscribe({
      next: res => {
        this.addProcedureForm.reset();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  fetchCustomerProceduresSelect = (value?: string, page?: number) => {
    const contractId = this.addProcedureForm.get('contractId')?.value;
    if (contractId) return this.fetchCustomerProcedures(contractId, value, page);
    else return of([]);
  };
}
