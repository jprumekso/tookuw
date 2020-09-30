export class Customer {

  constructor(data) {
    this.customers = data.customers;
    this.filteredCustomer = [];
    this.searchQuery = '';
    this.selectedCustomer = {};
    this.element = data.element;
  }

  template(data, index) {
    return `
      <li class="list-group-item px-0 d-flex justify-content-between align-items-center">
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="customerRadio" id="customer-${index}" value="${data.name}">
          <label class="form-check-label" for="customer-${index}">${data.name}</label>
        </div>
      </li>
    `;
  }

  filter(value) {
    this.searchQuery = value.toLowerCase();
    this.filteredCustomer = this.customers.filter(customer => customer.name.toLowerCase().includes(this.searchQuery))
    this.render();
  }

  selectCustomer(name) {

    // and assign the newly created copy to the pageData.selectedCustomer
    this.selectedCustomer = this.customers.find(customer => customer.name === name)

    // Render the selected customer
    this.renderSelected();

  }

  resetSelected() {

    // Grab the Customer List form radio
    const customerRadio = document.querySelector('#customer-select-form').elements.customerRadio;

    // Set all radio to false
    customerRadio.forEach(radio => {
      radio.checked = false;
    });

    // Clear selected customer data
    this.selectedCustomer = {};

    this.renderSelected();

  }

  // The function that render customer list
  render() {

    // Use the filteredCatalog instead when user type search query
    const theData = this.filteredCustomer.length == 0 && !this.searchQuery ? this.customers : this.filteredCustomer;

    // Turn customers data into customer list
    this.element.innerHTML = theData.map((customer, index) => { return this.template(customer, index) }).join('');
  }

  isSelected() {
    return Object.entries(this.selectedCustomer).length !== 0;
  }

  // The function that render the selected customer
  renderSelected() {

    // Grab the 'From' line at the Payment Success modal
    const fromCustomer = document.querySelector('#from-customer--modal');

    // Grab the add customer modal
    const allAddCustomerBtn = document.querySelectorAll('.add-customer-btn');

    // Assign the name or '-' to the From line
    fromCustomer.innerHTML = this.isSelected() ? this.selectedCustomer.name : '-';

    // Change User Plus icon to User Checked
    allAddCustomerBtn.forEach(addCustomerBtn => {
      addCustomerBtn.innerHTML = this.isSelected() ? '<i class="fas fa-user-check text-success"></i>' : '<i class="fas fa-user-plus"></i>';
    });

  }

}