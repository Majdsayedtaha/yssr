import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {  of } from 'rxjs';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { ContractService } from 'src/app/modules/recruitment-contracts/services/contract.service';
import { RentService } from 'src/app/modules/rent/services/rent.service';
import { SuretyTransferService } from 'src/app/modules/surety-transfer/services/surety-transfer.service';
import { WaiverService } from 'src/app/modules/waiver/services/waiver.service';

@Component({
  selector: 'app-dialog-service-form',
  templateUrl: './dialog-service-form.component.html',
  styleUrls: ['./dialog-service-form.component.scss'],
})
export class DialogServiceFormComponent extends CoreBaseComponent {
  public form!: FormGroup;
  public editMode: boolean = false;
  public apiGetRequestsSelect!: string;
  public isLoading!: boolean;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    @Inject(MAT_DIALOG_DATA) public editServiceData: any,
    private _dialog: MatDialogRef<DialogServiceFormComponent>,
    private _fb: FormBuilder,
    private _rentService: RentService,
    private _contractService: ContractService,
    private _waiverService: WaiverService,
    private _suretyTransferService: SuretyTransferService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initialForm();
    this.watchFormValues();
    if (this.editServiceData) {
      this.editMode = true;
      setTimeout(() => {
        this.form.patchValue({
          id: this.editServiceData?.id,
          serviceMain: this.editServiceData?.mainService || this.editServiceData?.serviceMain,
          serviceName: this.editServiceData?.serviceName || this.editServiceData?.parallelService,
          serviceNumber: this.editServiceData?.serviceNumber || this.editServiceData?.request,
          // accountNumber: this.editServiceData?.accountNumber,
          details: this.editServiceData?.details,
          description: this.editServiceData?.description,
          taxType: this.editServiceData?.taxType,
          taxAmount: this.editServiceData?.taxAmount,
          discount: this.editServiceData?.discount,
          contractAmount: this.editServiceData?.contractAmount,
          totalWithoutTax: this.editServiceData?.totalWithoutTax,
          totalWithTax: this.editServiceData?.totalWithTax,
        });
      }, 0);
    }
  }

  initialForm() {
    this.form = this._fb.group({
      id: [null],
      serviceMain: [null, Validators.required],
      serviceName: [null, Validators.required],
      serviceNumber: [null, Validators.required],
      // accountNumber: [null, Validators.required],
      details: [null],
      description: [null],
      requestId: [null],
      parallelServiceId: [null],
      // This attributes below just for view details after Service Number chosen.
      totalWithoutTax: [null],
      totalWithTax: [null],
      contractAmount: [null],
      taxType: [null],
      taxAmount: [null],
      discount: [null],
    });
  }

  watchFormValues() {
    this.form.get('serviceMain')?.valueChanges.subscribe(data => {
      if (data && (typeof data.value === 'number' || typeof data.value === 'object')) {
        this.form.patchValue(
          {
            serviceName: null,
            serviceNumber: null,
          },
          { emitEvent: false }
        );
      }
    });

    this.form.get('serviceName')?.valueChanges.subscribe(data => {
      if (data && (typeof data.value === 'number' || typeof data.value === 'object')) {
        if (this.form.get('serviceNumber')?.value) {
          this.form.patchValue(
            {
              serviceNumber: null,
              taxType: null,
              taxAmount: null,
              discount: null,
              contractAmount: null,
              totalWithTax: null,
              totalWithoutTax: null,
            },
            { emitEvent: false }
          );
        }
        switch (data.value) {
          case 1:
            this.apiGetRequestsSelect = 'RentRequest/GetRentRequestsSelect';
            break;
          case 2:
            this.apiGetRequestsSelect = 'RecruitmentContract/GetContractsSelect';
            break;
          case 3:
            this.apiGetRequestsSelect = 'WaiverRequest/GetWaiverRequestsSelect';
            break;
          case 4:
            this.apiGetRequestsSelect = 'SponsorshipTransfer/GetRequestsSelect';
            break;
        }
      }
    });

    this.form.get('serviceNumber')?.valueChanges.subscribe(data => {
      if (data && data.id) {
        const serviceName = this.form.get('serviceName')?.value;
        switch (serviceName.value) {
          case 1:
            this.isLoading = true;
            this._rentService.infoRent(data.id).subscribe({
              next: res => {
                this.fillServiceValues(res.data, 'rent');
              },
              complete: () => {
                this.isLoading = false;
              },
            });
            break;
          case 2:
            this.isLoading = true;
            this._contractService.getContractDetails(data.id).subscribe({
              next: res => {
                this.fillServiceValues(res.data, 'recruitment');
              },
              complete: () => {
                this.isLoading = false;
              },
            });
            break;
          case 3:
            this.isLoading = true;
            this._waiverService.fetchWaiverRequestDetails(data.id).subscribe({
              next: res => {
                this.fillServiceValues(res?.data, 'waiver');
              },
              complete: () => {
                this.isLoading = false;
              },
            });
            break;
          case 4:
            this.isLoading = true;
            this._suretyTransferService.fetchOrderInfo(data.id).subscribe({
              next: res => {
                this.fillServiceValues(res.data, 'transfer');
              },
              complete: () => {
                this.isLoading = false;
              },
            });
            break;
        }
      }
    });
  }

  fillServiceValues(data: any, type: string) {
    if (!data) return;
    switch (type) {
      case 'rent':
        this.form.patchValue({
          taxType: data.taxType,
          taxAmount: data.taxAmount,
          discount: data.discount, //rent not found discount
          contractAmount: data.rentAmount,
          totalWithTax: data.rentAmountWithTax,
          totalWithoutTax: data.rentAmountWithoutTax,
        });
        break;
      case 'recruitment':
        this.form.patchValue({
          taxType: data.taxType,
          taxAmount: data.taxAmount,
          discount: data.discount,
          contractAmount: data.contractAmount,
          totalWithTax: data.totalWithTax,
          totalWithoutTax: data.totalWithoutTax,
        });
        break;
      case 'waiver':
        this.form.patchValue({
          taxType: data.taxType,
          taxAmount: data.taxAmount,
          discount: data.discount, //not found
          contractAmount: data.transferAmount,
          totalWithTax: data.totalWithTax, //not found
          totalWithoutTax: data.totalWithoutTax, //not found
        });
        break;
      case 'transfer':
        this.form.patchValue({
          taxType: data.taxType,
          taxAmount: data.sponsorshipTransferTaxAmount,
          discount: data.discount, //not found
          contractAmount: data.sponsorshipTransferAmount,
          totalWithTax: data.totalWithTax,
          totalWithoutTax: data.totalWithoutTax, //not found
        });
        break;
    }
  }

  getParallelServicesDepartment = () => {
    const serviceMain = this.form.get('serviceMain')?.value.id;
    if (serviceMain) return this.getParallelServices(serviceMain);
    else return of([]);
  };

  submit() {
    if (this.editMode) {
      //Edit Mode
      this.form.get('id')?.setValue(this.editServiceData.id);
      this.editServiceData = { ...this.form.getRawValue(), id: this.editServiceData.id };
      this._dialog.close(this.editServiceData);
    } else {
      //Add Mode
      this.form.get('id')?.setValue(crypto.randomUUID());
      this._dialog.close(this.form.getRawValue());
    }
  }

  closeDialog() {
    this._dialog.close(null);
  }
}
