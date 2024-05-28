import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExternalOfficesUserService } from '../../services/external-office-user.service';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { catchError, of, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { OfficeUsersGridComponent } from './agGrid/office.grid.component';
import { IPaginationOptions } from 'src/app/core/models';
@UntilDestroy()
@Component({
  selector: 'app-users-external-offices',
  templateUrl: './users-external-offices.component.html',
  styleUrls: ['./users-external-offices.component.scss'],
})
export class UsersExternalOfficesComponent extends OfficeUsersGridComponent implements OnInit {
  externalOfficeUsersForm!: FormGroup;
  isLoading: Boolean = false;
  paginationOptions: IPaginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };
  gridApi!: GridApi;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fb: FormBuilder,
    private _externalOfficesUserService: ExternalOfficesUserService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.externalOfficeUsersForm = this._fb.group({
      nameAr: [null, [TextValidator.arabic, Validators.required]],
      nameEn: [null, [TextValidator.english, Validators.required]],
      externalOfficeId: [null, Validators.required],
      mobileFirst: [null, Validators.required],
      mobileSecond: [null],
      emailFirst: [null, Validators.required],
      emailSecond: [null],
      isRepresentative: [false],
    });

    this.gridOptions = { ...this.gridOptions, context: { parentComp: this } };

    this.externalOfficeUsersForm
      .get('externalOfficeId')
      ?.valueChanges.pipe(untilDestroyed(this))
      .subscribe(id => {
        if (id) this.getExternalOffices();
      });
  }

  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getExternalOffices();
  }

  getExternalOffices() {
    this._externalOfficesUserService
      .getExternalOfficeUsers(
        { ...this.paginationOptions, ...this.filterObj },
        this.externalOfficeUsersForm.get('externalOfficeId')?.value
      )
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        this.rowData = res.data.list;
        this.paginationOptions = res.data.pagination;
        this.gridOptions?.api?.setRowData(this.rowData);
      });
  }

  getDeepWithFilter(event: any) {
    this.paginationOptions.pageNumber = 0;
    this.subject.next(event);
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._externalOfficesUserService
      .getExternalOfficeUsers(
        { ...this.paginationOptions, ...this.filterObj },
        this.externalOfficeUsersForm.get('externalOfficeId')?.value
      )
      .pipe(
        untilDestroyed(this),
        tap((res: any) => {
          this.paginationOptions = res.data.pagination;
          this.rowData = res.data.list;
          this.gridOptions?.api?.setRowData(this.rowData);
        }),
        catchError(res => {
          return of([]);
        })
      );
  }

  addExternalOfficeUser() {
    this.isLoading = true;
    this._externalOfficesUserService.addExternalOfficeUser(this.externalOfficeUsersForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.externalOfficeUsersForm.reset({ isRepresentative: false });
        this.rowData = [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
