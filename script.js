// Initial state of all data on the page
const pageData = {
  catalogItems: [
    {
      title: 'Ripe Banana',
      stock: 150,
      price: 12500
    },
    {
      title: 'Fresh Apple',
      stock: 75,
      price: 6500
    },
    {
      title: 'Juicy Orange',
      stock: 100,
      price: 7500
    },
    {
      title: 'Giant Mango',
      stock: 5,
      price: 25000
    },
    {
      title: 'Seedless Guava',
      stock: 15,
      price: 45000
    },
    {
      title: 'Creamy Durian',
      stock: 77,
      price: 12000
    },
    {
      title: 'Sweety Grape',
      stock: 35,
      price: 22000
    },
    {
      title: 'Tasty Pear',
      stock: 0,
      price: 5000
    },
  ],
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
  filteredCustomer: [],
  selectedCustomer: {},
  filteredCatalog: [],
  receiptItems: [],
  itemCounter: 0,
  receiptDiscount: 0,
  receiptTotal: 0,
  paymentReceived: 0,
  paymentChange: 0,
  paymentDue: 0,
}

/**
 * RENDER / UI RELATED FUNCTIONS
 * 
 * These group of functions are used to handle the representation of data
 * Such as generating a markup list of data, injecting markup into the dom, etc
 */

// The function that render catalogItems data into Catalog Item markup
function renderCatalog() {

  // Grab the search catalog input value
  const searchQuery = document.querySelector('#search-catalog').value.toLowerCase();

  // Use the filteredCatalog instead when user type search query
  const catalogData = pageData.filteredCatalog.length == 0 && !searchQuery ? pageData.catalogItems : pageData.filteredCatalog;

  // Transform catalog item data into catalog item markup
  const catalogItemMarkup = catalogData.map(function (catalogItem, index) {

    const isDisabled = catalogItem.stock === 0 ? 'disabled' : '';

    return `<a href="#" class="catalog-item list-group-item list-group-item-action px-0 d-flex flex-wrap align-items-center ${isDisabled}" data-catalog-index="${index}">
              <span class="mr-4"><i class="fas fa-fw fa-gift fa-2x"></i></span>
              <div>
                <p>${catalogItem.title}</p>
                <p class="text-muted">Stock: ${catalogItem.stock}pcs</p>
              </div>
              <p class="ml-auto">${catalogItem.price}</p>
            </a>`;

  }).join('');

  document.querySelector('#catalog').innerHTML = catalogItemMarkup;
}

// The function that render receiptItems array into a markup of receipt list item
function renderReceipt() {

  // Turn receiptItems into receipt list item markup
  const receiptListMarkup = pageData.receiptItems.map(function (receiptItem, index) {

    return `<li data-item-index="${index}" class="list-group-item pl-1 pr-2 d-flex justify-content-between align-items-center">
              <p class="receipt-item-name">${receiptItem.title}</p>
              <div class="receipt-item-action d-flex justify-content-between align-items-center">
                <button class="btn btn-light btn-sm rounded-circle qty-btn qty-btn-minus d-none d-md-block">
                  <i class="fas fa-minus"></i>
                </button>
                <p class="mx-2 d-none d-md-block" data-toggle="modal" data-target="#item-qty-modal" data-title="${receiptItem.title}" data-qty="${receiptItem.qty}">${receiptItem.qty}</p>
                <input type="number" class="mobile-qty-input form-control d-md-none" value="${receiptItem.qty}" data-current-qty="${receiptItem.qty}">
                <button class="btn btn-light btn-sm rounded-circle qty-btn qty-btn-plus d-none d-md-block">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
              <p class="receipt-item-total text-right">${receiptItem.total}</p>
            </li>`

  }).join('');

  // Render the list markup into its place
  const allReceiptList = document.querySelectorAll('.receipt-list-item');

  allReceiptList.forEach(function (receiptList) {
    receiptList.innerHTML = receiptListMarkup;
  });

  // Render the discount
  renderDiscount();

  // Render total at checkout
  renderTotal();

}

