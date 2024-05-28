import { ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Sections } from 'src/app/core/interfaces/sections.interface';
import { TREE_DATA } from 'src/app/core/constants/app-sections';
import { CoreBaseComponent } from 'src/app/core/components/base/base.component';
import { NavigationEnd, Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CustomTree } from './tree';
import { MatDrawer } from '@angular/material/sidenav';

@UntilDestroy()
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent extends CoreBaseComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  @Output() matDrawer = new EventEmitter();
  treeNodes: any[] = [];
  private _transformer = (node: Sections, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      ...node,
    };
  };

  treeControl = new CustomTree(
    node => node.level,
    node => node.expandable
  );
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );
  activeNode: any;
  text: string = '';
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  selectedNodes = [];
  currentOpenNode: Sections | null = null;
  urlWithOutSlash: string = '';

  constructor(injector: Injector, private _router: Router, private cdk: ChangeDetectorRef) {
    super(injector);
    this.dataSource.data = TREE_DATA;
    this.treeNodes = this.treeControl.dataNodes;
  }

  ngOnInit() {
    this._router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.treeControl?.collapseAll();
        this.expandActive();
      }
    });
  }

  hasChild = (_: number, node: Sections) => !!node.children && node.children.length > 0;

  onNodeClicked(event: any, activeNode: any) {
    this.treeControl.collapseExcept((node: any) => node == activeNode);
    this.treeControl.expandParents(activeNode);
    this.activeNode = activeNode;
  }

  todoLeafItemSelectionToggle(node: Sections): void {
    this.treeControl.toggle(node);
  }

  expandActive() {
    let url = this._router.url;
    const sectionToExpand = this.treeControl.findSectionToExpand(url.slice(1) === '' ? 'main' : url.slice(1));
    if (sectionToExpand) {
      this.activeNode = sectionToExpand;
      this.treeControl.expandParents(sectionToExpand);
    }
  }
  filter(e: any) {
    this.text = e;
    let tree = this.treeControl.filterNodes(TREE_DATA, (node: any) =>
      this.translateService.instant(node.name)?.toLowerCase()?.includes(e.toLowerCase())
    );

    this.dataSource.data = tree;
    this.treeControl.expandMatchedNodes(e, (node: any) =>
      this.translateService.instant(node.name)?.toLowerCase()?.includes(e.toLowerCase())
    );
    this.expandActive();
  }

  ngAfterViewInit() {
    this.expandActive();
    setTimeout(() => {
      const element = document.querySelector('.section-part-active');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
    this.matDrawer.next(this.drawer);
  }
}
