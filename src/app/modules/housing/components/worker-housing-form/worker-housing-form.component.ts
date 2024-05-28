import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from 'src/app/core/constants';
import { IEnum } from 'src/app/core/interfaces';
import { IResponse } from 'src/app/core/models';
import { HousingService } from '../../services/housing.service';
import { IHouseWorkerFormData, IHousing, IHousingFormData } from '../../models';

@UntilDestroy()
@Component({
  selector: 'app-worker-housing-form',
  templateUrl: './worker-housing-form.component.html',
  styleUrls: ['./worker-housing-form.component.scss'],
})
export class WorkerHousingFormComponent extends CoreBaseComponent implements OnInit {
  public form!: FormGroup;
  public loading: boolean = false;
  public isUpdated: boolean = false;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _housingService: HousingService,
    public location: Location,
    private _fb: FormBuilder,
    private _router: Router
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initialForm();
  }

  initialForm() {
    this.form = this._fb.group({
      apartmentId: [null, Validators.required],
      workersIds: this._fb.array([]),
      note: [null, Validators.nullValidator],
    });
  }

  submit() {
    if (this.form.valid) {
      this.loading = true;
      const formDto = <IHouseWorkerFormData>this.form.value;
      formDto.workersIds = formDto.workersIds.map(workerId => (workerId as IEnum).id) as string[];
      this._housingService
        .addWorkerToHouse(formDto)
        .pipe(
          untilDestroyed(this),
          finalize(() => (this.loading = false))
        )
        .subscribe(() => this._router.navigate([`${AppRoutes.layout}/${AppRoutes.housing}/table`]));
    }
  }
}
