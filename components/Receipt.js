import { pageData } from '../tookuw-store.js';
import { Catalog } from './Catalog.js';

export class Receipt {

  constructor(data) {
    this.data = data.receiptItems;
    this.totalDue = data.receiptTotalDue;
    this.discount = data.receiptDiscount;
    this.totalItem = data.receiptTotalItem;
    this.dom = document.querySelectorAll('.receipt-list-item');
  }

  findById(id) {
    return this.data.find(receiptItem => receiptItem.id == id);
  }

  isDisabled() {
    return this.data.stock === 0 ? 'disabled' : '';
  }

  itemTemplate(data, index) {

    return `
      <li id="receipt-item-${data.id}" data-item-index="${index}" class="list-group-item pl-1 pr-2 d-flex justify-content-between align-items-center">
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

  calcItemTotal() {
    return this.qty * this.price;
  }

  // The function that 
  updateItemQty(id, value, type = null) {

    const receiptItem = this.findById(id);

    if (type === 'step') {
      receiptItem.qty = Math.sign(value) == 1 ? receiptItem.qty + Math.abs(value) : receiptItem.qty - Math.abs(value);
    }
    else {
      receiptItem.qty = value;
    }

    console.log(receiptItem);
    return;

    // Render item quantity
    renderReceiptItemQty(receiptItemObj);
    // And update the total by multiplying its new quantity with its price
    receiptItemObj.total = receiptItemObj.qty * receiptItemObj.price;
    // Render receipt item total
    renderReceiptItemTotal(receiptItemObj);
    // Update receipt total
    pageData.receiptTotal = calcTotalDue();
    // Render receipt total
    renderReceiptTotalDue()

    const theCatalogItem = pageData.catalogItems.find(catalogItem => catalogItem.id == receiptItemObj.id);

    if (type === 'step') {
      // Decrement the selected catalog item stock
      theCatalogItem.stock = Math.sign(value) == 1 ? theCatalogItem.stock - Math.abs(value) : theCatalogItem.stock + Math.abs(value);
    }
    else {
      theCatalogItem.stock = receiptItemObj.stock - receiptItemObj.qty;
    }

    // Render the catalog to reflect change on the selected catalog stock
    renderCatalogItemStock(theCatalogItem);

    // Update the item counter
    pageData.itemCounter = calcTotalItem();
    // Render Total Item
    document.querySelector('#item-counter').innerHTML = pageData.itemCounter;
  }

  // The function that render quantity change of certain receipt item
  renderItemQty(id) {

    const receiptItemObj = this.findById(id);

    // Grab the receipt list group
    const receiptListGroup = document.querySelectorAll('.receipt-list-group');

    receiptListGroup.forEach(theReceiptList => {

      // Grab the receipt item
      const receiptItemEl = theReceiptList.querySelector(`#receipt-item-${id}`);

      // Render its quantity
      receiptItemEl.querySelector('.receipt-item-qty').innerHTML = receiptItemObj.qty; // dekstop version
      receiptItemEl.querySelector('.mobile-qty-input').value = receiptItemObj.qty; // mobile version

    });

    // When the item quantity reach 0,
    if (receiptItemObj.qty === 0) {

      const receiptItemIndex = this.data.findIndex(receiptItem => receiptItem.id == sid);

      // remove from the receipt
      this.data.splice(receiptItemIndex, 1);

      // render receipt
      renderReceipt();

    }

  }

  // The function that render total change of certain receipt item
  renderItemTotal(receiptItem) {

    // When receipt item is 0
    if (receiptItem.qty === 0) return;

    // Grab the receipt list group
    const receiptListGroup = document.querySelectorAll('.receipt-list-group');

    receiptListGroup.forEach(theReceiptList => {
      // Grab the receipt item
      const theReceiptItem = theReceiptList.querySelector(`#receipt-item-${receiptItem.id}`);
      // Render its quantity
      theReceiptItem.querySelector('.receipt-item-total').innerHTML = receiptItem.total;
    });

  }

  // The function that insert new receipt item
  add(catalogItemObj) {

    // Push new receipt item into receiptItems array
    this.data.push(this.catalogToReceipt(catalogItemObj));

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
    this.totalItem = this.data.reduce((acc, receiptItem) => {
      return acc + receiptItem.qty
    }, 0);

  }

  renderTotalItem() {
    document.querySelector('#item-counter').innerHTML = this.totalItem;
  }

  // The function that calculate checkout total
  updateTotalDue() {

    // Return the sum of each item's total
    this.totalDue = this.data.reduce(function (acc, receiptItem) {
      return acc + receiptItem.total
    }, 0);

  }

  // The function that render receiptItems array into a markup of receipt list item
  render() {

    // Turn receiptItems into receipt list item markup
    const receiptMarkup = pageData.receiptItems.map((data, index) => {
      return this.itemTemplate(data, index)
    }).join('');

    this.dom.forEach(function (receiptList) {
      receiptList.innerHTML = receiptMarkup;
    });

    // Render the discounts
    this.renderDiscount();

    // Render total at checkout
    this.renderTotalDue();

    // Render Total Item
    this.renderTotalItem();

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

  // The function that render discount line
  renderDiscount() {

    const allDiscountLine = document.querySelectorAll('.discount-line');
    const allDiscountInput = document.querySelectorAll('.discount-input');

    // When the receipt is empty
    if (pageData.receiptItems.length == 0) {

      // Set the receipt discount to 0 
      pageData.receiptDiscount = 0;

    }

    // If there is no discount
    if (!pageData.receiptDiscount) {

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
    const discountItemMarkup = `<li class="list-group-item pl-1 pr-2 d-flex justify-content-between align-items-center">
      <p class="receipt-item-name">Discount</p>
      <p class="receipt-item-total text-right text-success">${pageData.receiptDiscount}</p>
    </li>`;

    // Render discount line into receipt
    allDiscountLine.forEach(function (discountLine) {
      discountLine.innerHTML = discountItemMarkup;
    });

  }

}