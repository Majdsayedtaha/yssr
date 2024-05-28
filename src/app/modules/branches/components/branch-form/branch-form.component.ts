import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { BranchService } from '../../services/branch.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute } from '@angular/router';
import { TextValidator } from 'src/app/core/validators/text.validator';
import { IBranchForm } from '../../models';
@UntilDestroy()
@Component({
  selector: 'app-branch-form',
  templateUrl: './branch-form.component.html',
  styleUrls: ['./branch-form.component.scss'],
})
export class BranchFormComponent extends CoreBaseComponent implements OnInit {
  branchFrom!: FormGroup;
  branchInfo!: IBranchForm;
  isLoading: boolean = false;
  loadingData: boolean = false;
  branchId!: string;
  constructor(
    @Inject(INJECTOR) injector: Injector,
    private _fb: FormBuilder,
    private _branchService: BranchService,
    private _activatedRoute: ActivatedRoute
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initForm();
    this.branchId = this._activatedRoute.snapshot.params['id'];

    if (this.branchId) {
      this.getBranchInfo();
    }
  }

  initForm() {
    this.branchFrom = this._fb.group({
      nameAr: [null, [TextValidator.arabic, Validators.required]],
      nameEn: [null, [TextValidator.english, Validators.required]],
      branchManagerId: [null, Validators.required],
      address: [null, Validators.required],
      phone1: [null, Validators.required],
      phone2: [null, Validators.nullValidator],
      email1: [null, Validators.required],
      email2: [null, Validators.required],
    });
  }

  getBranchInfo() {
    this.loadingData = true;
    this._branchService
      .getBranchInfo(this.branchId)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.branchInfo = res.data as IBranchForm;
        this.loadingData = false;
        this.branchFrom.patchValue({
          nameAr: this.branchInfo.nameAr,
          nameEn: this.branchInfo.nameEn,
          branchManagerId: this.branchInfo.branchManager,
          address: this.branchInfo.address,
          phone1: this.branchInfo.phone1,
          phone2: this.branchInfo.phone2,
          email1: this.branchInfo.email1,
          email2: this.branchInfo.email2,
        });
      });
  }

  updateBranch() {
    this.isLoading = true;
    this._branchService
      .updateBranch(this.branchId, this.branchFrom.value)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
  addBranch() {
    this.isLoading = true;
    this._branchService
      .addBranch(this.branchFrom.value)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
}
