import { Component, INJECTOR, Inject, Injector, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IDetail, IEnum } from 'src/app/core/interfaces';
import { IResponse } from 'src/app/core/models';

@UntilDestroy()
@Component({
  selector: 'extra-details-step',
  templateUrl: './extra-details-step.component.html',
  styleUrls: ['./extra-details-step.component.scss']
})
export class ExtraDetailsStepComponent extends CoreBaseComponent implements OnInit {

  //#region Variables
  //Decorators
  @Input() form!: FormGroup;
  //Public
  public skillList: IEnum[] = [];
  public detailList: IEnum[] = [];
  //#endregion

  constructor(@Inject(INJECTOR) injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.fetchSkills().pipe(untilDestroyed(this)).subscribe((response: IResponse<IEnum[]>) => this.skillList = response.data);
    this.fetchDetails().pipe(untilDestroyed(this)).subscribe((response: IResponse<IDetail[]>) => this.detailList = response.data.map((el) => <IEnum>{ name: el.value, id: el.id }));
  }

}
