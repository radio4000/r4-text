import { LitElement, html } from "lit";

class R4Notification extends LitElement {
  static properties = {
    permissionRequested: { type: Boolean },
  };

  constructor() {
    super();
    this.permissionRequested = false;
  }

  requestNotificationPermission() {
    if (!this.permissionRequested) {
      Notification.requestPermission().then((result) => {
        console.log(`Notification permission: ${result}`);
      });
      this.permissionRequested = true;
    }
  }

  render() {
    return html`
      <button @click="${this.requestNotificationPermission}">
        ${this.permissionRequested
          ? "Cancel Notification"
          : "Allow Notification"}
      </button>
    `;
  }
}

customElements.define("r4-notification", R4Notification);
