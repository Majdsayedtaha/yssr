import { IResponse } from 'src/app/core/models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ITemplate } from 'src/app/modules/settings/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { TemplatesService } from 'src/app/modules/settings/services/template.service';
import { TextValidator } from 'src/app/core/validators/text.validator';

@UntilDestroy()
@Component({
  selector: 'dialog-sms-template-form',
  templateUrl: './dialog-sms-template-form.component.html',
  styleUrls: ['./dialog-sms-template-form.component.scss'],
})
export class DialogSMSTemplateFormComponent extends CoreBaseComponent {
  //#region Variables
  public form!: FormGroup;
  public template!: ITemplate;
  public loading: boolean = false;
  public editMode: boolean = false;
  public isGettingData: boolean = false;
  //#end region

  constructor(
    private _fb: FormBuilder,
    @Inject(INJECTOR) injector: Injector,
    private _templateService: TemplatesService,
    @Inject(MAT_DIALOG_DATA) public passParamsData: { id: string },
    private _dialog: MatDialogRef<DialogSMSTemplateFormComponent>
  ) {
    super(injector);
  }

  //#region Life Cycle
  ngOnInit(): void {
    this.initialForm();
    if (this.passParamsData) {
      this.editMode = true;
      this.fetchSMSTemplateInfo(this.passParamsData.id);
    }
  }
  //#end region

  //#region Form
  initialForm() {
    this.form = this._fb.group({
      titleAr: [null, [Validators.required, TextValidator.arabic]],
      titleEn: [null, [Validators.required, TextValidator.english]],
      textAr: [null, Validators.required],
      textEn: [null, Validators.required],
      categoryId: [null, [Validators.required]],
    });
  }

  fillFormData(template: ITemplate) {
    this.form.patchValue({
      titleAr: template.titleAr,
      titleEn: template.titleEn,
      textAr: template.textAr,
      textEn: template.textEn,
      categoryId: template.category,
    });
  }
  //#endregion

  //#region Fetch
  fetchSMSTemplateInfo(Id: string) {
    this.isGettingData = true;
    this._templateService
      .getSMSInfo(Id)
      .pipe(untilDestroyed(this))
      .subscribe((response: IResponse<any>) => {
        this.template = response.data;
        this.fillFormData(this.template);
        this.isGettingData = false;
      });
  }
  // #endregion

  //#region Actions
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }
    if (this.form.valid) {
      this.loading = true;
      if (this.editMode) {
        //Edit Mode
        this._templateService
          .editSMSTemplate(this.form.value, this.template.id)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (response: IResponse<any>) => {
              this.template = response.data;
              this.loading = false;
              this.closeDialog();
            },
            error: () => {
              this.loading = false;
            },
          });

      } else {
        //Add Mode
        this._templateService
          .createSMSTemplate(this.form.value)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (response: IResponse<any>) => {
            this.template = response.data;
            this.loading = false;
            this.closeDialog();
          },
            error: () => {
              this.loading = false;
            },
          });
      }
    }
  }

  closeDialog() {
    if (!this.loading) {
      this.loading = false;
      this._dialog.close({ template: this.template });
    }
  }
  //#end region
}