// The function that render customer list
function renderCustomers() {

  const customerList = pageData.filteredCustomer.length !== 0 ? pageData.filteredCustomer : pageData.customers;

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

// The function that render total
function renderTotal() {

  // Grab all total-due element
  const allTotalDue = document.querySelectorAll('.total-due');

  // Render total to all Total Due element
  allTotalDue.forEach(function (totalDue) {
    totalDue.innerHTML = pageData.receiptTotal;
  });

}

// The function that render discount line
function renderDiscount() {

  const allDiscountLine = document.querySelectorAll('.discount-line');
  const allDiscountInput = document.querySelectorAll('.discount-input');

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

// The function that push selected catalog item data into receiptItems array
function addToReceipt(catalogItem) {

  // Check whether the incoming catalogItem is already in the receiptItems array
  // by using the catalog title as 'filter' on array.find() method 
  let existingReceiptItem = pageData.receiptItems.find(receiptItem => receiptItem.title === catalogItem.title);

  // If array.find() found the same title, then the item must be already in the receiptItems array
  if (existingReceiptItem) {
    // In that case, we want to increment the quantity of that item by 1
    existingReceiptItem.qty++;
    // And update the total my multiplying its new quantity with its price
    existingReceiptItem.total = existingReceiptItem.qty * parseInt(existingReceiptItem.price);
    // Update the total
    pageData.receiptTotal = calcTotalDue();
    // Update the item counter
    pageData.itemCounter = calcTotalItem();

    // Then bailed out
    return;

  }

  // Add total key to catalogItem 
  // and fill it (as the name suggest) with the multiplication of its quantity and its price
  catalogItem.total = catalogItem.qty * parseInt(catalogItem.price);

  // Push the catalogItem into receiptItems array
  pageData.receiptItems.push(catalogItem);

  // Update the item counter
  pageData.itemCounter = calcTotalItem();

  // Update the total
  pageData.receiptTotal = calcTotalDue();

}

// The function that count the total of all receipt item quantity
function calcTotalItem() {

  // Return the sum all the total of each item 
  return pageData.receiptItems.reduce(function (acc, receiptItem) {
    return acc + receiptItem.qty
  }, 0);

}

// The function that calculate checkout total
function calcTotalDue() {

  // Return the sum of each item's total
  return pageData.receiptItems.reduce(function (acc, receiptItem) {
    return acc + receiptItem.total
  }, 0);

}

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

// Catalog Search Bar -- When user types the search query to filter catalog
document.querySelector('#search-catalog').addEventListener('keyup', function (e) {

  // Grab the search input value and turn to lowercase
  const searchQuery = this.value.toLowerCase();

  // Filter the catalogItem data
  pageData.filteredCatalog = pageData.catalogItems.filter(catalogItem => catalogItem.title.toLowerCase().includes(searchQuery));

  // Render Catalog
  renderCatalog();

});

// Catalog Item -- When user click at each catalog item
document.querySelector('#catalog').addEventListener('click', function (e) {

  // Target the selected item (clicked list)
  let clickedElement = e.target;

  // If the clicked element is not a catalog-item and not the childern of catalog-item then bailed out 
  if (!clickedElement.matches('.catalog-item') && !clickedElement.closest('.catalog-item')) {
    return
  }

  // Grab the catalog item object by its index
  const catalogItemIndex = clickedElement.dataset.catalogIndex || clickedElement.closest('.catalog-item').dataset.catalogIndex;
  const selectedCatalogItem = pageData.catalogItems[catalogItemIndex];

  // Decrement the selected catalog item stock by 1
  selectedCatalogItem.stock--;

  // Render the catalog to reflect change on the selected catalog stock
  renderCatalog();

  // Create a receipt item object by deep copying the selectedCatalogItem
  const receiptItem = JSON.parse(JSON.stringify(selectedCatalogItem));

  // Assign default receipt quantity to the newly created receipt item
  receiptItem.qty = 1;

  // Add item to receiptItems array 
  addToReceipt(receiptItem);

  // Render Total Item
  document.querySelector('#item-counter').innerHTML = pageData.itemCounter;

  // Render receiptItems array into list of receipt item
  renderReceipt()

});

// Receipt Items -- When user click plus/minus quantity button
document.addEventListener('click', function (e) {

  // Target the clicked element
  const clickedElement = e.target;

  // Bailed out when user click element other than the quantity button
  if (!clickedElement.matches('.qty-btn') && !clickedElement.matches('.fas')) return;

  // Grab the index of the respective item
  let itemIndex = clickedElement.closest('.list-group-item').dataset.itemIndex;

  // Grab the receipt item itself
  const affectedReceiptItem = pageData.receiptItems[itemIndex];

  // Find the affected catalog item by title
  const affectedCatalogItem = pageData.catalogItems.find(catalogItem => catalogItem.title === affectedReceiptItem.title);

  // If it's the minus button, decrement the quantity
  // NOTE: Since the button consist of a button and an icon inside it 
  // and the click can happen at either of them then we need to target both
  if (clickedElement.matches('.fa-minus') || clickedElement.matches('.qty-btn-minus')) {

    // Decrement the actual quantity at receiptItems
    affectedReceiptItem.qty--;

    // Increment the affected catalog item stock by 1
    affectedCatalogItem.stock++;

    // Render the catalog to reflect the change on selected catalog stock
    renderCatalog();

    // Update the item counter
    pageData.itemCounter = calcTotalItem();

    // Render Total Item
    document.querySelector('#item-counter').innerHTML = pageData.itemCounter;

    // When the item quantity reach 0,
    if (affectedReceiptItem.qty === 0) {

      // remove from the recipt
      pageData.receiptItems.splice(itemIndex, 1);

      // Update the total Due
      pageData.receiptTotal = calcTotalDue();

      // Update the item counter
      pageData.itemCounter = calcTotalItem();

      // Render Total Item
      document.querySelector('#item-counter').innerHTML = pageData.itemCounter;

      // Render the total
      renderReceipt();

    }

    // When the receipt is empty
    if (pageData.receiptItems.length < 1) {

      // Set the receipt discount to 0 
      pageData.receiptDiscount = 0;

      // Render
      renderDiscount();

      // bailed out
      return;

    }

    // Update item total
    affectedReceiptItem.total = affectedReceiptItem.qty * affectedReceiptItem.price;

    // Render the total
    pageData.receiptTotal = calcTotalDue();

    // Refresh receipt
    renderReceipt();

  };

  // If it's the plus button, increment 
  if (clickedElement.matches('.fa-plus') || clickedElement.matches('.qty-btn-plus')) {

    // Decrement the actual quantity at receiptItems
    affectedReceiptItem.qty++;

    // Increment the affected catalog item stock by 1
    affectedCatalogItem.stock--;

    // Render the catalog to reflect the change on selected catalog stock
    renderCatalog();

    // Update the item counter
    pageData.itemCounter = calcTotalItem();
    // Render Total Item
    document.querySelector('#item-counter').innerHTML = pageData.itemCounter;

    // Update item total
    affectedReceiptItem.total = affectedReceiptItem.qty * affectedReceiptItem.price;

    // Update the total
    pageData.receiptTotal = calcTotalDue();

    // Render receipt
    renderReceipt();
  }

});

// Receipt Items -- Mobile -- When user inputs the quantity
document.querySelector('#mobile-receipt').addEventListener('input', function (e) {

  // Grab the Targeted Input
  const theQtyInput = e.target;

  // Grab the relevant item index
  const itemIndex = theQtyInput.closest('.list-group-item').dataset.itemIndex;

  // Grab current item qty (before modified by the user)
  const currentQty = parseInt(theQtyInput.dataset.currentQty);

  // Grab the affected receipt item
  const affectedReceiptItem = pageData.receiptItems[itemIndex];

  // Grab the affected catalog item
  const affectedCatalogItem = pageData.catalogItems.find(catalogItem => catalogItem.title === affectedReceiptItem.title);

  // When the user insert 0 or leave the input blank,
  if (parseInt(theQtyInput.value) === 0) {

    // remove the respective item from the reciptItem array
    pageData.receiptItems.splice(itemIndex, 1);

    // Update the total
    pageData.receiptTotal = calcTotalDue();

    // Render the change
    renderReceipt();

    // Update the item counter
    pageData.itemCounter = calcTotalItem();
    // Render Total Item
    document.querySelector('#item-counter').innerHTML = pageData.itemCounter;

    // Update the affected catalog item's stock
    affectedCatalogItem.stock = affectedCatalogItem.stock + currentQty;

    // Render the new catalog item's stock
    renderCatalog();

  }

  // When the receipt is empty
  if (pageData.receiptItems.length < 1) {

    // Set the receipt discount to 0 
    pageData.receiptDiscount = 0;

    // Render
    renderDiscount();

    // bailed out
    return;

  }

  // Update the relevant item quantity at receiptItems with user inputed value
  affectedReceiptItem.qty = parseInt(theQtyInput.value);

  // Update the affected catalog item's stock
  affectedCatalogItem.stock = affectedCatalogItem.stock + currentQty - affectedReceiptItem.qty;

  // Render the new catalog item's stock
  renderCatalog();

  // Update the item counter
  pageData.itemCounter = calcTotalItem();
  // Render Total Item
  document.querySelector('#item-counter').innerHTML = pageData.itemCounter;


  // Update the total by multiplying the new quantity with its price
  affectedReceiptItem.total = affectedReceiptItem.qty * affectedReceiptItem.price;

  // Render the total
  pageData.receiptTotal = calcTotalDue();

  // Refresh the receipt
  renderReceipt();

});

// Discount Button -- When user clicks Apply Discount
document.addEventListener('click', function (e) {

  // Get the clicked element
  const clickedElement = e.target;

  // If not Apply Discount button, then bailed out
  if (!clickedElement.matches('.apply-discount-btn')) return;

  // Get the respective discount input
  const discountInput = clickedElement.nextElementSibling;

  // Grab the value of discount input
  pageData.receiptDiscount = parseInt(discountInput.value);

  // Calculate total after discount
  pageData.receiptTotal -= pageData.receiptDiscount;

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

  // Grab current item qty (before modified by the user)
  const currentQty = parseInt(this.dataset.currentQty);

  // Grab the quantity input value
  const qtyInput = parseInt(this.closest('.modal-content').querySelector('#qty-input--modal').value);

  // Grab the affected receipt item
  const affectedReceiptItem = pageData.receiptItems[itemIndex];

  // Grab the affected catalog item
  const affectedCatalogItem = pageData.catalogItems.find(catalogItem => catalogItem.title === affectedReceiptItem.title);

  // When the user insert 0,
  if (qtyInput === 0 || isNaN(qtyInput)) {

    // remove the respective item from the reciptItem array
    pageData.receiptItems.splice(itemIndex, 1);

    // Update the total
    pageData.receiptTotal = calcTotalDue();

    // Render the change
    renderReceipt();

    // Update the item counter
    pageData.itemCounter = calcTotalItem();

    // Render Total Item
    document.querySelector('#item-counter').innerHTML = pageData.itemCounter;

    // Update the affected catalog item's stock
    affectedCatalogItem.stock = affectedCatalogItem.stock + currentQty;

    // Render the new catalog item's stock
    renderCatalog();

    // bailed out
    return;
  }

  // Update the relevant item quantity at receiptItems with user inputed value
  affectedReceiptItem.qty = qtyInput;

  // Update the affected catalog item's stock
  affectedCatalogItem.stock = affectedCatalogItem.stock + currentQty - affectedReceiptItem.qty;

  // Render the new catalog item's stock
  renderCatalog();

  // Update the item counter
  pageData.itemCounter = calcTotalItem();
  // Render Total Item
  document.querySelector('#item-counter').innerHTML = pageData.itemCounter;

  // Update the total by multiplying the new quantity with its price
  affectedReceiptItem.total = affectedReceiptItem.qty * parseInt(affectedReceiptItem.price);

  // Render the total
  pageData.receiptTotal = calcTotalDue();

  // Refresh the receipt
  renderReceipt();

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
  const searchQuery = this.value.toLowerCase();

  // Filter the customer data
  pageData.filteredCustomer = pageData.customers.filter(customer => customer.name.toLowerCase().includes(searchQuery));

  // Render customers
  renderCustomers();

})

// Select Customer Button -- When user selects a customer
document.querySelector('#select-customer-btn').addEventListener('click', function (e) {

  e.preventDefault();

  // Grab the selected customer's name 
  const customerName = this.closest('#customer-select-form').elements.customerRadio.value;

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
    document.querySelector('#payment-change').innerHTML = pageData.paymentChange;
  }

  // Calculate payment due
  if (pageData.receiptTotal > pageData.paymentReceived) {
    pageData.paymentDue = pageData.receiptTotal - pageData.paymentReceived;
    document.querySelector('#payment-due--modal').innerHTML = pageData.paymentDue;
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
renderCatalog();
renderCustomers();
renderSelectedCustomer();
renderTotal();
renderDiscount();
document.querySelector('#payment-change').innerHTML = pageData.paymentChange;
document.querySelector('#payment-due--modal').innerHTML = pageData.paymentDue;
document.querySelector('#total-paid--modal').innerHTML = pageData.paymentReceived;
document.querySelector('#item-counter').innerHTML = pageData.itemCounter;