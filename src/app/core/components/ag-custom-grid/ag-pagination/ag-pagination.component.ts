import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter, INJECTOR, Inject, Injector } from '@angular/core';
import { CoreBaseComponent } from '../../base/base.component';


@Component({
  selector: 'ag-pagination',
  templateUrl: './ag-pagination.component.html',
  styleUrls: ['./ag-pagination.component.scss']
})
export class AgPaginationComponent extends CoreBaseComponent implements OnChanges {

  //#region Variables
  //public
  public currentPage: number;
  public totalPages!: number;
  public allPageNumbers: number[];
  public previewNumbers: number[];
  //decorates
  @Input('pageSize') pageSize!: number
  @Input('lengthData') lengthData!: number
  @Input('chunkSize') chunkSize: number;
  @Input('resetPage') resetPage: boolean;
  @Output('pageChanged') pageChanged: EventEmitter<number>;
  //#end region

  //#region Accessors
  get morePageNumber(): number {
    let number = -1; //hidden page
    if (this.previewNumbers.length < this.chunkSize) {
      if (this.previewNumbers.length > 0) number = this.previewNumbers[this.previewNumbers.length - 1] + 1;
      else number = this.totalPages - 1;
    }
    return number;
  }
  //#end region

  constructor(@Inject(INJECTOR) injector: Injector) {
    super(injector);
    this.chunkSize = 3;
    this.currentPage = 1;
    this.resetPage = false;
    this.previewNumbers = [];
    this.allPageNumbers = [];
    this.pageChanged = new EventEmitter<number>();
  }

  //#region LifeCycle
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['pageSize'] && changes['pageSize'].currentValue != changes['pageSize'].previousValue ||
      changes['lengthData'] && changes['lengthData'].currentValue != changes['lengthData'].previousValue
    ) this.initialVariables();
    if (changes['resetPage'] && changes['resetPage'].currentValue) this.initialVariables();
  }
  //#end region

  initialVariables() {
    this.totalPages = Math.ceil(this.lengthData / this.pageSize);
    if (this.totalPages > 2)
      this.allPageNumbers = Array.from(Array(this.totalPages - 2).keys() ?? []).map(x => x + 1).filter(x => x >= 0);
    this.viewPageNumbers(1);
  }

  // #region Actions
  /**
   *
   * @param {number} newPage //navigate to another page
   */
  moveToPage(newPage: number) {
    this.currentPage = newPage;
    this.pageChanged.next(newPage - 1);
    if (this.previewNumbers.length == this.chunkSize || this.currentPage < this.previewNumbers[0])
      this.viewPageNumbers(newPage);
  }

  /**
   *
   * @param {number} pageNumber //preview numbers started from pageNumber
   */
  viewPageNumbers(pageNumber: number) {
    if (this.allPageNumbers.length > 0) {
      if (pageNumber != this.totalPages && pageNumber != this.totalPages - 1)
        this.previewNumbers = this.allPageNumbers.slice(pageNumber - 1, pageNumber + this.chunkSize - 1);
      else
        this.previewNumbers = [this.totalPages - 3, this.totalPages - 2];
    }
  }
  //#end region

}
