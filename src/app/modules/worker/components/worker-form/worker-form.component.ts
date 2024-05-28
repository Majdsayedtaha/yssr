import { finalize } from 'rxjs';
import { IResponse } from 'src/app/core/models';
import { MatStepper } from '@angular/material/stepper';
import { IWorker, IWorkerFormData } from '../../models';
import { ActivatedRoute, Router } from '@angular/router';
import { WORKER_STEP_KEY } from 'src/app/core/constants';
import { WorkerService } from '../../services/worker.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StorageService } from 'src/app/core/services/storage.service';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { Component, INJECTOR, Inject, Injector, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { FakeLengthNumberValidator } from 'src/app/core/validators/fakeLengthNumber-number.validator';

@UntilDestroy()
@Component({
  selector: 'app-worker-form',
  templateUrl: './worker-form.component.html',
  styleUrls: ['./worker-form.component.scss'],
})
export class WorkerFormComponent extends CoreBaseComponent implements OnInit {
  //#region Variables
  //Decorators
  @ViewChild(MatStepper, { static: true }) stepper!: MatStepper;
  //public
  public form!: FormGroup;
  public selectedIndex: number = 0;
  public workerId!: string;
  public loading: boolean = false;
  public loadingData: boolean = false;
  public isUpdated: boolean = false;
  public isBlocked: boolean = false;
  //#endregion

  /**
   * @param {WorkerService} _workerService
   * @param {Router} _router
   * @param {Injector} injector
   */
  constructor(
    private _fb: FormBuilder,
    private _storageService: StorageService,
    private _workerService: WorkerService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    @Inject(INJECTOR) injector: Injector
  ) {
    super(injector);
  }

  // #region Life Cycle
  ngOnInit(): void {
    this.workerId = this._activatedRoute.snapshot.params['id'];
    this.initialForm();
    if (this.workerId) {
      this.isUpdated = true;
      this.fetchWorkerDetails(this.workerId);
    } else {
      this.isUpdated = false;
    }
    if (this._storageService.getSessionObject(WORKER_STEP_KEY))
      this.stepper.selectedIndex = this._storageService.getSessionObject(WORKER_STEP_KEY);
    else this.stepper.selectedIndex = 0;
  }
  //#endregion

