import { IEnum } from 'src/app/core/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'src/app/core/services/dialog.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, OnInit, Injector, INJECTOR, Inject } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { WaiverSpecificationService } from 'src/app/modules/waiver-specifications/services/waiver-specifications.service';

@UntilDestroy()
@Component({
  selector: 'waiver-request-form',
  templateUrl: './request-form-worker.component.html',
  styleUrls: ['./request-form-worker.component.scss'],
})
export class WaiverFormRequestWorkerComponent extends CoreBaseComponent implements OnInit {
  requestForm!: FormGroup;
  requestId!: string;
  skills: IEnum[] = [];
  isLoading!: boolean;
  loadingData!: boolean;
  // #endregion

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _dialogService: DialogService,
    private _activatedRoute: ActivatedRoute,
    private _waiverSpecificationService: WaiverSpecificationService,
    @Inject(INJECTOR) injector: Injector
  ) {
    super(injector);
  }

  // #region LifeCycle
  ngOnInit(): void {
    this.fetchData();
    this.initialForm();
    this.requestId = this._activatedRoute.snapshot.params['id'];
    if (this.requestId) {
      this.fetchWaiverRequest(this.requestId);
    }
  }
  // #endregion

  // #region Fetch
  fetchData() {
    this.fetchSkills()
      .pipe(untilDestroyed(this))
      .subscribe(res => (this.skills = res.data));
  }

  fetchWaiverRequest(requestId: string) {
    this.loadingData = true;
    this._waiverSpecificationService
      .fetchWaiverSpecificationDetails(requestId)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.loadingData = false;
        if (res) {
          this.requestForm.patchValue({
            requestDate: res.data.requestDate,
            note: res.data.note,
            ageId: res.data.age,
            religionId: res.data.religion,
            jobId: res.data.job,
            countryId: res.data.country,
          });
          const skillIdsArray = this.requestForm.controls['skillsIds'] as FormArray;
          res.data.skillsIds?.forEach(id => skillIdsArray.push(new FormControl(id)));
        }
      });
  }
  // #endregion

  // #region Form
  initialForm() {
    this.requestForm = this._fb.group({
      requestDate: this._fb.control(null, Validators.required),
      religionId: this._fb.control(null, Validators.required),
      jobId: this._fb.control(null, Validators.required),
      ageId: this._fb.control(null, Validators.required),
      countryId: this._fb.control(null, [Validators.required]),
      skillsIds: this._fb.array([], [Validators.required]),
      note: [null, Validators.maxLength(250)],
    });
  }
  // #endregion

  submit() {
    this.isLoading = true;
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }
    if (!this.requestId) {
      this._waiverSpecificationService.createRequest(this.requestForm.value).subscribe({
        next: res => {
          this.isLoading = false;
          this._dialogService
            .successNotify('success_request', 'success-request', 'add-new-request', 'back_to_request_table', false)
            .subscribe(r => {
              if (r === true) {
                this.cancel();
              } else {
                this.requestForm.reset();
                this._router.navigate(['waivers/add-request-worker']);
              }
            });
        },
        error: () => {
          this.isLoading = false;
        },
      });
    } else {
      this._waiverSpecificationService.updateRequest(this.requestForm.value, this.requestId).subscribe({
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
    this._router.navigate(['waivers/table']);
  }
}
