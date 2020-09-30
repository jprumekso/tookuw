import { pageData } from './tookuw-store.js';
import { Catalog } from './components/Catalog.js';
import { Receipt } from './components/Receipt.js';

// Initial state of all data on the page
pageData.catalogItems = [
  {
    id: 11,
    title: 'Ripe Banana',
    stock: 150,
    price: 12500
  },
  {
    id: 12,
    title: 'Fresh Apple',
    stock: 75,
    price: 6500
  },
  {
    id: 13,
    title: 'Juicy Orange',
    stock: 100,
    price: 7500
  },
  {
    id: 14,
    title: 'Giant Mango',
    stock: 5,
    price: 25000
  },
  {
    id: 15,
    title: 'Seedless Guava',
    stock: 15,
    price: 45000
  },
  {
    id: 16,
    title: 'Creamy Durian',
    stock: 77,
    price: 12000
  },
  {
    id: 17,
    title: 'Sweety Grape',
    stock: 35,
    price: 22000
  },
  {
    id: 18,
    title: 'Tasty Pear',
    stock: 0,
    price: 5000
  },
];
pageData.customers = [
  {
    name: 'Leanne',
    address: 'East Java',
    phone: '08123485858'
  },
  {
    name: 'Erwin',
    address: 'Bali',
    phone: '08123485858'
  },
  {
    name: 'Sasha',
    address: 'Senduro Lumajang',
    phone: '08123485858'
  },
  {
    name: 'Eren',
    address: 'Paris',
    phone: '08123485858'
  },
  {
    name: 'Kid',
    address: 'Saudi Arabia',
    phone: '08123485858'
  },
  {
    name: 'Jack',
    address: 'Abu Dhabi',
    phone: '08123485858'
  },
  {
    name: 'Captain',
    address: 'Istanbul',
    phone: '08123485858'
  },
  {
    name: 'Drake',
    address: 'Brunei Darussalam',
    phone: '08123485858'
  },
];
pageData.filteredCustomer = [];
pageData.selectedCustomer = {};
pageData.filteredCatalog = [];
pageData.receiptItems = [];
pageData.receiptTotalItem = 0;
pageData.receiptDiscount = 0;
pageData.receiptTotalDue = 0;
pageData.paymentReceived = 0;
pageData.paymentChange = 0;
pageData.paymentDue = 0;
pageData.catalogSearchQuery = '';
pageData.customerSearchQuery = '';

const catalog = new Catalog(pageData);
const receipt = new Receipt(pageData);

catalog.render();

// Catalog Search Bar -- When user types the search query to filter catalog
document.querySelector('#search-catalog').addEventListener('keyup', event => {

  // Grab the search input value and turn to lowercase
  catalog.searchQuery = event.target.value.toLowerCase();

  // Fill the filteredCatalog with the filtered catalogItem data
  catalog.filteredCatalog = catalog.data.filter(catalogItem => catalogItem.title.toLowerCase().includes(catalog.searchQuery));

  // Render Catalog
  catalog.render();

});

// Catalog Item -- When user click at each catalog item
document.querySelector('#catalog').addEventListener('click', event => {

  // Target the selected item (clicked list)
  let clickedElement = event.target;

  // If the clicked element is not a catalog-item and not the childern of catalog-item then bailed out 
  if (!clickedElement.matches('.catalog-item') && !clickedElement.closest('.catalog-item')) return;

  // Grab the catalog item object by its id
  const catalogItemId = clickedElement.dataset.catalogId || clickedElement.closest('.catalog-item').dataset.catalogId;
  const selectedCatalogItem = catalog.findById(catalogItemId);

  // Check whether the incoming catalogItem is already in the receiptItems array
  // by using the catalog title as 'filter' on array.find() method 
  const existingReceiptItem = receipt.findById(catalogItemId);

  // If array.find() found the same title, then the item must be already in the receiptItems array
  if (existingReceiptItem) {

    receipt.updateItemQty(existingReceiptItem, 1, 'step');
    receipt.renderItemQty(existingReceiptItem);

    // Then bailed out
    return;

  }

  receipt.add(selectedCatalogItem);

  // Decrement the selected catalog item stock by 1
  catalog.updateStock(catalogItemId, -1, 'step');
  // Render the catalog to reflect change on the selected catalog stock
  catalog.renderStock(catalogItemId);

});

/**
 * RENDER / UI RELATED FUNCTIONS
 * 
 * These group of functions are used to handle the representation of data
 * Such as generating a markup list of data, injecting markup into the dom, etc
 */

