import { switchMap, of } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { Component, INJECTOR, Inject, Injector, OnDestroy, OnInit } from '@angular/core';
@UntilDestroy()
@Component({
  selector: 'app-add-procedure',
  templateUrl: './add-procedure.component.html',
  styleUrls: ['./add-procedure.component.scss'],
})
export class AddProcedureComponent extends CoreBaseComponent implements OnInit, OnDestroy {
  addProcedureForm!: FormGroup;
  lastProcedures!: any;
  isLoading = false;
  constructor(@Inject(INJECTOR) injector: Injector, private fb: FormBuilder) {
    super(injector);
  }

  ngOnInit(): void {
    this.initForm();
    this.getLastProcedures();
  }

  initForm() {
    this.addProcedureForm = this.fb.group({
      requestId: [null, Validators.required],
      procedureId: [null, Validators.required],
      date: [null, Validators.required],
      note: [null],
    });
  }

  addProcedure() {
    this.isLoading = true;
    this.waiverService.createWaiverProcedure(this.addProcedureForm.value).subscribe({
      next: res => {
        this.isLoading = false;
        this.addProcedureForm.reset();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  getLastProcedures() {
    this.addProcedureForm
      .get('requestId')
      ?.valueChanges.pipe(
        untilDestroyed(this),
        switchMap(value => {
          if (!value) {
            this.lastProcedures = [];
            return of([]);
          }
          return this.waiverService.fetchLastProcedureByRequestId(value);
        })
      )
      .subscribe((res: any) => (this.lastProcedures = res.data));
  }
  fetchRequestProceduresSelect = () => {
    const requestId = this.addProcedureForm.get('requestId')?.value;
    if (requestId) return this.getWaiverRequestsProcedures(requestId);
    else return of([]);
  };
}
