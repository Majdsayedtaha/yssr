import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { WorkerService } from '../../services/worker.service';
import { IWorkerFormData } from '../../models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs';
import { IEnum } from 'src/app/core/interfaces';

@UntilDestroy()
@Component({
  selector: 'side-info-worker',
  templateUrl: './side-info-worker.component.html',
  styleUrls: ['./side-info-worker.component.scss'],
})
export class SideInfoWorkerComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;

  workerData!: IWorkerFormData;
  allDetails: IEnum[] = [];
  allSkills: IEnum[] = [];
  isLoading = false;

  constructor(@Inject(INJECTOR) injector: Injector, private _workerService: WorkerService) {
    super(injector);
  }

  ngOnInit(): void {
    this.checkIfNeedToOpen();
    this.fetchData();
  }

  fetchData() {
    this.fetchDetails()
      .pipe(untilDestroyed(this))
      .subscribe(response => (this.allDetails = response.data.map(el => <IEnum>{ id: el.id, name: el.value })));
    this.fetchSkills()
      .pipe(untilDestroyed(this))
      .subscribe(response => (this.allSkills = response.data));
  }

  checkIfNeedToOpen() {
    this._workerService.getWorkerIdSubject().subscribe(workerId => {
      if (workerId) {
        this.isLoading = true;
        this.sidenav.open();
        this._workerService
          .infoWorker(workerId)
          .pipe(
            untilDestroyed(this),
            finalize(() => (this.isLoading = false))
          )
          .subscribe(response => (this.workerData = response.data as IWorkerFormData));
      }
    });
  }

  findArrayName(array: IEnum[], Id: string): string | undefined {
    return array.find(el => el.id === Id)?.name;
  }

  closeSideNav() {
    this.sidenav.close();
    this._workerService.setWorkerIdSubject(null);
  }


  // Life Cycle Hooks
  override ngOnDestroy(): void {
    this.closeSideNav();
    super.ngOnDestroy();
  }
}
