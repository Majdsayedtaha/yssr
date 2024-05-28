import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GridApi } from 'ag-grid-community';
import { IPaginationOptions } from 'src/app/core/models';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MovementTransactionService } from '../../services/MovementTransaction.service';
import { IEnum } from 'src/app/core/interfaces';
import { AppRoutes } from 'src/app/core/constants';

@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
  styleUrls: ['./add-bill.component.scss'],
})
export class AddBillComponent extends CoreBaseComponent implements OnInit {
  billsMovementFrom!: FormGroup;
  isLoading: boolean = false;
  loadingData: boolean = false;
  billTypeValue!: number;
  typeMovement!: number;
  add: boolean = false;
  billsMovementId!: string;
  gridApi!: GridApi;

  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fb: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _movementTransactionService: MovementTransactionService,
    private _router: Router
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initForm();
    this.movementType();
    this.billsMovementId = this._activatedRoute.snapshot.params['id'];
    if (this.billsMovementId) {
      this.getInfo();
    }
  }

  initForm() {
    this.billsMovementFrom = this._fb.group({
      date: [null, Validators.required],
      typeId: [null, Validators.required],
      amount: [null, Validators.required],
      fromBankId: [null, Validators.required],
      toBankId: [null, Validators.required],
      fromStoreId: [null, Validators.required],
      toStoreId: [null, Validators.required],
    });
  }

  getInfo() {
    this._movementTransactionService.getMovementDetails(this.billsMovementId).subscribe(res => {
      this.billsMovementFrom.patchValue({
        date: res.data.date,
        amount: res.data.amount,
        typeId: res.data.type,
        fromBankId: res.data.fromBank,
        toBankId: res.data.toBank,
        fromStoreId: res.data.fromStore,
        toStoreId: res.data.toStore,
      });
    });
  }
  movementType() {
    this.billsMovementFrom.get('typeId')?.valueChanges.subscribe(data => {
      if (data) {
        if (data.value) {
          this.billTypeValue = data.value;
        }
      }
    });
  }

  updateBillsMovement() {
    const typeId = this.billsMovementFrom.value.typeId;
    const fromBankId = this.billsMovementFrom.value.fromBankId;
    const toBankId = this.billsMovementFrom.value.toBankId;
    const fromStoreId = this.billsMovementFrom.value.fromStoreId;
    const toStoreId = this.billsMovementFrom.value.toStoreId;
    const updateMovement = {
      ...this.billsMovementFrom.value,
      typeId: typeId?.id ? typeId.id : typeId,
      fromBankId: fromBankId?.id ? fromBankId.id : fromBankId,
      toBankId: toBankId?.id ? toBankId.id : toBankId,
      fromStoreId: fromStoreId?.id ? fromStoreId.id : fromStoreId,
      toStoreId: toStoreId?.id ? toStoreId.id : toStoreId,
    };
    this.isLoading = true;
    this._movementTransactionService.updateMovement(this.billsMovementId, updateMovement).subscribe({
      next: res => {
        this.isLoading = false;
        this.billsMovementFrom.reset();
        this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.financial}/financial-movements/table-movements`);
      },
      complete: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
  addBillsMovement() {
    const typeId = this.billsMovementFrom.value.typeId;
    const fromBankId = this.billsMovementFrom.value.fromBankId;
    const toBankId = this.billsMovementFrom.value.toBankId;
    const fromStoreId = this.billsMovementFrom.value.fromStoreId;
    const toStoreId = this.billsMovementFrom.value.toStoreId;
    const newMovement = {
      ...this.billsMovementFrom.value,
      typeId: typeId?.id ? typeId.id : typeId,
      fromBankId: fromBankId?.id ? fromBankId.id : fromBankId,
      toBankId: toBankId?.id ? toBankId.id : toBankId,
      fromStoreId: fromStoreId?.id ? fromStoreId.id : fromStoreId,
      toStoreId: toStoreId?.id ? toStoreId.id : toStoreId,
    };
    this.isLoading = true;
    this._movementTransactionService.addMovement(newMovement).subscribe({
      next: res => {
        this.isLoading = false;
        this.billsMovementFrom.reset();
      },
      complete: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
