import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  isPrinting = false;
  public matDrawer!: MatDrawer;

  constructor(private route: Router, private ckd: ChangeDetectorRef, private _storageService: StorageService) {}

  ngOnInit(): void {
    this.isPrinting = this.route.url === '/pdf-template' ? true : false;
  }

  catchDrawer(drawer: MatDrawer) {
    this.matDrawer = drawer;
    drawer.opened = this._storageService.getLocalObject('open');
    this.ckd.detectChanges();
  }
}
