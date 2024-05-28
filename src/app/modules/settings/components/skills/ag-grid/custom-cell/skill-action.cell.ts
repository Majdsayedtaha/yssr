import { UntypedFormGroup } from '@angular/forms';
import { IRoleEnum } from 'src/app/core/constants';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, Inject, INJECTOR, Injector } from '@angular/core';
import { SkillService } from 'src/app/modules/settings/services/skill.service';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';

interface SkillCellRendererAngularComp extends ICellRendererParams {
  formGroup: UntypedFormGroup;
}

@UntilDestroy()
@Component({
  template: `
    <div class="actions-row-container">
      <button mat-icon-button (click)="editSkill()" authorization [roleValue]="role" [authName]="authCanUpdate">
        <mat-icon svgIcon="edit-row"></mat-icon>
      </button>
      <button mat-icon-button (click)="deleteSkill()" authorization [roleValue]="role" [authName]="authCanDelete">
        <mat-icon svgIcon="delete-row"></mat-icon>
      </button>
    </div>
  `,
})
export class SkillActionCell extends CoreBaseComponent implements ICellRendererAngularComp {

  public cell!: SkillCellRendererAngularComp;
  public role = IRoleEnum.Skill;

  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _skillService: SkillService) {
    super(injector);
  }

  agInit(params: SkillCellRendererAngularComp): void {
    this.cell = params;
  }

  refresh(params: SkillCellRendererAngularComp): boolean {
    this.cell = params;
    return true;
  }

  deleteSkill() {
    if (!this.cell.data.id && this.cell.data.nameAr && this.cell.data.nameEn)
      this.cell.api.applyTransaction({ remove: [this.cell.data] });
    else
      this._skillService.deleteSkill(this.cell.data.id).pipe(untilDestroyed(this)).subscribe(res => {
        this.cell.context.parentComp.update = false;
        this.cell.api.applyTransaction({ remove: [this.cell.data] });
        this.cell.formGroup.reset();
      });
  }

  editSkill() {
    this.cell.context.parentComp.update = true;
    this.cell.formGroup.patchValue({
      id: this.cell.data.id,
      nameAr: this.cell.data.nameAr,
      nameEn: this.cell.data.nameEn,
    });
  }
}
