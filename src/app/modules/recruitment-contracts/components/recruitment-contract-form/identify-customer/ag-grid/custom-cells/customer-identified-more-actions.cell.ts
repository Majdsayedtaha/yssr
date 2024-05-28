import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/core/constants';

@Component({
  selector: 'app-contracts-more-actions',
  template: `
    <button mat-icon-button class="more-btn">
      <mat-icon svgIcon="table-more-action"></mat-icon>
    </button>
  `,
  styles: [
    `
      .more-btn {
        cursor: pointer;
        width: 30px;
        height: 30px;
        padding: 3px;
        padding-top: 4px;
        .mat-icon {
          scale: 0.7;
        }
      }
      .menu-item {
        width: 16px;
        height: 16px;
        font-size: 14px;
      }
    `,
  ],
})
export class CustomerIdentifiedMoreActionsCell extends CoreBaseComponent implements ICellRendererAngularComp {
  params!: ICellRendererParams;

  constructor(@Inject(INJECTOR) injector: Injector, private _router: Router) {
    super(injector);
  }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    return true;
  }

  openUpdateContract() {
    this._router.navigateByUrl(`${AppRoutes.layout}/${AppRoutes.contracts}/update/${this.params.data.id}`);
  }
}
