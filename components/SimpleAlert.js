export class SimpleAlert {

  constructor(data) {
    this.title = data.title;
    this.message = data.message;
    this.iconName = data.icon.name;
    this.iconColor = data.icon.color;
    this.iconAnimation = data.icon.animation;
  }

  // Function that construct the alert modal content
  create() {
    return `
      <i class="${this.iconName} fa-4x mb-4 ${this.iconColor} animate__animated ${this.iconAnimation}"></i>
        <h4>${this.title}</h4>
      <p class="mb-0">${this.message}</p>`;
  }

}