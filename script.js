import { Catalog } from './components/Catalog.js';
import { Receipt } from './components/Receipt.js';
import { Customer } from './components/Customer.js';
import { Payment } from './components/Payment.js';
import { SimpleAlert } from './components/SimpleAlert.js';

// Initial state of all data on the page
const payment = new Payment({
  received: 0,
  change: 0,
  due: 0,
  methods: [
    {
      id: 1,
      name: 'Cash'
    },
    {
      id: 2,
      name: 'Bank Transfer',
    },
    {
      id: 3,
      name: 'OVO'
    }
  ]
});

const catalog = new Catalog({
  items: [
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
  ],
  element: document.querySelector('#catalog')
});

const receipt = new Receipt({
  receiptItems: [],
  receiptTotalItem: 0,
  receiptDiscount: 0,
  receiptTotalDue: 0,
  element: document.querySelectorAll('.receipt-list-group')
});

const customer = new Customer({
  customers: [
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
  ],
  element: document.querySelector('#customer-list')
});

/**
 * ALL EVENTS
 * 
 * The code below are the ones that responsible to handle each user interaction 
 */

// Catalog Search Bar -- When user types the search query to filter catalog
document.querySelector('#search-catalog').addEventListener('keyup', event => { catalog.filter(event.target.value) });

// Catalog Item -- When user click at each catalog item
document.querySelector('#catalog').addEventListener('click', event => {

  // Target the selected item (clicked list)
  let clickedElement = event.target;

  // If the clicked element is not a catalog-item and not the childern of catalog-item then bailed out 
  if (!clickedElement.matches('.catalog-item') && !clickedElement.closest('.catalog-item')) return;

  // Grab the clicked catalog item's id
  const catalogItemId = clickedElement.dataset.catalogId || clickedElement.closest('.catalog-item').dataset.catalogId;

  // Grab full catalog item object
  const selectedCatalogItem = catalog.findItemById(catalogItemId);

  // Add the selected catalog item to receipt
  receipt.add(selectedCatalogItem);

  // Decrease its stock
  catalog.updateItemStock(catalogItemId, -1, 'step');

  // Update payment total
  payment.updateTotalDue(receipt.totalDue);

});

// Receipt Items -- When user click plus/minus quantity button
document.addEventListener('click', function (e) {

  // Target the clicked element
  const clickedElement = e.target;

  // Bailed out if it's not inside .receipt-list-group
  if (!clickedElement.closest('.receipt-list-group')) return;

  // Bailed out when user click element other than the quantity button
  if (!clickedElement.matches('.qty-btn') && !clickedElement.matches('.fas')) return;

  // Grab the index of the respective item
  let itemId = clickedElement.closest('.list-group-item').dataset.itemId;

  // If it's the minus button, decrement the quantity
  // NOTE: Since the button consist of a button and an icon inside it 
  // and the click can happen at either of them then we need to target both
  if (clickedElement.matches('.fa-minus') || clickedElement.matches('.qty-btn-minus')) {

    // Decrease receipt item's quantity
    receipt.updateItemQty(itemId, -1, 'step');
    // Increase catalog item's stock
    catalog.updateItemStock(itemId, 1, 'step');
    // Update payment total
    payment.updateTotalDue(receipt.totalDue);

  };

  // If it's the plus button, increment 
  if (clickedElement.matches('.fa-plus') || clickedElement.matches('.qty-btn-plus')) {

    // Increase receipt item's qty
    receipt.updateItemQty(itemId, 1, 'step');
    // Decrease catalog item's stock
    catalog.updateItemStock(itemId, -1, 'step');
    // Update payment total
    payment.updateTotalDue(receipt.totalDue);

  }

});

// Receipt Items -- Mobile -- When user inputs the quantity
document.querySelector('#mobile-receipt').addEventListener('input', function (e) {

  // Grab the Targeted Input
  const theQtyInput = e.target;

  // Grab the relevant item id
  const itemId = theQtyInput.closest('.list-group-item').dataset.itemId;

  // Grab the affected receipt item
  const theItem = receipt.findById(itemId);

  if (isNaN(parseInt(theQtyInput.value))) return

  receipt.updateItemQty(itemId, parseInt(theQtyInput.value))

  // Grab the initial catalog item's stock from the receipt item and decrease it by the current receipt item qty
  const newCatalogStock = theItem.stock - theItem.qty;

  // Set new catalog item's stock;
  catalog.setCatalogStock(itemId, newCatalogStock)

  // Update payment total
  payment.updateTotalDue(receipt.totalDue);

});