  //#region Form
  initialForm() {
    this.form = this._fb.group({
      //#region Personal Section
      personalFrom: this._fb.group({
        // NameAr: [null, [Validators.required, TextValidator.arabic]],
        NameEn: [null, [Validators.required]],
        GenderId: [null, Validators.required],
        BirthDate: [null, Validators.required],
        PlaceOfBirth: [null, Validators.required],
        CVMobileFirst: [null, [Validators.required]],
        CVMobileSecond: [null, [Validators.nullValidator]],
        Email: [null, [Validators.required, Validators.email, Validators.maxLength(100)]],
        ReligionId: [null, Validators.required],
        MaritalStatusId: [null, Validators.required],
        NumberOfChildren: [null, [Validators.nullValidator, Validators.min(0)]],
        Weight: [null, [Validators.nullValidator, Validators.min(0)]],
        Tall: [null, [Validators.nullValidator, Validators.min(0)]],
        CVTypeId: [null, Validators.required],
        JobId: [null, Validators.nullValidator],
        CountryId: [null, Validators.nullValidator],
        cvTypeCheckedData: [true, Validators.nullValidator],
      }),
      //#endregion

      // #region Passport Section
      passportForm: this._fb.group({
        PassportNo: [null, [Validators.required, Validators.maxLength(10)]],
        PassportPlaceOfIssue: [null, [Validators.required, Validators.maxLength(250)]],
        PassportDateOfIssue: [null, Validators.required],
        PassportDateOfExpire: [null, Validators.required],
        IqamaNumber: [null, [Validators.required, FakeLengthNumberValidator.number()]],
        IqamaPlaceOfIssue: [null, [Validators.required, Validators.maxLength(250)]],
        IqamaStartDate: [null, Validators.required],
        IqamaExpireDate: [null, Validators.required],
        BorderNumber: [null, [Validators.required, Validators.maxLength(100)]],
        WorkLicenseStartDate: [null, Validators.required],
        WorkLicenseExpireDate: [null, Validators.required],
        InsuranceCompany: [null, [Validators.maxLength(250)]],
        InsuranceCategory: [null, [Validators.maxLength(250)]],
        InsuranceStartDate: [null],
        InsuranceExpireDate: [null],
        PolicyNumber: [null, [Validators.maxLength(250)]],
      }),
      // #endregion

      // #region Experience Section
      experienceForm: this._fb.group({
        ExperienceTypeId: [null, Validators.nullValidator],
        YearsOfExperience: [null, Validators.required],
        LastCountryId: [null, Validators.nullValidator],
        DetailsOfExperience: [null, Validators.nullValidator],
        EducationalLevel: [null, Validators.nullValidator],
        ArabicLevelId: [null, Validators.required],
        EnglishLevelId: [null, Validators.required],
        ExternalOfficeId: [null, Validators.nullValidator],
        MonthlySalary: [null, [Validators.nullValidator, Validators.min(1)]],
        ApartmentId: [null, [Validators.required]],
      }),
      //#endregion

      // #region Extra Detail Section
      extraDetailsForm: this._fb.group({
        RelativeName: [null, [Validators.nullValidator, Validators.maxLength(250)]],
        RelativeType: [null, [Validators.nullValidator, Validators.maxLength(50)]],
        RelativePhone: [null, [Validators.nullValidator, Validators.maxLength(50)]],
        RelativeAddress: [null, [Validators.nullValidator, Validators.maxLength(50)]],
        PersonalImage: [null, Validators.nullValidator],
        PersonalImagePath: [null, Validators.nullValidator],
        BorderAndVisaImage: [null, Validators.nullValidator],
        BorderAndVisaImagePath: [null, Validators.nullValidator],
        IqamaImage: [null, Validators.nullValidator],
        IqamaImagePath: [null, Validators.nullValidator],
        PassportImage: [null, Validators.nullValidator],
        PassportImagePath: [null, Validators.nullValidator],
        CVImage: [null, Validators.nullValidator],
        CVImagePath: [null, Validators.nullValidator],
        DetailsIds: this._fb.array([]),
        SkillsIds: this._fb.array([]),
      }),
      //#endregion
    });
  }

  fillFormData(worker: IWorkerFormData) {
    // #region Personal
    this.getFormGroup('personalFrom').patchValue({
      // NameAr: worker?.nameAr,
      NameEn: worker?.nameEn,
      GenderId: worker?.genderId,
      BirthDate: worker?.birthDate,
      PlaceOfBirth: worker?.placeOfBirth,
      CVMobileFirst: worker?.cvMobileFirst,
      CVMobileSecond: worker?.cvMobileSecond,
      Email: worker?.email,
      ReligionId: worker?.religion,
      MaritalStatusId: worker?.maritalStatus,
      NumberOfChildren: worker?.numberOfChildren,
      Weight: worker?.weight,
      Tall: worker?.tall,
      CVTypeId: worker?.cvType,
      JobId: worker?.job,
      CountryId: worker?.country,
      cvTypeCheckedData: worker?.cvTypeCheckedData,
    });
    // #endregion

    //#region Passport
    this.getFormGroup('passportForm').patchValue({
      PassportNo: worker?.passportNo,
      PassportPlaceOfIssue: worker?.passportPlaceOfIssue,
      PassportDateOfIssue: worker?.passportDateOfIssue,
      PassportDateOfExpire: worker?.passportDateOfExpire,
      IqamaNumber: worker?.iqamaNumber?.slice(1),
      IqamaPlaceOfIssue: worker?.iqamaPlaceOfIssue,
      IqamaStartDate: worker?.iqamaStartDate,
      IqamaExpireDate: worker?.iqamaExpireDate,
      BorderNumber: worker?.borderNumber,
      WorkLicenseStartDate: worker?.workLicenseStartDate,
      WorkLicenseExpireDate: worker?.workLicenseExpireDate,
      InsuranceCompany: worker?.insuranceCompany,
      InsuranceCategory: worker?.insuranceCategory,
      InsuranceStartDate: worker?.insuranceStartDate,
      InsuranceExpireDate: worker?.insuranceExpireDate,
      PolicyNumber: worker?.policyNumber,
    });
    //#endregion

    //#region Experience
    this.getFormGroup('experienceForm').patchValue({
      ExperienceTypeId: worker?.experienceType,
      YearsOfExperience: worker?.yearsOfExperience,
      LastCountryId: worker?.lastCountry,
      DetailsOfExperience: worker?.detailsOfExperience,
      EducationalLevel: worker?.educationalLevel,
      ArabicLevelId: worker?.arabicLevel,
      EnglishLevelId: worker?.englishLevel,
      ExternalOfficeId: worker?.externalOffice,
      MonthlySalary: worker?.monthlySalary,
      ApartmentId: worker?.apartment,
    });
    //#endregion

    //#region Extra
    this.getFormGroup('extraDetailsForm').patchValue({
      RelativeName: worker?.relativeName,
      RelativeType: worker?.relativeType,
      RelativePhone: worker?.relativePhone,
      RelativeAddress: worker?.relativeAddress,
      PersonalImagePath: worker?.personalImagePath,
      BorderAndVisaImagePath: worker?.borderAndVisaImagePath,
      IqamaImagePath: worker?.iqamaImagePath,
      PassportImagePath: worker?.passportImagePath,
      CVImagePath: worker?.cvImagePath,
    });

    //#endregion
    const detailArray = this.getFormGroup('extraDetailsForm').get('DetailsIds') as FormArray;
    worker.detailsIds.forEach(value => detailArray.push(new FormControl(value)));

    const skillArray = this.getFormGroup('extraDetailsForm').get('SkillsIds') as FormArray;
    worker.skillsIds.forEach(value => skillArray.push(new FormControl(value)));
  }
  //#endregion

