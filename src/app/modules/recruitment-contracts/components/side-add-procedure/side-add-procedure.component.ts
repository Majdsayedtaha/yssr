import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { MatSidenav } from '@angular/material/sidenav';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractProcedureService } from '../../services/contract-procedure.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { of } from 'rxjs';
@UntilDestroy()
@Component({
  selector: 'side-add-procedure',
  templateUrl: './side-add-procedure.component.html',
  styleUrls: ['./side-add-procedure.component.scss'],
})
export class SideAddProcedureComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;
  addProcedureForm!: FormGroup;
  dataProcedureContract!: any | null;
  isLoading = false;
  update = false;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    public procedureService: ContractProcedureService,
    private fb: FormBuilder,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.addProcedureForm = this.fb.group({
      id:[null],
      contractId: [null, Validators.required],
      procedureId: [null, Validators.required],
      statusId: [null, Validators.required],
      date: [null, Validators.required],
      note: [null],
    });
    this.checkIfNeedToOpen();
  }

  checkIfNeedToOpen() {
    this.procedureService.sidenavAddProcedure.next(this.sidenav);
    this.procedureService.sideAddProcedure.pipe(untilDestroyed(this)).subscribe(data => {
      if (data && data.id) {
        this.addProcedureForm.get('contractId')?.setValue(data.id);
        this.sidenav.open();
        this.dataProcedureContract = data;
        this.update = false;
      }
      if (data?.contractInfo && data?.procedure) {
        this.dataProcedureContract = data;
        this.update = true;
        this.addProcedureForm.patchValue({
          contractId: this.dataProcedureContract?.contractInfo?.id,
          id: this.dataProcedureContract?.procedure?.id,
          procedureId: this.dataProcedureContract.procedure.procedure,
          statusId: this.dataProcedureContract.procedure.status,
          date: this.dataProcedureContract.procedure?.procedureDate,
          note: this.dataProcedureContract.procedure?.note,
        });
      }
    });
  }

  submitProcedure() {
    this.isLoading = true;
    const procedure = {
      contractId: this.addProcedureForm.value.contractId,
      id: this.addProcedureForm.value.id,
      date: this.addProcedureForm.value.date,
      note: this.addProcedureForm.value.note,
      procedureId: this.addProcedureForm.value.procedureId.id,
      statusId: this.addProcedureForm.value.statusId.id,
    };
    this.procedureService.linkProcedureWithContract(procedure).subscribe({
      next: () => {
        this.addProcedureForm.reset();
        this.procedureService.sideAddProcedure.next(null);
        this.sidenav.close();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  close() {
    this.sidenav.close();
    this.addProcedureForm.reset();
    this.procedureService.sideAddProcedure.next(null);
  }
  fetchCustomerProceduresSelect = (value?: string, page?: number) => {
    const contractId = this.addProcedureForm.get('contractId')?.value;
    if (contractId) return this.fetchCustomerProcedures(contractId, value, page);
    else return of([]);
  };
  // Life Cycle Hooks
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.procedureService.sideAddProcedure.next(null);
  }
}
