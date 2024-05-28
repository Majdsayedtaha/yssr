import { FlatTreeControl } from '@angular/cdk/tree';

export class CustomTree extends FlatTreeControl<any> {
  constructor(getLevel: (dataNode: any) => number, isExpandable: (dataNode: any) => boolean) {
    super(getLevel, isExpandable);
  }

  collapseExcept(fn: any) {
    this.dataNodes.forEach(node => {
      if (!fn(node)) this.collapse(node);
    });
  }
  expandParents(node: any) {
    const parent = this.getParent(node);
    this.expand(parent);

    if (parent && parent.level > 0) {
      this.expandParents(parent);
    }
  }
  getParent(node: any) {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
  }
  filterNodes(array: any[], fn: any) {
    return array?.reduce((r, o) => {
      var children = this.filterNodes(o?.children || [], fn);
      if (fn(o) || children.length) r.push(Object.assign({}, o, children.length && { children }));
      return r;
    }, []);
  }
  findSectionToExpand(url: string): any | undefined {
    let data = this.dataNodes.slice();
    return data.find(({ route }: any) => route?.toLowerCase()?.includes(url));
  }
  expandMatchedNodes(v: string, fn: any) {
    this.dataNodes.filter(data => {
      let check = fn(data);
      if (check && v) {
        this.expandParents(data);
      }
    });
  }
}
