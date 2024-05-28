import { Component, OnInit, Injector, INJECTOR, Inject } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkerBenefitsService } from '../../services/worker-benefits.service';
import { DialogService } from 'src/app/core/services/dialog.service';
@Component({
  selector: 'worker-benefit-form',
  templateUrl: './benefit-form.component.html',
  styleUrls: ['./benefit-form.component.scss'],
})
export class BenefitFormRequestComponent extends CoreBaseComponent implements OnInit {
  requestForm!: FormGroup;
  requestId!: string;
  isLoading!: boolean;
  loadingData!: boolean;
  skills: any = [];
  ngOnInit(): void {}

  constructor(
    private _fb: FormBuilder,

    private _router: Router,
    private _workerBenefitsService: WorkerBenefitsService,
    private _activatedRoute: ActivatedRoute,
    private _dialogService: DialogService,
    @Inject(INJECTOR) injector: Injector
  ) {
    super(injector);
    this.requestId = this._activatedRoute.snapshot.params['id'];
    this.initForm();
    this.fetchSkills().subscribe(res => {
      this.skills = res.data;
    });
    if (this.requestId) {
      this.loadingData = true;
      this._workerBenefitsService.fetchBenefitDetails(this.requestId).subscribe(res => {
        this.loadingData = false;
        if (res) {
          this.requestForm.patchValue({
            amount: res.data.amount,
            benefitTypeId: res.data.benefitType,
            daysWithoutWork: res.data.daysWithoutWork,
            workerId: res.data.worker,
            date: res.data.date,
          });
        }
      });
    }
  }
  initForm() {
    this.requestForm = this._fb.group({
      amount: this._fb.control(0, [Validators.required, Validators.min(0)]),
      daysWithoutWork: this._fb.control(null, Validators.required),
      workerId: this._fb.control(null, Validators.required),
      benefitTypeId: this._fb.control(null, Validators.required),
      date: this._fb.control(null, Validators.required),
      notes: this._fb.control(null),
    });
  }

  submit() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    if (!this.requestId) {
      let data = {
        ...this.requestForm.value,
        workerId: this.requestForm.value['workerId'].id,
      };
      this._workerBenefitsService.createBenefit(data).subscribe({
        next: res => {
          this.isLoading = false;
          // this._dialogService
          //   .successNotify('success_request', 'success-request', 'add-new-request', 'back_to_request_table', false)
          //   .subscribe(r => {
          //     if (r === true) {
          //       this.cancel();
          //     } else {
          this.requestForm.reset({ amount: 0 });
          //   this._router.navigate(['worker-benefits/add']);
          // }
          // });
        },
        error: () => {
          this.isLoading = false;
        },
      });
    } else {
      let data = {
        ...this.requestForm.value,
        workerId: this.requestForm.value['workerId'].id,
      };
      this._workerBenefitsService.updateBenefit(data, this.requestId).subscribe({
        next: res => {
          this.isLoading = false;

          this.cancel();
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  cancel() {
    this._router.navigate(['worker-benefits/table']);
  }
}
