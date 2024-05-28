import { IServiceMain } from '../../models';
import { ServicesService } from '../../services/services.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { MainServicesActionCell } from './ag-grid/custom-cell/main-services-action.cell';

@Component({
  selector: 'app-main-services',
  templateUrl: './main-services.component.html',
  styleUrls: ['./main-services.component.scss']
})
export class MainServicesComponent extends CoreBaseComponent implements OnInit {

  //Grid Options
  gridApi!: GridApi;
  listData: IServiceMain[] = [];
  columnDefs: ColDef[] = [];
  paginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  //Form
  form!: FormGroup;
  isLoading: boolean = false;
  update: boolean = false;

  constructor(
    private _fb: FormBuilder,
    @Inject(INJECTOR) injector: Injector,
    private _servicesService: ServicesService
  ) {
    super(injector);
    this.gridOptions = {
      ...this.gridOptions,
      context: { parentComp: this },
    };
  }

  ngOnInit(): void {
    this.initialForm();
    this.initColDef();
  }

  initialForm() {
    this.form = this._fb.group({
      id: [null],
      nameEn: [null, [TextValidator.english, Validators.required]],
      nameAr: [null, [TextValidator.arabic, Validators.required]],
    });
  }

  initColDef() {
    this.columnDefs = [
      {
        headerName: 'setting.fields.main_services_ar',
        field: 'nameAr',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.main_services_en',
        field: 'nameEn',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: '',
        field: 'actions',
        maxWidth: 90,
        pinned: 'left',
        filter: false,
        sortable: false,
        resizable: false,
        cellRenderer: MainServicesActionCell,
        cellRendererParams: {
          formGroup: this.form,
        },
      },
    ];
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getListData();
  }

  onGridReady(params: GridReadyEvent<IServiceMain>) {
    this.gridApi = params.api;
    this.getListData();
  }

  getListData() {
    // this._servicesService.getMainServices({ ...this.paginationOptions, ...this.filterObj }).subscribe(res => {
    //   this.listData = res.data.list;
    //   this.paginationOptions = res.data.pagination;
    // });
  }

  serviceRow(type: 'add' | 'update') {
    if (!this.form.valid) return;
    const formData = this.form.value;
    this.isLoading = true;
    if (type === 'add') {
      //Add Mode
      this.gridApi.applyTransaction({ add: [formData] });
      this.form.reset();
    } else {
      //Edit Mode
      this.gridApi.getRowNode(formData['id'])?.setData(formData);
      this.gridApi.applyTransaction({ update: [formData] });
    }
    this.isLoading = this.update = false;
    this.form.reset();
  }
}