  // #region Fetch
  fetchWorkerDetails(workerId: string) {
    this.loadingData = true;
    this._workerService
      .infoWorker(workerId)
      .pipe(untilDestroyed(this))
      .subscribe((response: IResponse<IWorker>) => {
        this.fillFormData(response.data as IWorkerFormData);
        this.loadingData = false;
      });
  }
  //#endregion

  // #region Actions
  getFormGroup(name: string): FormGroup {
    return <FormGroup>this.form?.get(name);
  }

  submit() {
    this.loading = true;
    const form = this.form.value;
    let worker = {
      ...form.personalFrom,
      ...form.passportForm,
      ...form.experienceForm,
      ...form.extraDetailsForm,
    };
    if (worker.IqamaNumber) worker.IqamaNumber = '2' + worker.IqamaNumber;
    worker = this.formatDates(worker);

    if (worker.personalImage == null && worker.personalImagePath) delete worker['personalImage'];
    if (worker.borderAndVisaImage == null && worker.borderAndVisaImagePath) delete worker['borderAndVisaImage'];
    if (worker.iqamaImage == null && worker.iqamaImagePath) delete worker['iqamaImage'];
    if (worker.passportImage == null && worker.passportImagePath) delete worker['passportImage'];

    const formData = this.objectToFormData(worker);
    worker.DetailsIds.forEach((value: string) => formData.append('DetailsIds[]', value));
    worker.SkillsIds.forEach((value: string) => formData.append('SkillsIds[]', value));

    if (!this.isUpdated) {
      //Add
      this._workerService
        .createWorker(formData)
        .pipe(
          untilDestroyed(this),
          finalize(() => (this.loading = false))
        )
        .subscribe(() => this._router.navigate(['/workers/table']));
    } else {
      //Update
      this._workerService
        .updateWorker(this.workerId, formData)
        .pipe(
          untilDestroyed(this),
          finalize(() => (this.loading = false))
        )
        .subscribe(() => this._router.navigate(['/workers/table']));
    }
  }

  formatDates(obj: any) {
    const dateFields = [
      'BirthDate',
      'PassportDateOfIssue',
      'PassportDateOfExpire',
      'IqamaStartDate',
      'IqamaExpireDate',
      'WorkLicenseStartDate',
      'WorkLicenseExpireDate',
      'InsuranceStartDate',
      'InsuranceExpireDate',
    ];
    for (const field of dateFields) {
      if (obj[field] && typeof obj[field] != 'string') {
        obj[field] = obj[field]?.toISOString();
      }
    }
    return obj;
  }
  // #endregion

  objectToFormData(obj: Object) {
    const formData = new FormData();
    Object.entries(obj).forEach(
      ([key, value]) => value && !['DetailsIds', 'SkillsIds'].includes(key) && formData.append(key, value)
    );
    return formData;
  }
}