// The function that render customer list
function renderCustomers() {

  // Use the filteredCatalog instead when user type search query
  const customerList = pageData.filteredCustomer.length == 0 && !pageData.customerSearchQuery ? pageData.customers : pageData.filteredCustomer;

  // Turn customers data into customer list
  const customerListMarkup = customerList.map(function (customer, index) {
    return `<li class="list-group-item px-0 d-flex justify-content-between align-items-center">
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="customerRadio" id="customer-${index}" value="${customer.name}">
                <label class="form-check-label" for="customer-${index}">${customer.name}</label>
              </div>
            </li>`;
  }).join('');

  document.querySelector('#customer-list').innerHTML = customerListMarkup;
}

// The function that render the selected customer
function renderSelectedCustomer() {

  // Grab the 'From' line at the Payment Success modal
  const fromCustomer = document.querySelector('#from-customer--modal');

  // Grab the add customer modal
  const allAddCustomerBtn = document.querySelectorAll('.add-customer-btn');

  // Assign the name or '-' to the From line
  fromCustomer.innerHTML = Object.entries(pageData.selectedCustomer).length !== 0 ? pageData.selectedCustomer.name : '-';

  // Change User Plus icon to User Checked
  allAddCustomerBtn.forEach(function (addCustomerBtn) {
    addCustomerBtn.innerHTML = Object.entries(pageData.selectedCustomer).length !== 0 ? '<i class="fas fa-user-check text-success"></i>' : '<i class="fas fa-user-plus"></i>';
  });

}

// Function that construct the alert modal content
function createAlert(alert) {
  return `<i class="${alert.icon.name} fa-4x mb-4 ${alert.icon.color} animate__animated ${alert.icon.animation}"></i>
          <h4>${alert.title}</h4>
          <p class="mb-0">${alert.message}</p>`;
}

/**
 * ACTION RELATED FUNCTIONS
 * 
 * These group of functions handle the action needed on dom events
 */

// The functions that reset the data and page view
function resetView() {

  // Set data to its initial state
  pageData.receiptItems = [];
  pageData.receiptDiscount = 0;
  pageData.receiptTotal = 0;
  pageData.paymentReceived = 0;
  pageData.paymentChange = 0;
  pageData.paymentDue = 0;
  pageData.selectedCustomer = {};
  pageData.itemCounter = 0;

  // Render
  renderSelectedCustomer();
  renderReceipt();
  document.querySelector('#item-counter').innerHTML = pageData.itemCounter;

}

/**
 * ALL EVENTS
 * 
 * The code below are the ones that responsible to handle each user interaction 
 */

// Receipt Items -- When user click plus/minus quantity button
document.addEventListener('click', function (e) {

  // Target the clicked element
  const clickedElement = e.target;

  // Bailed out if it's not inside .receipt-list-group
  if (!clickedElement.closest('.receipt-list-group')) return;

  // Bailed out when user click element other than the quantity button
  if (!clickedElement.matches('.qty-btn') && !clickedElement.matches('.fas')) return;

  // Grab the index of the respective item
  let itemIndex = clickedElement.closest('.list-group-item').dataset.itemIndex;

  // Grab the receipt item itself
  const affectedReceiptItem = pageData.receiptItems[itemIndex];

  // If it's the minus button, decrement the quantity
  // NOTE: Since the button consist of a button and an icon inside it 
  // and the click can happen at either of them then we need to target both
  if (clickedElement.matches('.fa-minus') || clickedElement.matches('.qty-btn-minus')) {

    updateReceiptItemQty(affectedReceiptItem, -1, 'step');

  };

  // If it's the plus button, increment 
  if (clickedElement.matches('.fa-plus') || clickedElement.matches('.qty-btn-plus')) {

    updateReceiptItemQty(affectedReceiptItem, 1, 'step');

  }

});

// Receipt Items -- Mobile -- When user inputs the quantity
document.querySelector('#mobile-receipt').addEventListener('input', function (e) {

  // Grab the Targeted Input
  const theQtyInput = e.target;

  // Grab the relevant item index
  const itemIndex = theQtyInput.closest('.list-group-item').dataset.itemIndex;

  // Grab the affected receipt item
  const affectedReceiptItem = pageData.receiptItems[itemIndex];

  if (isNaN(parseInt(theQtyInput.value))) return

  updateReceiptItemQty(affectedReceiptItem, parseInt(theQtyInput.value))

});

// Receipt Items -- Mobile -- When user click on quantity input
document.addEventListener('focusin', function (e) {

  if (!e.target.matches('input[type=number]')) return;

  e.target.select();

});

