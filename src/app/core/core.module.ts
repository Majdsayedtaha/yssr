//Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxNumToWordsModule } from 'ngx-num-to-words';

//Components
import { ToastComponent } from './components/toast/toast.component';
import { NotifierComponent } from './components/notifier/notifier.component';
import { NavBreadCrumbComponent } from './components/nav-breadcrumb/nav-breadcrumb.component';
import { MatCustomFieldComponent } from './components/mat-custom-field/mat-custom-field.component';
import { AgTemplateComponent } from './components/ag-custom-grid/ag-template/ag-template.component';
import { PermissionTableComponent } from './components/permission-table/permission-table.component';
import { FilterTemplate } from './components/ag-custom-grid/cell-renderers/filter-template.renderer';
import { ValidationFieldsComponent } from './components/validation-fields/validation-fields.component';
import { SearchableSelectComponent } from './components/searchable-select/searchable-select.component';
import { AgPaginationComponent } from './components/ag-custom-grid/ag-pagination/ag-pagination.component';
import { CheckboxCell } from './components/permission-table/custom/checkbox.cell/checkbox.cell.component';

//Directives
import { AuthorizationDirective } from './directives/authorization.directive';
import { FlipDirectionDirective } from './directives/flip-direction.directive';
import { InfiniteScrollDirective } from './directives/infinite-scroll.directive';

//Pipes
import { TimePipe } from './pipes/time.pipe';
import { FullUrlPipe } from './pipes/full-url.pipe';
import { HighlightPipe } from './pipes/highlight.pipe';
import { SanitizerUrlPipe } from './pipes/sanitizer-url.pipe';
import { TimezoneToDatePipe } from './pipes/timezone-normal.pipe';
import { HijriGregorianDatePipe } from './pipes/hijriGregorian-date.pipe';

// Renderers
import { PermissionService } from './services/permission.service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { LoaderDataComponent } from './components/loader-data/loader-data.component';
import { LookupSearchComponent } from './components/lookup-search/lookup-search.component';
import { FilterTextRenderer } from './components/ag-custom-grid/cell-renderers/filter-text.renderer';
import { HeaderRenderer } from './components/ag-custom-grid/header-renderers/column-header.renderer';
import { FilterRadioRenderer } from './components/ag-custom-grid/cell-renderers/filter-radio.renderer';
import { DateShowRenderer } from './components/ag-custom-grid/cell-renderers/filter-date-show.renderer';
import { FilterSelectRenderer } from './components/ag-custom-grid/cell-renderers/filter-select.renderer';
import { FilterRangeDateRenderer } from './components/ag-custom-grid/cell-renderers/filter-range-date.renderer';
import { FilterRangeNumberRenderer } from './components/ag-custom-grid/cell-renderers/filter-range-number.renderer';
import { SelectAllCheckboxCell } from './components/permission-table/custom/checkbox.cell/select-all-checkbox.component';

@NgModule({
  declarations: [
    // Components
    CheckboxCell,
    SelectAllCheckboxCell,
    ToastComponent,
    NotifierComponent,
    AgTemplateComponent,
    AgPaginationComponent,
    NavBreadCrumbComponent,
    MatCustomFieldComponent,
    PermissionTableComponent,
    ValidationFieldsComponent,
    SearchableSelectComponent,
    LookupSearchComponent,
    LoaderDataComponent,

    // Renderers,
    FilterTemplate,
    HeaderRenderer,
    DateShowRenderer,
    FilterTextRenderer,
    FilterRadioRenderer,
    FilterSelectRenderer,
    FilterRangeDateRenderer,
    FilterRangeNumberRenderer,

    //Directives
    AuthorizationDirective,
    FlipDirectionDirective,
    InfiniteScrollDirective,

    // Pipes
    TimePipe,
    TimezoneToDatePipe,
    HijriGregorianDatePipe,
    HighlightPipe,
    SanitizerUrlPipe,
    FullUrlPipe,
  ],
  imports: [
    CommonModule,
    AgGridModule,
    RouterModule,
    MaterialModule,
    TranslateModule,
    HttpClientModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgxMaskDirective,
    NgxMaskPipe,
    NgxNumToWordsModule,
  ],
  exports: [
    //Modules
    CommonModule,
    AgGridModule,
    RouterModule,
    MaterialModule,
    TranslateModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxNumToWordsModule,

    //Components
    ToastComponent,
    AgPaginationComponent,
    NavBreadCrumbComponent,
    MatCustomFieldComponent,
    PermissionTableComponent,
    ValidationFieldsComponent,
    SearchableSelectComponent,
    LookupSearchComponent,
    LoaderDataComponent,
    FilterTemplate,

    // Renderers,
    HeaderRenderer,
    DateShowRenderer,
    FilterTextRenderer,
    FilterSelectRenderer,
    FilterRangeDateRenderer,
    FilterRangeNumberRenderer,

    //Directives
    NgxMaskDirective,
    AuthorizationDirective,
    FlipDirectionDirective,
    InfiniteScrollDirective,

    // Pipes
    TimePipe,
    NgxMaskPipe,
    TimezoneToDatePipe,
    HijriGregorianDatePipe,
    HighlightPipe,
    SanitizerUrlPipe,
    FullUrlPipe,
  ],
  providers: [PermissionService, provideNgxMask()],
})
export class CoreModule {}
