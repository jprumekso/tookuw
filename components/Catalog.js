import { pageData } from '../tookuw-store.js';
import { CatalogItem } from './CatalogItem.js';

export class Catalog {

  constructor() {
    this.element = document.querySelector('#catalog');

  }

  filter() {

    pageData.filteredCatalog = pageData.catalogItems.filter(catalogItem => catalogItem.title.toLowerCase().includes(pageData.catalogSearchQuery));

  }

  render() {

    const catalogData = pageData.filteredCatalog.length == 0 && !pageData.catalogSearchQuery ? pageData.catalogItems : pageData.filteredCatalog;

    this.element.innerHTML = catalogData.map(itemData => { return new CatalogItem(itemData).template() }).join('');;

  }

}