// Receipt Items -- Mobile -- When user click on quantity input
document.querySelector('#mobile-receipt').addEventListener('focusout', function (e) {

  if (!e.target.matches('input[type=number]')) return;

  renderReceipt();

});

// Input Number -- Prevent Empty String and Leading 0
document.addEventListener('input', function (e) {

  if (!e.target.matches('input[type=number]')) return;

  const numInput = e.target;

  if (numInput.value === '') {
    numInput.value = 0;
  }

  if (numInput.value.length === 2 && numInput.value.startsWith('0')) {
    numInput.value = numInput.value.slice(1);
  }

})

// Discount Button -- When user clicks Apply Discount
document.addEventListener('click', function (e) {

  // Get the clicked element
  const clickedElement = e.target;

  // If not Apply Discount button, then bailed out
  if (!clickedElement.matches('.apply-discount-btn')) return;

  // Get the respective discount input
  const discountInput = clickedElement.nextElementSibling;

  // Get existing discount
  const existingDiscount = pageData.receiptDiscount;

  // Grab the value of discount input
  pageData.receiptDiscount = parseInt(discountInput.value);

  // Calculate total after discount
  pageData.receiptTotal = pageData.receiptTotal + existingDiscount - pageData.receiptDiscount;

  // Render receipt
  renderReceipt();

});

// Item Qty Modal -- When 'Item Quantity Modal' is shown
$('#item-qty-modal').on('show.bs.modal', function (event) {

  // Grab the button that triggered the modal
  const button = $(event.relatedTarget)

  // Extract the data
  const itemIndex = button.parents('.list-group-item').data('item-index');
  const itemQty = button.data('qty');
  const itemName = button.data('title');

  // Render the data into each respective element
  $(this).find('.modal-title').text(itemName);
  $(this).find('.modal-body input').val(itemQty);
  $(this).find('.modal-footer #set-item-qty-btn').attr('data-item-index', itemIndex);
  $(this).find('.modal-footer #set-item-qty-btn').attr('data-current-qty', itemQty);

});

// Set Qty Button -- When user set the quanitty through 'Item Quantity Modal'
document.querySelector('#set-item-qty-btn').addEventListener('click', function (event) {

  // Grab the relevant item index
  const itemIndex = this.dataset.itemIndex;

  // Grab the affected receipt item
  const affectedReceiptItem = pageData.receiptItems[itemIndex];

  // Grab the quantity input value
  const qtyInput = parseInt(this.closest('.modal-content').querySelector('#qty-input--modal').value);

  updateReceiptItemQty(affectedReceiptItem, qtyInput);

});

// New Customer Form -- When user submit the new customer data
document.querySelector('#new-customer-form').addEventListener('submit', function (e) {

  // Prevent default behavior
  e.preventDefault();

  // Cache customer form inputs
  const customerFormInputs = this.elements;

  // Construct customer object from customerFormInputs value
  const newCustomer = {
    name: customerFormInputs.inputName.value,
    phone: customerFormInputs.inputPhone.value,
    address: customerFormInputs.inputAddress.value
  }

  // Push newCustomer object into pageData.customers array
  pageData.customers.push(newCustomer);

  // Reset form fields
  this.reset();

  // Render customer list to display the newly added customer
  renderCustomers();

});

// Search Customer -- When users type the search query to filter customer list
document.querySelector('#search-customer').addEventListener('keyup', function (e) {

  // Grab the search input value and turn to lowercase
  pageData.customerSearchQuery = this.value.toLowerCase();

  // Filter the customer data
  pageData.filteredCustomer = pageData.customers.filter(customer => customer.name.toLowerCase().includes(pageData.customerSearchQuery));

  // Render customers
  renderCustomers();

})

// Select Customer Button -- When user selects a customer
document.querySelector('#select-customer-btn').addEventListener('click', function (e) {

  e.preventDefault();

  // Grab the selected customer's name 
  const customerName = this.closest('#customer-select-form').elements.customerRadio.value;

  // Bailed out when there is no customer selected
  if (!customerName) return;

  // Create a deep copy of the matches customer object in the customers array
  const theCustomer = JSON.parse(JSON.stringify(pageData.customers.find(customer => customer.name === customerName)));

  // and assign the newly created copy to the pageData.selectedCustomer
  pageData.selectedCustomer = theCustomer;

  // Render the selected customer
  renderSelectedCustomer();

  $('#user-modal').modal('hide');

});

// Clear Customer Button -- When user deselects customer
document.querySelector('#clear-customer-btn').addEventListener('click', function (e) {

  e.preventDefault();

  // Grab the Customer List form radio
  const customerRadio = this.closest('#customer-select-form').elements.customerRadio;

  // Set all radio to false
  customerRadio.forEach(radio => {
    radio.checked = false;
  });

  // Clear selected customer data
  pageData.selectedCustomer = {};

  renderSelectedCustomer();

});

