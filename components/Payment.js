export class Payment {

  constructor(data) {
    this.received = data.received;
    this.due = data.due;
    this.change = data.change;
    this.methods = data.methods;
    this.selectedMethod = '';
    this.customer = {};
  }

  // Grab the received payment value
  setReceived(value) {
    this.received = value;
    this.renderReceived();
  }

  // Render the payment method into Payment Success Modal
  setMethod(id) {
    const selectedMethod = this.methods.find(method => method.id == id);
    document.querySelector('#payment-method--modal').innerHTML = selectedMethod.name;
  }

  proceed() {

    const afterPayment = {
      title: '',
      amount: 0,
    }

    // Calculate the change when the payment received is greater than the current total
    if (this.received > this.due) {
      afterPayment.title = 'Change';
      afterPayment.amount = this.received - this.due;
    }

    // Calculate payment due
    if (this.due > this.received) {
      afterPayment.title = 'Due';
      afterPayment.amount = this.due - this.received;
    }

    document.querySelector('#payment-effect-title').innerHTML = afterPayment.title;
    document.querySelector('#payment-effect-amount').innerHTML = afterPayment.amount;

  }

  methodTemplate(data) {
    return `
      <li class="list-group-item px-0 d-flex justify-content-between align-items-center">
        <div class="form-check form-check-inline">
          <input class="form-check-input" type="radio" name="paymentRadio" id="paymentRadio${data.id}" required=""
            value="${data.id}">
          <label class="form-check-label" for="paymentRadio${data.id}">${data.name}</label>
        </div>
      </li>
    `;
  }

  updateTotalDue(value) {
    this.due = value;
    this.renderTotalDue()
  }

  renderTotalDue() {
    document.querySelector('#payment-modal #total-due').innerHTML = this.due;
  }

  renderReceived() {
    document.querySelector('#total-paid--modal').innerHTML = this.received;
  }

  renderMethod() {
    document.querySelector('.payment-method-list').innerHTML = this.methods.map(method => this.methodTemplate(method)).join('');
  }

  reset() {
    this.received = 0;
    this.change = 0;
    this.due = 0;
    this.render();
  }

  // Render the received payment value into Payment Success Modal
  render() {
    this.renderMethod();
    this.renderTotalDue
    this.renderReceived();
  }

}