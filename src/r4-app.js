// r4-manager.js
import { LitElement, html } from "lit";

class R4App extends LitElement {
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

  notify(title, body) {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  }

  loadPlaylist(event) {
    this.notify(
      "Playlist updated",
      "The playlist has been updated with new tracks."
    );
    // Pass the event to the r4-playlist component
    this.querySelector("r4-playlist").updatePlaylist(event);
  }

  loadInPlayer({ detail }) {
    this.notify(
      "Playlist loaded in player",
      "The playlist has been loaded in the player."
    );
    // Pass the event to the r4-player component
    this.querySelector("r4-player").loadPlaylist(detail);
  }

  render() {
    return html`
      <button @click="${this.requestNotificationPermission}">notify</button>
      <r4-playlist-builder
        @playlist-update="${this.loadPlaylist.bind(this)}"
      ></r4-playlist-builder>
      <r4-playlist
        @load-playlist="${this.loadInPlayer.bind(this)}"
      ></r4-playlist>
      <r4-player></r4-player>
    `;
  }
  /* no shadow dom */
  createRenderRoot() {
    return this;
  }
}

customElements.define("r4-manager", R4App);
