import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { FileTypeEnum, IFileAcceptance } from '../../models';
import { FileService } from '../../services/file.service';
import { finalize } from 'rxjs';


@UntilDestroy()
@Component({
  selector: 'app-file-affidavit',
  templateUrl: './file-affidavit.component.html',
  styleUrls: ['./file-affidavit.component.scss']
})
export class FileAffidavitComponent extends CoreBaseComponent implements OnInit {

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
      type: [FileTypeEnum.POEA_FORMAT_AFFIDAVIT_OF_UNDERTAKING, Validators.required],
      SenderName: [null, Validators.required],
      CompanyName: [null, Validators.required],
      CompanyBusinessAddress: [null, Validators.required],
      POBox: [null, Validators.required],
      PostalCode: [null, Validators.required],
      TelValue: [null, Validators.required],
      AgencyName: [null, Validators.required],
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
        .subscribe((file) => this.downloadFile(file, 'affidavit.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        );
    }
  }
  //#endregion

}
