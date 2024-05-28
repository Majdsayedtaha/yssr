import { finalize, mergeMap, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/core/constants';
import { MatSidenav } from '@angular/material/sidenav';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IToastData, ToastComponent } from 'src/app/core/components/toast/toast.component';
import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LinkResumeWaiverService } from '../../services/link-resume-waiver.service';
import { ILinkResumeWaiver } from '../../models';
import { WaiverSpecificationService } from 'src/app/modules/waiver-specifications/services/waiver-specifications.service';
import { NotifierService } from 'src/app/core/services/notifier.service';
import { DialogService } from 'src/app/core/services/dialog.service';
@UntilDestroy()
@Component({
  selector: 'side-link-resume-waiver',
  templateUrl: './side-link-resume-waiver.component.html',
  styleUrls: ['./side-link-resume-waiver.component.scss'],
})
export class SideLinkResumeWaiverComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;
  requestLinkResumes!: ILinkResumeWaiver[];
  requestSuggestedResumes!: ILinkResumeWaiver[];
  requestId!: string;
  isLoading: boolean = false;
  page: number = 0;
  page2: number = 0;
  paginateLoader = false;
  paginateLoader2 = false;
  list1Done = false;
  list2Done = false;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    public linkResumeWaiverService: LinkResumeWaiverService,
    private _waiverSpecificationService: WaiverSpecificationService,
    private _router: Router,
    private _snackBar: NotifierService,
    private _toast: DialogService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.checkIfNeedToOpen();
  }
  getChipStyles(condition: boolean): any {
    return {
      'background-color': condition ? 'green' : 'red',
      color: condition ? 'white' : 'black',
    };
  }
  checkIfNeedToOpen() {
    this.linkResumeWaiverService.sideLinkResume.pipe(untilDestroyed(this)).subscribe(id => {
      if (id) {
        this.requestId = id;
        this.sidenav.open();
        this.fetchAllWorkers(0);
      }
    });
  }

  fetchAllWorkers(page: number) {
    this.isLoading = true;
    return this.linkResumeWaiverService
      .getWorkersForExternalWaiver(this.requestId, page)
      .pipe(
        untilDestroyed(this),
        mergeMap(res => {
          this.requestLinkResumes = res.data;
          return this.linkResumeWaiverService.getSuggestedWorkersForExternalWaiver(this.requestId, page);
        })
      )
      .subscribe(res => {
        this.isLoading = false;
        this.requestSuggestedResumes = res.data;
        // if (this.requestLinkResumes.length === 0 && this.requestSuggestedResumes.length === 0)
        //   this._snackBar.showNormalSnack(this.translateService.instant('no-worker-to-link'));
      });
  }

  getWorkersRecruitmentContract(page: number) {
    this.paginateLoader = true;
    this.linkResumeWaiverService
      .getWorkersForExternalWaiver(this.requestId, page)
      .pipe(
        untilDestroyed(this),
        finalize(() => (this.paginateLoader = false))
      )
      .subscribe((res: any) => {
        if (res.data.length === 0) {
          this.paginateLoader = false;
          this.list1Done = true;
        } else this.requestLinkResumes = this.requestLinkResumes.concat(res.data);
      });
  }

  getSuggestedWorkersForExternalWaiver(page: number) {
    this.paginateLoader = true;
    this.linkResumeWaiverService
      .getSuggestedWorkersForExternalWaiver(this.requestId, page)
      .pipe(
        untilDestroyed(this),
        finalize(() => (this.paginateLoader = false))
      )
      .subscribe((res: any) => {
        if (res.data.length === 0) {
          this.paginateLoader = false;
          this.list2Done = true;
        } else this.requestSuggestedResumes = this.requestSuggestedResumes.concat(res.data);
      });
  }

  editWorker(workerId: string) {
    this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.worker}/update/${workerId}`);
  }

  linkToContract(workerId: string, type: 'suggested' | 'exact') {
    if (type === 'exact') {
      const idx = this.requestLinkResumes.findIndex(el => el.id === workerId);
      this.requestLinkResumes[idx].loading = true;
      const linkContract = { workerId: workerId, id: this.requestId };
      this._waiverSpecificationService.putLinkRequest(linkContract).subscribe({
        next: res => {
          if (res) {
            this.linkResumeWaiverService.linkedSuccessfully.next(res.data);
            this.sidenav.close();
            this.linkResumeWaiverService.sideLinkResume.next('');
            this.requestLinkResumes[idx].loading = true;
            // this._waiverService.updateStatistics.next(<IWaiverStatistics>res?.data.statistics);
            // this._waiverService.rowUpdater.next(res?.data.details);
          }
        },
        error: () => {
          this.requestLinkResumes[idx].loading = true;
        },
      });
    } else if (type === 'suggested') {
      const toastData: IToastData = {
        messageContent: 'you_want_to_link_worker',
        firstButtonContent: 'cancel',
        secondButtonContent: 'yes_surely',
        svgIcon: 'laptop-toast',
        centralize: true,
      };
      this._toast
        .openDialog(ToastComponent, {
          data: toastData,
          width: '500px',
        })
        .pipe(
          untilDestroyed(this),
          switchMap(res => (res ? of([]) : of(null)))
        )
        .subscribe(res => {
          if (res) {
            const idx = this.requestSuggestedResumes.findIndex(el => el.id === workerId);
            this.requestSuggestedResumes[idx].loading = true;
            const linkContract = { workerId: workerId, id: this.requestId };
            this._waiverSpecificationService.putLinkRequest(linkContract).subscribe({
              next: res => {
                if (res) {
                  this.linkResumeWaiverService.linkedSuccessfully.next(res.data);
                  this.sidenav.close();
                  this.linkResumeWaiverService.sideLinkResume.next('');
                  this.requestSuggestedResumes[idx].loading = true;
                  // this._waiverService.updateStatistics.next(<IWaiverStatistics>res?.data.statistics);
                  // this._waiverService.rowUpdater.next(res?.data.details);
                }
              },
              error: () => {
                this.requestSuggestedResumes[idx].loading = true;
              },
            });
          }
        });
    }
  }

  onExactWorkersScroll(e: number) {
    if (e > 95 && !this.paginateLoader && !this.list1Done) this.getWorkersRecruitmentContract(++this.page);
  }

  onSuggestedWorkersScroll(e: number) {
    if (e > 95 && !this.paginateLoader2 && !this.list2Done) this.getSuggestedWorkersForExternalWaiver(++this.page2);
  }

  // Life Cycle Hooks
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.linkResumeWaiverService.sideLinkResume.next('');
  }
}
