import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { finalize } from 'rxjs';
import { SettingService } from '../../services/setting.service';
import { ISetting } from '../../models';

@UntilDestroy()
@Component({
  selector: 'app-setting-form',
  templateUrl: './setting-form.component.html',
  styleUrls: ['./setting-form.component.scss']
})
export class SettingFormComponent extends CoreBaseComponent implements OnInit {


  public form!: FormGroup;
  public loading: boolean = false;
  public showSMSPasswordStatus: boolean = false;
  public showMAILPasswordStatus: boolean = false;
  //#endregion

  //#region Accessors
  get f() {
    return this.form.controls;
  }
  //#endregion

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fb: FormBuilder,
    private _settingService: SettingService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initialForm();
    this.fetchData();
  }

  //#region Form
  initialForm() {
    this.form = this._fb.group({

      MailboxAddress: [null, Validators.required],
      MailHost: [null, Validators.required],
      MailPort: [null, Validators.required],
      MailUserName: [null, Validators.required],
      MailPassword: [null, Validators.required],

      SMSUrl: [null, Validators.required],
      SMSUserName: [null, Validators.required],
      SMSPassword: [null, Validators.required],
    });

  }

  fetchData() {
    this._settingService.getData().pipe(untilDestroyed(this)).subscribe(response => this.fillFormData(response.data))
  }

  fillFormData(settings: ISetting[]) {
    settings.forEach(setting =>
      this.form.controls[setting.key].patchValue(setting.value)
    );
  }
  //#endregion

  //  #region Actions
  submit() {
    if (this.form.valid) {
      this.loading = true;
      let data = this.form.value;
      let formDto: ISetting[] = [];
      Object.keys(data).forEach(key => formDto.push({ key: key, value: data[key] }));
      //Add
      this._settingService
        .updateData(formDto)
        .pipe(untilDestroyed(this), finalize(() => (this.loading = false))).subscribe();
    }
  }
  //#endregion

}
