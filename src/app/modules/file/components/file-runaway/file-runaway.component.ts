import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { FileTypeEnum, IFileAcceptance } from '../../models';
import { FileService } from '../../services/file.service';
import { finalize } from 'rxjs';


@UntilDestroy()
@Component({
  selector: 'app-file-runaway',
  templateUrl: './file-runaway.component.html',
  styleUrls: ['./file-runaway.component.scss']
})
export class FileRunawayComponent extends CoreBaseComponent implements OnInit {

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
      type: [FileTypeEnum.RUNAWAY_LETTER, Validators.required],
      OfficeName: [null, Validators.required],
      WorkerName: [null, Validators.required],
      PassportNo: [null, Validators.required],
      EmployerName: [null, Validators.required],
      DateValue: [null, Validators.required],
      ReceiverName: [null, Validators.required],
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
        .subscribe((file) => this.downloadFile(file, 'runaway letter.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        );
    }
  }
  //#endregion

}
