import { Component, INJECTOR, Inject, Injector } from '@angular/core';
import { ICompany } from '../../models';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { CompanyService } from '../../services/company.service';
import { finalize } from 'rxjs';
import { FullUrlPipe } from 'src/app/core/pipes/full-url.pipe';

@Component({
  selector: 'app-company-preview',
  templateUrl: './company-preview.component.html',
  styleUrls: ['./company-preview.component.scss'],
  providers: [FullUrlPipe]
})
export class CompanyPreviewComponent extends CoreBaseComponent {
  company!: ICompany;
  isLoading: boolean = false;

  constructor(
    private _companyService: CompanyService,
    private _fullURlPipe: FullUrlPipe,
    @Inject(INJECTOR) injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.fetchCompany();
  }

  fetchCompany() {
    this.isLoading = true;
    this._companyService.getCompany()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => this.company = res.data);
  }

  downloadLink(url: string, fileName: string) {
    url = this._fullURlPipe.transform(url);
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = `${this.translateService.instant(fileName)}.${url.substring(-3)}`;
    document.body.appendChild(link);
    link.click();
  }

  previewFileUrl(url: string) {
    const extension = url.slice(-3);
    const imageMimeData = ['jpg', 'jpeg', 'png', 'gif'];
    return imageMimeData.includes(extension) ? this._fullURlPipe.transform(url) : 'assets/svg/doc.svg';
  }

}
