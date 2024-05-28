import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { SkillActionCell } from './ag-grid/custom-cell/skill-action.cell';
import { IName } from '../../models';
import { SkillService } from '../../services/skill.service';
import { catchError, debounceTime, of, switchMap, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IRoleEnum } from 'src/app/core/constants';

@UntilDestroy()
@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent extends CoreBaseComponent implements OnInit {
  public gridApi!: GridApi;
  public skillData!: IName;
  public skillForm!: FormGroup;
  public role = IRoleEnum.Skill;
  public skillDataList!: IName[];
  public update: boolean = false;
  public columnDefs: ColDef[] = [];
  public isLoading: boolean = false;
  public paginationOptions = { pageNumber: 0, pageSize: 10, totalCount: 0 };

  constructor(@Inject(INJECTOR) injector: Injector, private _fb: FormBuilder, private _skillService: SkillService) {
    super(injector);
    this.gridOptions = {
      ...this.gridOptions,
      context: { parentComp: this },
    };
  }

  ngOnInit(): void {
    this.skillForm = this._fb.group({
      id: [null],
      nameEn: [null, [TextValidator.english, Validators.required]],
      nameAr: [null, [TextValidator.arabic, Validators.required]],
    });
    this.initColDef();

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
      .subscribe((res: any) => { });
  }

  initColDef() {
    this.columnDefs = [
      {
        headerName: 'setting.fields.skill_en',
        field: 'nameEn',
        flex: 1,
        filter: this.filterStrategy.matcher(this.filterTypes.text)?.getFilterRenderer(),
      },
      {
        headerName: 'setting.fields.skill_ar',
        field: 'nameAr',
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
        cellRenderer: SkillActionCell,
        cellRendererParams: {
          formGroup: this.skillForm,
        },
      },
    ];
  }

  onGridReady(params: GridReadyEvent<IName>) {
    this.gridApi = params.api;
    this.getSkills();
  }

  getSkills() {
    this._skillService.getSkills({ ...this.paginationOptions, ...this.filterObj }).subscribe(res => {
      this.skillDataList = res.data.list;
      this.paginationOptions = res.data.pagination;
    });
  }

  onSetPage(pageNumber: number) {
    this.paginationOptions = { ...this.paginationOptions, pageNumber: pageNumber };
    this.getSkills();
  }

  skillRow(type: 'add' | 'update') {
    if (!this.skillForm.valid) return;
    this.isLoading = true;
    if (type === 'add') {
      this._skillService.addSkill(this.skillForm.value).subscribe({
        next: res => {
          this.isLoading = this.update = false;
          this.gridApi.applyTransaction({ add: [res.data] });
          this.skillForm.reset();
        },
        error: () => {
          this.isLoading = false;
        },
      });
    } else if (type === 'update') {
      this._skillService.updateSkill(this.skillForm.value['id'], this.skillForm.value).subscribe({
        next: res => {
          this.isLoading = this.update = false;
          this.gridApi.getRowNode(this.skillForm.value['id'])?.setData(res.data);
          this.gridApi.applyTransaction({ update: [res.data] });
          this.skillForm.reset();
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  getList(deepSearch?: any) {
    if (deepSearch) this.filterObj['query'] = deepSearch.target.value;
    return this._skillService.getSkills({ ...this.paginationOptions, ...this.filterObj }).pipe(
      tap(res => {
        this.paginationOptions = res.data.pagination;
        this.skillDataList = res.data.list;
        this.gridOptions?.api?.setRowData(this.skillDataList);
      }),
      catchError(res => {
        return of([]);
      })
    );
  }
}
