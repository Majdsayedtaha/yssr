import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DeviceService } from '../../../services/device.service';
@UntilDestroy()
@Component({
  selector: 'app-dialog-device',
  templateUrl: './dialog-device.component.html',
  styleUrls: ['./dialog-device.component.scss'],
})
export class DialogDeviceComponent extends CoreBaseComponent {
  public form!: FormGroup;
  constructor(
    @Inject(INJECTOR) injector: Injector,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private _dialog: MatDialogRef<DialogDeviceComponent>,
    private _fb: FormBuilder,
    private _deviceService: DeviceService
  ) {
    super(injector);
  }

  //#region Life Cycle
  ngOnInit(): void {
    this.initialForm();
    if (this.editData.update) {
      this.form.patchValue({
        nameEn: this.editData.data.nameEn,
        nameAr: this.editData.data.nameAr,
        bankId: this.editData.data.bankId,
      });
    }
  }
  //#end region

  //#region Form
  initialForm() {
    this.form = this._fb.group({
      nameEn: [null, [Validators.required, TextValidator.english]],
      nameAr: [null, [Validators.required, TextValidator.arabic]],
      bankId: [null, [Validators.required]],
    });
  }
  //#end region

  submit() {
    if (this.editData.update === false) {
      this._deviceService
        .addDevice(this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe(res => {
          this.closeDialog(res.data);
        });
    } else if (this.editData.update === true) {
      this._deviceService
        .updateDevice(this.editData.data.id, this.form.value)
        .pipe(untilDestroyed(this))
        .subscribe(res => {
          this.closeDialog(res.data);
        });
    }
  }

  closeDialog(data: any) {
    this._dialog.close(data);
  }
  //#end region
}
