import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { TaskService } from '../../services/task.service';
import { ITaskStatistics } from '../../models/task.interface';
@UntilDestroy()
@Component({
  selector: 'app-dialog-add-task',
  templateUrl: './dialog-add-task.component.html',
  styleUrls: ['./dialog-add-task.component.scss'],
})
export class DialogAddTaskComponent extends CoreBaseComponent {
  public form!: FormGroup;
  isLoading = false;
  constructor(
    @Inject(INJECTOR) injector: Injector,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private _dialog: MatDialogRef<DialogAddTaskComponent>,
    private _fb: FormBuilder,
    private _taskService: TaskService
  ) {
    super(injector);
  }

  //#region Life Cycle
  ngOnInit(): void {
    this.initialForm();
    if (this.editData.update) this.fillTaskData();
  }
  //#end region

  //#region Form
  initialForm() {
    this.form = this._fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      priorityId: [null, Validators.required],
      userId: [null, Validators.required],
      statusId: [null, Validators.required],
      projectId: [null, Validators.required],
    });
  }
  //#end region
  fillTaskData() {
    this.isLoading = true;
    this._taskService
      .getTaskDetails(this.editData.data.id)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.form.patchValue({
          startDate: res.data.startDate,
          endDate: res.data.endDate,
          priorityId: res.data.priority,
          userId: res.data.user,
          statusId: res.data.status,
          projectId: res.data.project,
        });
        this.isLoading = false;
      });
  }
  submit() {
    if (this.editData.update === false) {
      this._taskService
        .addTask(this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe(res => {
          this.closeDialog(res.data);
        });
    } else if (this.editData.update === true) {
      const formUpdated = {
        ...this.form.value,
        priorityId: this.form.value.priorityId?.id ? this.form.value.priorityId.id : this.form.value.priorityId,
        userId: this.form.value.userId?.id ? this.form.value.userId.id : this.form.value.userId,
        statusId: this.form.value.statusId?.id ? this.form.value.statusId.id : this.form.value.statusId,
        projectId: this.form.value.projectId?.id ? this.form.value.projectId.id : this.form.value.projectId,
      };
      this._taskService
        .updateTask(this.editData.data.id, formUpdated)
        .pipe(untilDestroyed(this))
        .subscribe(res => {
          this.closeDialog(res.data);
          this._taskService.updateStatistics.next(<ITaskStatistics>res?.data);
        });
    }
  }

  closeDialog(data: any) {
    this._dialog.close(data);
  }
  //#end region
}
