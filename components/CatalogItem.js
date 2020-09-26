export class CatalogItem {

  constructor(catalogItemData) {
    this.data = catalogItemData;
    this.element = document.querySelector(`#catalog-item-${catalogItemData.id}`);
  }

  isDisabled() {
    return this.data.stock === 0 ? 'disabled' : '';
  }

  template() {

    return `
      <a href="#" id="catalog-item-${this.data.id}" class="catalog-item list-group-item list-group-item-action px-0 d-flex flex-wrap align-items-center ${this.isDisabled()}" data-catalog-id="${this.data.id}">
        <span class="mr-4"><i class="fas fa-fw fa-gift fa-2x"></i></span>
        <div>
          <p>${this.data.title}</p>
          <p class="text-muted">Stock: <span class="catalog-item-stock">${this.data.stock}</span>pcs</p>
        </div>
        <p class="ml-auto">${this.data.price}</p>
      </a>
    `;

  }

  renderStock() {

    // Render its stock content
    this.element.querySelector('.catalog-item-stock').innerHTML = this.data.stock;

  }

}