import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { FileTypeEnum, IFileAcceptance } from '../../models';
import { FileService } from '../../services/file.service';
import { finalize } from 'rxjs';


@UntilDestroy()
@Component({
  selector: 'app-file-info.component',
  templateUrl: './file-info.component.html',
  styleUrls: ['./file-info.component.scss']
})
export class FileInfoSheetComponent extends CoreBaseComponent implements OnInit {

  //#region Variables
  public form!: FormGroup;
  public loading: boolean = false;
  //#endregion

  //#region Accessors
  get f() {
    return this.form.controls;
  }
  //#endregion

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fb: FormBuilder,
    private _fileService: FileService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initialForm();
  }

  //#region Form
  initialForm() {
    this.form = this._fb.group({
      type: [FileTypeEnum.INFO_SHEET, Validators.required],
      ForeignAgencyName: [null, Validators.required],
      ExecutiveManagerName: [null, Validators.required],
      OfficeAddress: [null, Validators.required],
      OfficeMobileNo: [null, Validators.required],
      FaxNo: [null, Validators.required],
      LicenseNo: [null, Validators.required],
      LicenseDateIssuedStartDateGeorgian: [null, Validators.required],
      LicenseDateIssuedStartDateHijri: [null, Validators.required],
      LicenseDateIssuedEndDateGeorgian: [null, Validators.required],
      LicenseDateIssuedEndDateHijri: [null, Validators.required],
      CRNo: [null, Validators.required],
      CRDateIssuedStartDateGeorgian: [null, Validators.required],
      CRDateIssuedStartDateHijri: [null, Validators.required],
      CRDateIssuedEndDateGeorgian: [null, Validators.required],
      CRDateIssuedEndDateHijri: [null, Validators.required],
      PHILIPPINESAgencyName: [null, Validators.required],
      PHILIPPINESAgencyManagerName: [null, Validators.required],
      PHILIPPINESAgencyAddress: [null, Validators.required],
    });

  }
  //#endregion

  //  #region Actions
  submit() {
    if (this.form.valid) {
      this.loading = true;
      let formDto: IFileAcceptance = this.form.value;

      //Add
      this._fileService
        .exportFile(formDto)
        .pipe(
          untilDestroyed(this),
          finalize(() => (this.loading = false))
        )
        .subscribe((file) => this.downloadFile(file, 'info sheet.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        );
    }
  }
  //#endregion

}
