import { finalize, mergeMap, of, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { IContractStatistics, ILinkResume } from '../../models';
import { AppRoutes } from 'src/app/core/constants';
import { MatSidenav } from '@angular/material/sidenav';
import { ContractService } from '../../services/contract.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LinkResumeService } from '../../services/link-resume.service';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { IToastData, ToastComponent } from 'src/app/core/components/toast/toast.component';
import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NotifierService } from 'src/app/core/services/notifier.service';
import { DialogService } from 'src/app/core/services/dialog.service';
import { FullUrlPipe } from 'src/app/core/pipes/full-url.pipe';
@UntilDestroy()
@Component({
  selector: 'side-link-resume',
  templateUrl: './side-link-resume.component.html',
  styleUrls: ['./side-link-resume.component.scss'],
  providers: [FullUrlPipe],
})
export class SideLinkResumeComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) protected sidenav!: MatSidenav;
  page: number = 0;
  page2: number = 0;
  paginateLoader = false;
  paginateLoader2 = false;
  contractLinkResumes: ILinkResume[] = [];
  contractSuggestedResumes: ILinkResume[] = [];
  contractId!: string;
  isLoading: boolean = false;
  list1Done: boolean = false;
  list2Done: boolean = false;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    public linkResumeService: LinkResumeService,
    private _contractService: ContractService,
    private _router: Router,
    private _snackBar: NotifierService,
    private _toast: DialogService,
    private _linkResumeService: LinkResumeService,
    private _fullURlPipe: FullUrlPipe
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
    this.linkResumeService.sideLinkResume.pipe(untilDestroyed(this)).subscribe(id => {
      if (id) {
        this.contractId = id;
        this.sidenav.open();
        this.fetchAllWorkers(0);
      }
    });
  }

  fetchAllWorkers(page: number) {
    this.isLoading = true;
    return this.linkResumeService
      .getWorkersRecruitmentContract(this.contractId, page)
      .pipe(
        untilDestroyed(this),
        mergeMap(res => {
          this.contractSuggestedResumes = res.data;
          return this.linkResumeService.getSuggestedWorkersForRecruitmentContract(this.contractId, page);
        })
      )
      .subscribe((res: any) => {
        this.isLoading = false;
        this.contractLinkResumes = res.data;
        // if (this.contractSuggestedResumes.length === 0 && this.contractLinkResumes.length === 0)
        //   this._snackBar.showNormalSnack(this.translateService.instant('no-worker-to-link'));
      });
  }

  getWorkersRecruitmentContract(page: number) {
    this.paginateLoader = true;
    return this.linkResumeService
      .getWorkersRecruitmentContract(this.contractId, page)
      .pipe(
        untilDestroyed(this),
        finalize(() => (this.paginateLoader = false))
      )
      .subscribe((res: any) => {
        if (res.data.length === 0) {
          this.paginateLoader = false;
          this.list1Done = true;
        } else this.contractLinkResumes = this.contractLinkResumes.concat(res.data);
      });
  }

  getSuggestedWorkersForRecruitmentContract(page: number) {
    this.paginateLoader2 = true;
    this.linkResumeService
      .getSuggestedWorkersForRecruitmentContract(this.contractId, page)
      .pipe(
        untilDestroyed(this),
        finalize(() => (this.paginateLoader2 = false))
      )
      .subscribe((res: any) => {
        if (res.data.length === 0) {
          this.paginateLoader2 = false;
          this.list2Done = true;
        } else this.contractSuggestedResumes = this.contractSuggestedResumes.concat(res.data);
      });
  }

  editWorker(workerId: string) {
    this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.worker}/update/${workerId}`);
  }

  linkToContract(workerId: string, type: 'suggested' | 'exact') {
    if (type === 'exact') {
      const idx = this.contractLinkResumes.findIndex(el => el.id === workerId);
      this.contractLinkResumes[idx].loading = true;
      const linkContract = { workerId: workerId, contractId: this.contractId };
      this._contractService.putLinkContract(linkContract).subscribe({
        next: res => {
          if (res) {
            this._linkResumeService.linkedSuccessfully.next(res.data);
            this.sidenav.close();
            this.linkResumeService.sideLinkResume.next('');
            this.contractLinkResumes[idx].loading = true;
            this._contractService.updateStatistics.next(<IContractStatistics>res?.data.statistics);
            this._contractService.rowUpdater.next(res?.data.details);
          }
        },
        error: () => {
          this.contractLinkResumes[idx].loading = true;
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
            const idx = this.contractSuggestedResumes.findIndex(el => el.id === workerId);
            this.contractSuggestedResumes[idx].loading = true;
            const linkContract = { workerId: workerId, contractId: this.contractId };
            this._contractService.putLinkContract(linkContract).subscribe({
              next: res => {
                if (res) {
                  this._linkResumeService.linkedSuccessfully.next(res.data);
                  this.sidenav.close();
                  this.linkResumeService.sideLinkResume.next('');
                  this.contractSuggestedResumes[idx].loading = true;
                  this._contractService.updateStatistics.next(<IContractStatistics>res?.data.statistics);
                  this._contractService.rowUpdater.next(res?.data.details);
                }
              },
              error: () => {
                this.contractSuggestedResumes[idx].loading = true;
              },
            });
          }
        });
    }
  }

  downloadLink(url: string, fileName: string) {
    url = this._fullURlPipe.transform(url);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = `${this.translateService.instant(fileName)}.${url.substring(-3)}`;
    document.body.appendChild(link);
    link.click();
  }

  previewFileUrl(url: string) {
    const extension = url.slice(-3);
    const imageMimeData = ['jpg', 'jpeg', 'png', 'gif'];
    return imageMimeData.includes(extension) ? this._fullURlPipe.transform(url) : 'assets/svg/doc.svg';
  }

  // Life Cycle Hooks
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.linkResumeService.sideLinkResume.next('');
  }

  onExactWorkersScroll(e: number) {
    if (e > 95 && !this.paginateLoader && !this.list1Done) this.getWorkersRecruitmentContract(++this.page);
  }

  onSuggestedWorkersScroll(e: number) {
    if (e > 95 && !this.paginateLoader2 && !this.list2Done)
      this.getSuggestedWorkersForRecruitmentContract(++this.page2);
  }
}
