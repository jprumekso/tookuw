import { pageData } from '../tookuw-store.js';
import { Catalog } from './Catalog.js';

export class Receipt {

  constructor(data) {
    this.items = data.receiptItems;
    this.totalDue = data.receiptTotalDue;
    this.discount = data.receiptDiscount;
    this.totalItem = data.receiptTotalItem;
    this.element = data.element
  }

  findById(id) {
    return this.items.find(receiptItem => receiptItem.id == id);
  }

  template(data, index) {

    return `
      <li id="receipt-item-${data.id}" data-item-id=${data.id} data-item-index="${index}" class="list-group-item pl-1 pr-2 d-flex justify-content-between align-items-center">
        <p class="receipt-item-name">${data.title}</p>
        <div class="receipt-item-action d-flex justify-content-between align-items-center">
          <button class="btn btn-light btn-sm rounded-circle qty-btn qty-btn-minus d-none d-md-block">
            <i class="fas fa-minus"></i>
          </button>
          <p class="receipt-item-qty mx-2 d-none d-md-block" data-toggle="modal" data-target="#item-qty-modal" data-title="${data.title}" data-qty="${data.qty}">${data.qty}</p>
          <input type="number" class="mobile-qty-input form-control d-md-none" value="${data.qty}" data-current-qty="${data.qty}">
          <button class="btn btn-light btn-sm rounded-circle qty-btn qty-btn-plus d-none d-md-block">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <p class="receipt-item-total text-right">${data.total}</p>
      </li>
    `;

  }

  // The function that 
  updateItemQty(id, value, type = null) {

    // Grab the item
    const theItem = this.findById(id);

    // Update its quantity
    if (type === 'step') {
      theItem.qty = Math.sign(value) == 1 ? theItem.qty + Math.abs(value) : theItem.qty - Math.abs(value);
    }
    else {
      theItem.qty = value;
    }

    // Render new qty
    this.renderItemQty(id)

    // Update its total
    theItem.total = theItem.qty * theItem.price;
    // Render new total
    this.renderItemTotal(id)

    // Update the item counter
    this.updateTotalItem();
    // Update the total
    this.updateTotalDue();

  }

  // The function that render quantity change of certain receipt item
  renderItemQty(id) {

    const receiptItem = this.findById(id);

    this.element.forEach(theReceiptList => {

      // Grab the receipt item
      const receiptItemEl = theReceiptList.querySelector(`#receipt-item-${id}`);

      // Render its quantity
      receiptItemEl.querySelector('.receipt-item-qty').innerHTML = receiptItem.qty; // dekstop version
      receiptItemEl.querySelector('.mobile-qty-input').value = receiptItem.qty; // mobile version

    });

    // When the item quantity reach 0,
    if (receiptItem.qty === 0) {

      const receiptItemIndex = this.items.findIndex(receiptItem => receiptItem.id == id);

      // remove from the receipt
      this.items.splice(receiptItemIndex, 1);

      // render receipt
      this.render();

    }

  }

  // The function that render total change of certain receipt item
  renderItemTotal(id) {

    // Grab the item
    const theItem = this.findById(id);

    // When receipt item is 0
    if (!theItem) return;

    // Grab the receipt list group
    const receiptListGroup = document.querySelectorAll('.receipt-list-group');

    receiptListGroup.forEach(theReceiptList => {
      // Grab the receipt item
      theReceiptList.querySelector(`#receipt-item-${id} .receipt-item-total`).innerHTML = theItem.total;;
    });

  }

  // The function that insert new receipt item
  add(catalogItem) {

    // console.log(catalogItem);

    // If the item is already in the receipt
    if (this.findById(catalogItem.id)) {

      // then increase its quantity
      this.updateItemQty(catalogItem.id, 1, 'step');
      // Bailed out
      return;

    }

    // Push new receipt item into receiptItems array
    this.items.push(this.catalogToReceipt(catalogItem));

    console.log(this.items);

    // Update the item counter
    this.updateTotalItem();

    // Update the total
    this.updateTotalDue();

    // Render receiptItems array into list of receipt item
    this.render();

  }

  catalogToReceipt(catalogItemObj) {
    // Create a receipt item object by deep copying the selectedCatalogItem
    const receiptItem = JSON.parse(JSON.stringify(catalogItemObj));
    // Assign initial receipt item quantity
    receiptItem.qty = 1;
    // Assign initial receipt item total
    receiptItem.total = receiptItem.qty * receiptItem.price;
    // Return the created receipt
    return receiptItem;
  }

  // The function that count the total of all receipt item quantity
  updateTotalItem() {

    // Return the sum all the total of each item 
    this.totalItem = this.items.reduce((acc, receiptItem) => {
      return acc + receiptItem.qty
    }, 0);

    // Re-render
    this.renderTotalItem();

  }

  renderTotalItem() {
    document.querySelector('#item-counter').innerHTML = this.totalItem;
  }

  // The function that calculate checkout total
  updateTotalDue() {

    // Return the sum of each item's total
    this.totalDue = this.items.reduce(function (acc, receiptItem) {
      return acc + receiptItem.total
    }, 0);

    // Re-render
    this.renderTotalDue();

  }

  // The function that render total
  renderTotalDue() {

    // Grab all total-due element
    const allTotalDueEl = document.querySelectorAll('.total-due');

    // Render total to all Total Due element
    allTotalDueEl.forEach(totalDueEl => {
      totalDueEl.innerHTML = this.totalDue;
    });

  }

  // The function that render receiptItems array into a markup of receipt list item
  render() {

    // Turn receiptItems into receipt list item markup
    const receiptMarkup = this.items.map((data, index) => {
      return this.template(data, index)
    }).join('');

    this.element.forEach(function (receiptListGroup) {
      receiptListGroup.querySelector('.receipt-list-item').innerHTML = receiptMarkup;
    });

    // Render the discounts
    this.renderDiscount();

    // Render total at checkout
    this.renderTotalDue();

    // Render Total Item
    this.renderTotalItem();

  }

  // The function that render discount line
  renderDiscount() {

    const allDiscountLine = document.querySelectorAll('.discount-line');
    const allDiscountInput = document.querySelectorAll('.discount-input');

    // When the receipt is empty
    if (this.items.length == 0) {

      // Set the receipt discount to 0 
      this.discount = 0;

    }

    // If there is no discount
    if (!this.discount) {

      // Clear all discount line
      allDiscountLine.forEach(function (discountLine) {
        discountLine.innerHTML = '';
      });

      // Clear all discount input
      allDiscountInput.forEach(function (discountInput) {
        discountInput.value = '';
      });

      // Return early
      return;

    }

    // The discount line markup
    const discountItemMarkup = `
      <li class="list-group-item pl-1 pr-2 d-flex justify-content-between align-items-center">
        <p class="receipt-item-name">Discount</p>
        <p class="receipt-item-total text-right text-success">${this.discount}</p>
      </li>
    `;

    // Render discount line into receipt
    allDiscountLine.forEach(function (discountLine) {
      discountLine.innerHTML = discountItemMarkup;
    });

  }

}