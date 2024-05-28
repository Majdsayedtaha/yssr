import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { ProjectService } from '../../services/project.service';
import { IProjectStatistics } from '../../models/project.interface';
import { TextValidator } from 'src/app/core/validators/text.validator';
@UntilDestroy()
@Component({
  selector: 'app-dialog-add-project-component',
  templateUrl: './dialog-add-project-component.component.html',
  styleUrls: ['./dialog-add-project-component.component.scss'],
})
export class DialogAddProjectComponentComponent extends CoreBaseComponent {
  public form!: FormGroup;
  isLoading !:boolean;
  constructor(
    @Inject(INJECTOR) injector: Injector,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private _dialog: MatDialogRef<DialogAddProjectComponentComponent>,
    private _fb: FormBuilder,
    private _projectService: ProjectService
  ) {
    super(injector);
  }

  //#region Life Cycle
  ngOnInit(): void {
    this.initialForm();
    if (this.editData.update) this.fillProjectData();
  }

  //#end region

  //#region Form
  initialForm() {
    this.form = this._fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      nameEn: [null, [Validators.required, TextValidator.english]],
      nameAr: [null, [Validators.required, TextValidator.arabic]],
    });
  }
  //#end region
  fillProjectData() {
    this.isLoading = true;
    this._projectService
      .getProjectDetails(this.editData.data.id)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.form.patchValue({
          startDate: res.data.startDate,
          endDate: res.data.endDate,
          nameEn: res.data.nameEn,
          nameAr: res.data.nameAr,
        });
        this.isLoading = false;
      });
  }
  submit() {
    if (this.editData.update === false) {
      this._projectService
        .addProject(this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe(res => {
          this.closeDialog(res.data);
        });
    } else if (this.editData.update === true) {
      this._projectService
        .updateProject(this.editData.data.id, this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe(res => {
          this.closeDialog(res.data);
          console.log(res);
          this._projectService.updateStatistics.next(<IProjectStatistics>res?.data);
        });
    }
  }

  closeDialog(data: any) {
    this._dialog.close(data);
  }
  //#end region
}
