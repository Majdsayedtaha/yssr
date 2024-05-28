import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { ExternalOfficesService } from '../../services/external-office.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from 'src/app/core/constants';
import { IExternalOfficeForm } from '../../models';
@UntilDestroy()
@Component({
  selector: 'app-external-office-form',
  templateUrl: './external-office-form.component.html',
  styleUrls: ['./external-office-form.component.scss'],
})
export class ExternalOfficeFormComponent extends CoreBaseComponent implements OnInit {
  externalOfficeForm!: FormGroup;
  officeId!: string;
  officeData!: IExternalOfficeForm;
  isLoading: boolean = false;
  loadingData: boolean = false;
  constructor(
    @Inject(INJECTOR) injector: Injector,
    private fb: FormBuilder,
    private _externalOfficesService: ExternalOfficesService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.officeId = this._activatedRoute.snapshot.params['id'];
    this.initForm();

    if (this.officeId) {
      this.getOfficeInfo();
    }
  }

  initForm() {
    this.externalOfficeForm = this.fb.group({
      nameAr: [null, [TextValidator.arabic, Validators.required]],
      nameEn: [null, [TextValidator.english, Validators.required]],
      countryId: [null, Validators.required],
      licenseNo: [null, Validators.required],
      phoneFirst: [null, Validators.required],
      phoneSecond: [null, Validators.nullValidator],
      emailFirst: [null, Validators.required],
      emailSecond: [null, Validators.nullValidator],
      workPhoneNumber: [null, Validators.nullValidator],
    });
  }

  getOfficeInfo() {
    this.loadingData = true;
    this._externalOfficesService
      .getExternalOfficeInfo(this.officeId)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.loadingData = false;
        this.officeData = res.data as IExternalOfficeForm;
        this.externalOfficeForm.patchValue({
          nameAr: this.officeData.nameAr,
          nameEn: this.officeData.nameEn,
          countryId: this.officeData.country,
          licenseNo: this.officeData.licenseNo,
          phoneFirst: this.officeData.phoneFirst,
          phoneSecond: this.officeData.phoneSecond,
          emailFirst: this.officeData.emailFirst,
          emailSecond: this.officeData.emailSecond,
          workPhoneNumber: this.officeData.workPhoneNumber,
        });
      });
  }

  updateOffice() {
    this.isLoading = true;
    const office = { ...this.externalOfficeForm.value, countryId: this.officeData.country.id };
    this._externalOfficesService
      .updateExternalOffice(this.officeId, this.externalOfficeForm.value)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          this.isLoading = false;
          this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.offices}/external-offices`);
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  addOffice() {
    this.isLoading = true;
    this._externalOfficesService
      .addExternalOffice(this.externalOfficeForm.value)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          this.isLoading = false;
          this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.offices}/external-offices`);
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
}
