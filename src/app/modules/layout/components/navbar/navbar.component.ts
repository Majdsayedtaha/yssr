import { Component, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, finalize, fromEvent, of, switchMap, takeUntil } from 'rxjs';
import { IToastData, ToastComponent } from 'src/app/core/components/toast/toast.component';
import { DialogService } from 'src/app/core/services/dialog.service';
import { DirectionService } from 'src/app/core/services/direction.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { UserService } from 'src/app/modules/users/services/user.service';
import { NotificationService } from '../../services/notification.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { INotification } from 'src/app/core/interfaces/notification.interface';
import { DatePipe } from '@angular/common';
import { IEnum } from 'src/app/core/interfaces';
import { EnumService } from 'src/app/core/services/enums.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ChangeUserPasswordComponent } from './change-user-password/change-user-password.component';
@UntilDestroy()
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [DatePipe],
})
export class NavbarComponent implements OnInit {
  @Input() matDrawer!: MatDrawer;
  public paginationOptions = { pageNumber: 0, pageSize: 10 };
  private previousWidth: number = window.innerWidth;
  page = 0;
  searchForm!: FormGroup;
  notificationPaginateLoader: boolean = false;
  loading: boolean = false;
  listDone: boolean = false;
  isSkeleton: boolean = false;
  openButton: boolean = true;
  notifications: INotification[] = [];
  filterOn: string[] = [];
  user!: {
    role: string;
    userName: string;
  };
  sectionsControl = new FormControl<IEnum[]>([]);
  sectionsList: IEnum[] = [];

  constructor(
    private _fb: FormBuilder,
    private _renderer: Renderer2,
    private _toast: DialogService,
    private _notificationService: NotificationService,
    private _enumService: EnumService,
    private _storageService: StorageService,
    private _authService: AuthService,
    public router: Router,
    public direction: DirectionService,
    public storageService: StorageService,
    public translateService: TranslateService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this._enumService.getNotificationsTypes().subscribe(types => {
      this.sectionsList = types.data;
    });
    this.searchForm = this._fb.group({
      search: [''],
    });
    this.user = this.storageService.getLocalObject('user');
    this.openButton = this.storageService.getLocalObject('open');
    this.watchSectionsControlChanges();

    fromEvent(window, 'resize')
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe(() => this.onWindowResize());
  }

  onWindowResize() {
    const currentWidth = window.innerWidth;
    if (currentWidth !== this.previousWidth) {
      if (currentWidth <= 1000) {
        this.matDrawer.close();
        this.storageService.setLocalObject('open', false);
        this.openButton = this.storageService.getLocalObject('open');
      } else {
        this.matDrawer.open();
        this.storageService.setLocalObject('open', true);
        this.openButton = this.storageService.getLocalObject('open');
      }
      this.previousWidth = currentWidth;
    }
  }

  flipDirection() {
    if (this.translateService.currentLang === 'ar') {
      this.translateService.use('en');
      this._renderer.setAttribute(document.body, 'dir', 'ltr');
      this.direction.setDirection('ltr');
      this.storageService.setLocalObject('lang', 'en');
    } else {
      this.translateService.use('ar');
      this._renderer.setAttribute(document.body, 'dir', 'rtl');
      this.direction.setDirection('rtl');
      this.storageService.setLocalObject('lang', 'ar');
    }
  }

  drawerMenuButton() {
    if (this.matDrawer) {
      this.matDrawer.toggle();
      this.storageService.setLocalObject('open', this.matDrawer.opened);
      this.openButton = this.storageService.getLocalObject('open');
    }
  }

  logout() {
    const toastData: IToastData = {
      messageContent: 'you_want_to_logout',
      firstButtonContent: 'cancel',
      secondButtonContent: 'yes',
      svgIcon: 'laptop-toast',
      centralize: true,
    };
    this._toast
      .openDialog(ToastComponent, { data: toastData, size: 'm' })
      .pipe(
        switchMap(res => {
          if (res) {
            return of('yes');
          } else {
            return of(null);
          }
        })
      )
      .subscribe((res: any) => {
        if (res) {
          this._authService.logout();
        }
      });
  }

  navigateToSettingPage() {
    this.router.navigate(['/settings/company-preview']);
  }

  // Notification Logic Below...
  getNotification() {
    this.isSkeleton = true;
    this.listDone = false;
    this.page = 0;
    this.notifications = [];
    this._notificationService
      .getNotificationsList(this.page, this.filterOn)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: res => {
          this.notifications = res.data as INotification[];
        },
        complete: () => {
          this.isSkeleton = false;
        },
      });
  }

  onScroll(e: number) {
    if (e > 95 && !this.notificationPaginateLoader && !this.listDone) {
      this.notificationPaginateLoader = true;
      this._notificationService
        .getNotificationsList(++this.page, this.filterOn)
        .pipe(
          untilDestroyed(this),
          finalize(() => (this.notificationPaginateLoader = false))
        )
        .subscribe({
          next: res => {
            if (res.data.length === 0) {
              this.notificationPaginateLoader = false;
              this.listDone = true;
            } else this.notifications = this.notifications.concat(res.data as INotification[]);
          },
        });
    }
  }

  markAsRead(id: string) {
    this._notificationService.getNotificationDetails(id).subscribe(res => {
      const notificationCount = this._storageService.notificationsCount.getValue();
      this._storageService.notificationsCount.next(notificationCount - 1);
      this.notifications[this.notifications.findIndex(n => n.id === id)].read = true;
    });
  }

  watchSectionsControlChanges() {
    this.sectionsControl.valueChanges.pipe(untilDestroyed(this)).subscribe(filteredSections => {
      if (filteredSections) {
        this.notifications = [];
        this.isSkeleton = true;
        this.page = 0;
        this.filterOn = filteredSections?.map(s => {
          return s.id as string;
        });
        this._notificationService
          .getNotificationsList(this.page, this.filterOn)
          .pipe(untilDestroyed(this), takeUntil(this.sectionsControl.valueChanges))
          .subscribe({
            next: res => {
              this.notifications = res.data as INotification[];
            },
            complete: () => {
              this.isSkeleton = false;
            },
          });
      }
    });
  }

  onSectionRemoved(topping: IEnum) {
    const toppings = this.sectionsControl.value as IEnum[];
    this.removeFirst(toppings, topping);
    this.sectionsControl.setValue(toppings);
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  // Change password
  openChangePasswordDialog() {
    this._toast.openDialog(ChangeUserPasswordComponent, { size: 'l' }).subscribe();
  }
}
