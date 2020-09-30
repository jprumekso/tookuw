export class Catalog {

  constructor(data) {
    this.items = data.items;
    this.searchQuery = '';
    this.filteredItems = [];
    this.element = data.element;
  }

  filter(value) {

    this.searchQuery = value.toLowerCase();
    this.filteredItems = this.items.filter(catalogItem => catalogItem.title.toLowerCase().includes(this.searchQuery));
    this.render();

  }

  isDisabled(itemData) {
    return itemData.stock === 0 ? 'disabled' : '';
  }

  template(itemData) {

    return `
      <a href="#" id="catalog-item-${itemData.id}" class="catalog-item list-group-item list-group-item-action px-0 d-flex flex-wrap align-items-center ${this.isDisabled(itemData)}" data-catalog-id="${itemData.id}">
        <span class="mr-4"><i class="fas fa-fw fa-gift fa-2x"></i></span>
        <div>
          <p>${itemData.title}</p>
          <p class="text-muted">Stock: <span class="catalog-item-stock">${itemData.stock}</span>pcs</p>
        </div>
        <p class="ml-auto">${itemData.price}</p>
      </a>
    `;

  }

  findItemById(id) {

    // Find individual catalog item
    return this.items.find(item => item.id == id);

  }

  updateItemStock(id, amount, type = null) {

    // Grab the item
    const theItem = this.findItemById(id);

    // Update its quantity
    if (type === 'step') {
      theItem.stock = Math.sign(amount) == 1 ? theItem.stock + Math.abs(amount) : theItem.stock - Math.abs(amount);
    }
    else {
      theItem.stock = amount;
    }

    // Re-render
    this.renderItem(theItem);

  }

  setCatalogStock(id, amount) {
    // Grab the item
    const theItem = this.findItemById(id);
    theItem.stock = amount;
    this.renderItem(theItem);
  }

  renderItem(itemData) {

    // Render individual catalog item
    this.element.querySelector(`#catalog-item-${itemData.id}`).outerHTML = this.template(itemData);

  }

  render() {

    // Decide which array of items to render
    const theItems = this.filteredItems.length == 0 && !this.searchQuery ? this.items : this.filteredItems;

    // Render
    this.element.innerHTML = theItems.map(itemData => { return this.template(itemData) }).join('');;

  }

}