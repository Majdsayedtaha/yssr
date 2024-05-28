import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { FileTypeEnum, IFileAcceptance } from '../../models';
import { FileService } from '../../services/file.service';
import { finalize } from 'rxjs';


@UntilDestroy()
@Component({
  selector: 'app-file-acceptance',
  templateUrl: './file-acceptance.component.html',
  styleUrls: ['./file-acceptance.component.scss']
})
export class FileAcceptanceComponent extends CoreBaseComponent implements OnInit {

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
      type: [FileTypeEnum.ACCEPTANCE_OF_NEW_RULES_FOR_HSW, Validators.required],
      DateValue: [null, Validators.required],
      ObjectiveTitle: [null, Validators.required],
      SubjectValue: [null, Validators.required],
      SenderName: [null, Validators.required],
      WriterName: [null, Validators.required],
      WriterRole: [null, Validators.required],
      MinimumYearExperience: [null, [Validators.required, Validators.min(1)]],
      MinimumSalary: [null, [Validators.required, Validators.min(1)]],
      CompanyName: [null, Validators.required],
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
        .subscribe((file) => this.downloadFile(file, 'acceptance.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        );
    }
  }
  //#endregion

}
