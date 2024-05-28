import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-responsible-manager-info',
  templateUrl: './responsible-manager-info.component.html',
  styleUrls: ['./responsible-manager-info.component.scss'],
})
export class ResponsibleManagerInfoComponent {
  @Input() managerInfoGroup!: FormGroup;

  showPasswordStatus: boolean = false;
  showPassword(status: boolean) {
    this.showPasswordStatus = status;
  }
}
