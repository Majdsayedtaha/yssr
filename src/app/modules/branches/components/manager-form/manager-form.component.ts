import { Component, INJECTOR, Inject, Injector, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { BranchService } from '../../services/branch.service';
@UntilDestroy()
@Component({
  selector: 'app-manager-form',
  templateUrl: './manager-form.component.html',
  styleUrls: ['./manager-form.component.scss'],
})
export class ManagerFormComponent extends CoreBaseComponent implements OnInit {
  branchManagerFrom!: FormGroup;
  isLoading: boolean = false;
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
    this.initForm();

    if (this.branchId) {
      this.getBranchManagerInfo();
    }
  }

  initForm() {
    this.branchManagerFrom = this._fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
      permissions: [null, Validators.required],
      phone1: [null, Validators.required],
      phone2: [null],
      email1: [null, Validators.required],
      email2: [null, Validators.required],
    });
  }

  getBranchManagerInfo() {
    this.isLoading = true;
    this._branchService
      .getBranchManagerInfo(this.branchId)
      .pipe(untilDestroyed(this))
      .subscribe(res => {
        this.isLoading = false;
      });
  }

  updateBranchManager() {
    this.isLoading = true;
    this._branchService
      .updateBranchManager(this.branchId, this.branchManagerFrom.value)
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

  addBranchManager() {
    this.isLoading = true;
    this._branchService
      .addBranchManager(this.branchManagerFrom.value)
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
