import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { HomeGridComponent } from '../ag-grid/home-grid.component';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { IPaginationOptions } from 'src/app/core/models';
import { UntilDestroy } from '@ngneat/until-destroy';
import { StorageService } from 'src/app/core/services/storage.service';
@UntilDestroy()
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent extends HomeGridComponent implements OnInit {
  gridApi!: GridApi;
  public paginationOptions: IPaginationOptions = { pageNumber: 2, pageSize: 10, totalCount: 10 };
  contracts = [
    { name: 'number_recruitment', count: 0 },
    { name: 'rent_contract_number', count: 10 },
    { name: 'waiver_contract_number', count: 200 },
    { name: 'transform_contract_number', count: 46 },
  ];
  user!: {
    role: string;
    userName: string;
  };
  constructor(@Inject(INJECTOR) injector: Injector, private _storageService: StorageService) {
    super(injector);
  }

  ngOnInit(): void {
    this.user = this._storageService.getLocalObject('user');
  }

  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
    this.getUserInfoList();
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getUserInfoList();
  }
  getUserInfoList() {
    this.rowData = [
      { id: '1', taskId: 'Test1', taskType: 'Test1', description: 'Test1', status: 'Test1' },
      { id: '2', taskId: 'Test2', taskType: 'Test2', description: 'Test2', status: 'Test2' },
      { id: '3', taskId: 'Test3', taskType: 'Test3', description: 'Test3', status: 'Test3' },
      { id: '4', taskId: 'Test4', taskType: 'Test4', description: 'Test4', status: 'Test4' },
      { id: '5', taskId: 'Test5', taskType: 'Test5', description: 'Test5', status: 'Test5' },
      { id: '6', taskId: 'Test6', taskType: 'Test6', description: 'Test6', status: 'Test6' },
      { id: '7', taskId: 'Test7', taskType: 'Test7', description: 'Test7', status: 'Test7' },
      { id: '8', taskId: 'Test8', taskType: 'Test8', description: 'Test8', status: 'Test8' },
      { id: '9', taskId: 'Test9', taskType: 'Test9', description: 'Test9', status: 'Test9' },
      { id: '10', taskId: 'Test10', taskType: 'Test10', description: 'Test10', status: 'Test10' },
    ];
  }
}