// Charge Button -- When user click the Charge button
document.addEventListener('click', function (e) {

  const clickedElement = e.target;

  if (!clickedElement.matches('.charge-btn') && !clickedElement.closest('.charge-btn')) return;

  if (pageData.receiptItems.length < 1) {

    // Compose Alert Modal Content
    const warningAlert = {
      icon: {
        name: `fas fa-exclamation-triangle`,
        color: `text-warning`,
        animation: `animate__shakeX`
      },
      title: 'Whoops',
      message: "You can't checkout an empty receipt."
    };

    this.querySelector('#alert-modal .modal-body').innerHTML = createAlert(warningAlert);

    // Show Alert Modal
    $('#alert-modal').modal('show');

    // Hide automatically after seconds
    setTimeout(function () {
      $('#alert-modal').modal('hide');
    }, 1500);

    return;

  }

  $('#payment-modal').modal('show');

});

// Payment Form -- When user submit payment data
document.querySelector('#payment-form').addEventListener('submit', function (e) {

  e.preventDefault();

  // Grab the received payment value
  pageData.paymentReceived = parseInt(this.querySelector('#payment-received').value);

  // Render the received payment value into Payment Success Modal
  document.querySelector('#total-paid--modal').innerHTML = pageData.paymentReceived;

  // Render the payment method into Payment Success Modal
  const selectedPaymentMethod = document.forms.paymentForm.elements.paymentRadio.value;
  document.querySelector('#payment-method--modal').innerHTML = selectedPaymentMethod;

  // Calculate the change when the payment received is greater than the current total
  if (pageData.paymentReceived > pageData.receiptTotal) {
    pageData.paymentChange = pageData.paymentReceived - pageData.receiptTotal;
    document.querySelector('#payment-effect-title').innerHTML = 'Change';
    document.querySelector('#payment-effect-amount').innerHTML = pageData.paymentChange;
  }

  // Calculate payment due
  if (pageData.receiptTotal > pageData.paymentReceived) {
    pageData.paymentDue = pageData.receiptTotal - pageData.paymentReceived;
    document.querySelector('#payment-effect-title').innerHTML = 'Payment Due';
    document.querySelector('#payment-effect-amount').innerHTML = pageData.paymentDue;
  }

  // Hide the Payment Modal
  $('#payment-modal').modal('hide');

  // Show the Loader Modal
  $('#spinner-modal').modal('show');

  // Close the Loader Modal after specific time
  setTimeout(function () {
    $('#spinner-modal').modal('hide')
  }, 1750);

  // Show the Payment Success Modal
  setTimeout(function () {
    $('#payment-success-modal').modal('show')
  }, 1800);

});

// Save Receipt Button -- When user clicks Save button
document.addEventListener('click', function (e) {

  if (!e.target.matches('.save-receipt-btn')) return;

  if (pageData.receiptItems.length < 1) {

    // Create warning alert
    const warningAlert = {
      icon: {
        name: `fas fa-exclamation-triangle`,
        color: `text-warning`,
        animation: `animate__shakeX`
      },
      title: 'Whoops',
      message: "You can't save an empty receipt."
    };

    this.querySelector('#alert-modal .modal-body').innerHTML = createAlert(warningAlert);

    // Show Alert Modal
    $('#alert-modal').modal('show');

    // Hide automatically after seconds
    setTimeout(function () {
      $('#alert-modal').modal('hide');
    }, 1500)

    return;
  }

  // Create success alert message
  const successAlert = {
    icon: {
      name: `fas fa-check-circle`,
      color: `text-primary`,
      animation: `animate__rubberBand`
    },
    title: `Congrats!`,
    message: `Receipt Saved.`
  }

  // Render alert modal
  this.querySelector('#alert-modal .modal-body').innerHTML = createAlert(successAlert);

  // Show alert modal
  $('#alert-modal').modal('show');

  // Hide automatically after seconds
  setTimeout(function () {
    $('#alert-modal').modal('hide');
  }, 1500);

  resetView();

});

// New Sale Button -- When user clicks New Sale buton
document.querySelector('#new-sale-btn').addEventListener('click', function (e) {

  resetView();

});

// Render initial state of the app
renderCustomers();
renderSelectedCustomer();
document.querySelector('#total-paid--modal').innerHTML = pageData.paymentReceived;
document.querySelector('#item-counter').innerHTML = pageData.itemCounter;