// Receipt Items -- Mobile -- When user click on quantity input
document.addEventListener('focusin', function (e) {

  if (!e.target.matches('input[type=number]')) return;

  e.target.select();

});

// Receipt Items -- Mobile -- When user click on quantity input
document.querySelector('#mobile-receipt').addEventListener('focusout', function (e) {

  if (!e.target.matches('input[type=number]')) return;

  receipt.render();

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

  // Grab the value of discount input
  receipt.setDiscount(parseInt(discountInput.value))

  // Update payment total
  payment.updateTotalDue(receipt.totalDue);

});

// Item Qty Modal -- When 'Item Quantity Modal' is shown
$('#item-qty-modal').on('show.bs.modal', function (event) {

  // Grab the button that triggered the modal
  const button = $(event.relatedTarget)

  // Extract the data
  const itemId = button.parents('.list-group-item').data('item-id');
  const itemQty = button.data('qty');
  const itemName = button.data('title');

  // Render the data into each respective element
  $(this).find('.modal-title').text(itemName);
  $(this).find('.modal-body input').val(itemQty);
  $(this).find('.modal-footer #set-item-qty-btn').attr('data-item-id', itemId);
  $(this).find('.modal-footer #set-item-qty-btn').attr('data-current-qty', itemQty);

});

// Set Qty Button -- When user set the quanitty through 'Item Quantity Modal'
document.querySelector('#set-item-qty-btn').addEventListener('click', function (event) {

  // Grab the relevant item index
  const itemId = this.dataset.itemId;

  // Grab the quantity input value
  const qtyInput = parseInt(this.closest('.modal-content').querySelector('#qty-input--modal').value);

  receipt.updateItemQty(itemId, qtyInput);

  // Calculate new catalog item's value
  const newStock = receipt.findById(itemId).stock - qtyInput;
  catalog.updateItemStock(itemId, newStock);

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
  customer.customers.push(newCustomer);

  // Reset form fields
  this.reset();

  // Render customer list to display the newly added customer
  customer.render();

});

// Search Customer -- When users type the search query to filter customer list
document.querySelector('#search-customer').addEventListener('keyup', event => { customer.filter(event.target.value) })

// Select Customer Button -- When user selects a customer
document.querySelector('#select-customer-btn').addEventListener('click', function (e) {

  e.preventDefault();

  // Grab the selected customer's name 
  const customerName = this.closest('#customer-select-form').elements.customerRadio.value;

  // Bailed out when there is no customer selected
  if (!customerName) return;

  customer.selectCustomer(customerName);

  $('#user-modal').modal('hide');

});

// Clear Customer Button -- When user deselects customer
document.querySelector('#clear-customer-btn').addEventListener('click', event => {

  event.preventDefault();

  customer.resetSelected()

});

// Charge Button -- When user click the Charge button
document.addEventListener('click', function (e) {

  const clickedElement = e.target;

  if (!clickedElement.matches('.charge-btn') && !clickedElement.closest('.charge-btn')) return;

  if (receipt.items.length < 1) {

    // Compose Alert Modal Content
    const warningAlert = {
      icon: {
        name: `fas fa-exclamation-triangle`,
        color: `text-warning`,
        animation: `animate__shakeX`
      },
      title: 'Whoops',
      message: "You can't checkout an empty receipt.",
    };

    this.querySelector('#alert-modal .modal-body').innerHTML = new SimpleAlert(warningAlert).create();

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

  payment.setReceived(parseInt(this.querySelector('#payment-received').value));

  // Render the payment method into Payment Success Modal
  const selectedPaymentMethod = document.forms.paymentForm.elements.paymentRadio.value;
  payment.setMethod(selectedPaymentMethod);

  payment.proceed();

  payment.render();

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

  if (receipt.items.length < 1) {

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

    this.querySelector('#alert-modal .modal-body').innerHTML = new SimpleAlert(warningAlert).create();

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
  this.querySelector('#alert-modal .modal-body').innerHTML = new SimpleAlert(successAlert).create();

  // Show alert modal
  $('#alert-modal').modal('show');

  // Hide automatically after seconds
  setTimeout(function () {
    $('#alert-modal').modal('hide');
  }, 1500);

  receipt.reset();
  payment.reset();
  customer.resetSelected();

});

// New Sale Button -- When user clicks New Sale buton
document.querySelector('#new-sale-btn').addEventListener('click', function (e) {

  receipt.reset();
  payment.reset();
  customer.resetSelected();

});

// Render initial state of the app
catalog.render();
receipt.render();
customer.render();
customer.renderSelected();
payment.render();