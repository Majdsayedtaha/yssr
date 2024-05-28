import { Component, INJECTOR, Inject, Injector, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { ICompany } from '../../models';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-company-info-form',
  templateUrl: './company-info-form.component.html',
  styleUrls: ['./company-info-form.component.scss'],
})
export class CompanyInfoFormComponent extends CoreBaseComponent {
  @ViewChild(MatStepper, { static: true }) stepper!: MatStepper;
  isLoading: boolean = false;
  loadingData: boolean = false;
  public companyInfo!: FormGroup;
  constructor(@Inject(INJECTOR) injector: Injector, private fb: FormBuilder, private _companyService: CompanyService) {
    super(injector);
  }

  ngOnInit(): void {
    this.initCompanyInfo();
    this.getCompanyInfo();
  }

  initCompanyInfo() {
    this.companyInfo = this.fb.group({
      basicInformation: this.fb.group({
        nameAr: [null, [TextValidator.arabic, Validators.required]],
        nameEn: [null, [TextValidator.english, Validators.required]],
        licenseNumber: [null, Validators.required],
        fax: [null, Validators.required],
        mobile1: [null, Validators.required],
        mobile2: [null],
        email1: [null, [Validators.required]],
        email2: [null],
        musanedPercent: [null, Validators.required],
        maroofaAmount: [null, Validators.required],
      }),
      managerInfo: this.fb.group({
        managerNameAr: [null, [TextValidator.arabic, Validators.required]],
        managerNameEn: [null, [TextValidator.english, Validators.required]],
        managerUserName: [null, Validators.required],
        managerPassword: [null],
        managerPhoneNumber: [null, Validators.required],
        managerRole: [null, Validators.required],
      }),
      nationalAddress: this.fb.group({
        cityId: [null, Validators.required],
        regionId: [null, Validators.required],
        street: [null, Validators.required],
        streetEn: [null, Validators.required],
        district: [null, Validators.required],
        districtEn: [null, Validators.required],
        postalCode: [null],
        additionalCode: [null],
        unitNumber: [null, Validators.required],
        buildingNumber: [null, Validators.required],
      }),
      additionalDetails: this.fb.group({
        commercialRegister: [null, Validators.required],
        commercialRegisterUniqueNumber: [null, Validators.required],
        commercialRegisterExpireDateMiladi: [null, Validators.required],
        commercialRegisterExpireDateHijri: [null],

        partialRegister: [null, Validators.required],
        partialRegisterUniqueNumber: [null, Validators.required],
        partialRegisterExpireDateMiladi: [null, Validators.required],
        partialRegisterExpireDateHijri: [null, Validators.required],

        countryLicense: [null, Validators.required],
        countryLicenseIssueDate: [null, Validators.required],
        countryLicenseIssueDateHijri: [null, Validators.required],
        countryLicenseExpireDate: [null, Validators.required],
        countryLicenseExpireDateHijri: [null, Validators.required],

        commerceChamber: [null, Validators.required],
        commerceChamberIssueDate: [null, Validators.required],
        commerceChamberIssueDateHijri: [null, Validators.required],
        commerceChamberExpireDate: [null, Validators.required],
        commerceChamberExpireDateHijri: [null, Validators.required],

        saudiEmail: [null, [Validators.required]],
        saudiEmailIssueDate: [null, [Validators.required]],
        saudiEmailIssueDateHijri: [null, [Validators.required]],
        saudiEmailExpireDate: [null, [Validators.required]],
        saudiEmailExpireDateHijri: [null, [Validators.required]],

        tax: [null, Validators.required],
        civilRegistry: [null, Validators.required],
        endWarrantyManually: [false],
        logo1: [null],
        logo2: [null],
        logo3: [null],
        logoUrl1: [null],
        logoUrl2: [null],
        logoUrl3: [null],
      }),
    });
  }

  getFormGroup(name: string): FormGroup {
    return <FormGroup>this.companyInfo?.get(name);
  }

  getCompanyInfo() {
    this.loadingData = true;
    this._companyService.getCompany().subscribe(res => {
      this.loadingData = false;
      this.fillCompanyFormData(res.data as ICompany);
    });
  }

