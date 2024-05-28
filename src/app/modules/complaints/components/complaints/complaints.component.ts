import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { DialogComplaintsComponent } from '../../dialog/dialog-complaints/dialog-complaints.component';
import { DialogService } from 'src/app/core/services/dialog.service';
import { IPaginationOptions } from 'src/app/core/models';
import { ComplaintsGridComponent } from '../../ag-grid/complaints.grid';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, debounceTime, of, switchMap, tap } from 'rxjs';
import { IComplaint } from '../../models/complaints.interface';
import { ComplaintsService } from '../../services/complaints.service';
import { IEnum } from 'src/app/core/interfaces';
@UntilDestroy()
@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss'],
})
export class ComplaintsComponent extends ComplaintsGridComponent implements OnInit {
  public paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  gridApi!: GridApi;
  updateStatusArr: IEnum[] = [];

  constructor(
    @Inject(INJECTOR) injector: Injector,
    public matDialog: DialogService,
    private _complaintsService: ComplaintsService
  ) {
    super(injector);
    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };
  }

  ngOnInit(): void {
    this.getCompliantStatuses();

    this.subjectSub = this.subject
      ?.pipe(
        untilDestroyed(this),
        debounceTime(500),
        switchMap(res => {
          return this.getList(res)?.pipe(
            catchError(res => {
              return of([]);
            })
          );
        }),
        catchError(res => {
          return of([]);
        })
      )
      .subscribe((res: any) => {});
  }

  onGridReady(params: GridReadyEvent<IComplaint>) {
    this.gridApi = params.api;
    this.getComplaintsList();
  }

  getCompliantStatuses() {
    this.fetchComplaintsStatus()
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.updateStatusArr = res.data;
      });
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getComplaintsList();
  }

  getComplaintsList() {
    this._complaintsService
      .getComplaintsList(this.paginationOptions)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.rowData = res.data.list;
        this.paginationOptions = res.data.pagination;
      });
  }
  addStore() {
    const dialogRef = this.matDialog.openDialog(DialogComplaintsComponent, {
      data: { update: false },
      disableClose: false,
    });
    dialogRef.subscribe({
      next: res => {
        if (res) {
          this.gridApi.applyTransaction({ add: [res] });
          this.matDialog.closeAll();
        }
      },
    });
  }
  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }
  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._complaintsService.getComplaintsList({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.paginationOptions = res.data.pagination;
        this.rowData = res.data.list;
        this.gridOptions?.api?.setRowData(this.rowData);
      }),
      catchError(() => of([]))
    );
  }
}
