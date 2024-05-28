import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { HousingService } from '../../../services/housing.service';
import { IHouseWorkerFormData } from '../../../models';
import { IEnum } from 'src/app/core/interfaces';
import { DialogService } from 'src/app/core/services/dialog.service';

@UntilDestroy()
@Component({
  selector: 'dialog-housing-worker-form',
  templateUrl: './dialog-housing-worker-form.component.html',
  styleUrls: ['./dialog-housing-worker-form.component.scss'],
})
export class DialogHousingWorkerFormComponent extends CoreBaseComponent {

  //#region Variables
  public form!: FormGroup;
  public loading: boolean = false;
  //#end region

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _housingService: HousingService,
    private _dialog: DialogService,
    private _fb: FormBuilder
  ) {
    super(injector);
  }

  //#region Life Cycle
  ngOnInit(): void {
    this.initialForm();
  }
  //#end region

  //#region Form
  initialForm() {
    this.form = this._fb.group({
      workersIds: this._fb.array([]),
      apartmentId: [null, Validators.required],
      note: [null, Validators.nullValidator],
    });
  }
  //#end region

  //#region Actions
  confirm() {
    if (this.form.valid) {
      this.loading = true;
      const formDto = <IHouseWorkerFormData>this.form.value;
      formDto.workersIds = formDto.workersIds.map(workerId => (workerId as IEnum).id) as string[];
      this._housingService
        .addWorkerToHouse(formDto)
        .pipe(
          untilDestroyed(this)
        ).subscribe(() => {
          this.loading = false
          this.closeDialog();
        });
    }
  }

  closeDialog() {
    if (!this.loading) {
      this.form.reset();
      this.loading = false;
      this._dialog.closeAll()
    }
  }
  //#end region
}