  fillCompanyFormData(companyInfo: ICompany) {
    this.getFormGroup('basicInformation').patchValue({
      nameAr: companyInfo.nameAr || '',
      nameEn: companyInfo.nameEn || '',
      licenseNumber: companyInfo.licenseNumber || '',
      fax: companyInfo.fax || '',
      mobile1: companyInfo.mobile1 || '',
      mobile2: companyInfo.mobile2 === 'null' || !companyInfo.mobile2 ? '' : companyInfo.mobile2,
      email1: companyInfo.email1 || '',
      email2: companyInfo.email2 === 'null' || !companyInfo.email2 ? '' : companyInfo.email2,
      musanedPercent: companyInfo.musanedPercent || '',
      maroofaAmount: companyInfo.maroofaAmount || '',
    });
    this.getFormGroup('managerInfo').patchValue({
      managerNameAr: companyInfo.managerNameAr || '',
      managerNameEn: companyInfo.managerNameEn || '',
      managerUserName: companyInfo.managerUserName || '',
      managerPassword:
        companyInfo.managerPassword === 'null' || !companyInfo.managerPassword ? '' : companyInfo.managerPassword,
      managerPhoneNumber: companyInfo.managerPhoneNumber || '',
      managerRole: companyInfo.managerRole || '',
    });
    this.getFormGroup('nationalAddress').patchValue({
      street: companyInfo.street || '',
      streetEn: companyInfo.streetEn || '',
      district: companyInfo.district || '',
      districtEn: companyInfo.districtEn || '',
      cityId: companyInfo.city || '',
      regionId: companyInfo.region || '',
      postalCode: companyInfo.postalCode === 'null' || !companyInfo.postalCode ? '' : companyInfo.postalCode,
      additionalCode:
        companyInfo.additionalCode === 'null' || !companyInfo.additionalCode ? '' : companyInfo.additionalCode,
      unitNumber: companyInfo.unitNumber || '',
      buildingNumber: companyInfo.buildingNumber || '',
    });
    this.getFormGroup('additionalDetails').patchValue({
      commercialRegister: companyInfo.commercialRegister || '',
      commercialRegisterExpireDateMiladi: companyInfo.commercialRegisterExpireDateMiladi || '',
      commercialRegisterExpireDateHijri: companyInfo.commercialRegisterExpireDateHijri || '',
      commercialRegisterUniqueNumber: companyInfo.commercialRegisterUniqueNumber || '',
      partialRegister: companyInfo.partialRegister || '',
      partialRegisterExpireDateMiladi: companyInfo.partialRegisterExpireDateMiladi || '',
      partialRegisterExpireDateHijri: companyInfo.partialRegisterExpireDateHijri || '',
      partialRegisterUniqueNumber: companyInfo.partialRegisterUniqueNumber || '',
      tax: companyInfo.tax || '',
      countryLicense: companyInfo.countryLicense || '',
      countryLicenseExpireDate: companyInfo.countryLicenseExpireDate || '',
      countryLicenseExpireDateHijri: companyInfo.countryLicenseExpireDateHijri || '',
      countryLicenseIssueDate: companyInfo.countryLicenseIssueDate || '',
      countryLicenseIssueDateHijri: companyInfo.countryLicenseIssueDateHijri || '',
      commerceChamber: companyInfo.commerceChamber || '',
      commerceChamberExpireDate: companyInfo.commerceChamberExpireDate || '',
      commerceChamberExpireDateHijri: companyInfo.commerceChamberExpireDateHijri || '',
      commerceChamberIssueDate: companyInfo.commerceChamberIssueDate || '',
      commerceChamberIssueDateHijri: companyInfo.commerceChamberIssueDateHijri || '',
      saudiEmail: companyInfo.saudiEmail || '',
      saudiEmailExpireDate: companyInfo.saudiEmailExpireDate || '',
      saudiEmailExpireDateHijri: companyInfo.saudiEmailExpireDateHijri || '',
      saudiEmailIssueDate: companyInfo.saudiEmailIssueDate || '',
      saudiEmailIssueDateHijri: companyInfo.saudiEmailIssueDateHijri || '',
      civilRegistry: companyInfo.civilRegistry || '',
      endWarrantyManually: companyInfo.endWarrantyManually,
      logo1: companyInfo.logoUrl1,
      logo2: companyInfo.logoUrl2,
      logo3: companyInfo.logoUrl3,
      logoUrl1: companyInfo.logoUrl1,
      logoUrl2: companyInfo.logoUrl2,
      logoUrl3: companyInfo.logoUrl3,
    });
  }

  updateCompanyInfo() {
    if (!this.companyInfo.valid) return;
    const form = this.companyInfo.value;
    let companyData: ICompany = {
      ...form.basicInformation,
      ...form.managerInfo,
      ...form.nationalAddress,
      ...form.additionalDetails,
    };
    companyData.partialRegisterExpireDateHijri =
      typeof companyData.partialRegisterExpireDateHijri == 'object'
        ? companyData.partialRegisterExpireDateHijri.date
        : companyData.partialRegisterExpireDateHijri;

    companyData.commercialRegisterExpireDateHijri =
      typeof companyData.commercialRegisterExpireDateHijri == 'object'
        ? companyData.commercialRegisterExpireDateHijri.date
        : companyData.commercialRegisterExpireDateHijri;

    companyData.countryLicenseExpireDateHijri =
      typeof companyData.countryLicenseExpireDateHijri == 'object'
        ? companyData.countryLicenseExpireDateHijri.date
        : companyData.countryLicenseExpireDateHijri;

    companyData.countryLicenseIssueDateHijri =
      typeof companyData.countryLicenseIssueDateHijri == 'object'
        ? companyData.countryLicenseIssueDateHijri.date
        : companyData.countryLicenseIssueDateHijri;

    companyData.commerceChamberExpireDateHijri =
      typeof companyData.commerceChamberExpireDateHijri == 'object'
        ? companyData.commerceChamberExpireDateHijri.date
        : companyData.commerceChamberExpireDateHijri;

    companyData.commerceChamberIssueDateHijri =
      typeof companyData.commerceChamberIssueDateHijri == 'object'
        ? companyData.commerceChamberIssueDateHijri.date
        : companyData.commerceChamberIssueDateHijri;

    companyData.saudiEmailExpireDateHijri =
      typeof companyData.saudiEmailExpireDateHijri == 'object'
        ? companyData.saudiEmailExpireDateHijri.date
        : companyData.saudiEmailExpireDateHijri;

    companyData.saudiEmailIssueDateHijri =
      typeof companyData.saudiEmailIssueDateHijri == 'object'
        ? companyData.saudiEmailIssueDateHijri.date
        : companyData.saudiEmailIssueDateHijri;

    if (!this.companyInfo.get('managerInfo')?.get('managerPassword')?.value) delete companyData?.managerPassword;
    const formData = this.objectToFormData(companyData);
    this.isLoading = true;
    this._companyService.updateCompany(formData).subscribe({
      next: res => {
        this.isLoading = false;
        this.stepper.selectedIndex = 0;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  objectToFormData(obj: Object) {
    const formData = new FormData();
    Object.entries(obj).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return formData;
  }
}
