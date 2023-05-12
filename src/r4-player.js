import "radio4000-player";
import { LitElement, html } from "lit";

class R4Player extends LitElement {
  static get properties() {
    return {
      playlist: { type: Object },
    };
  }

  constructor() {
    super();
    this.playlist = null;
  }

  firstUpdated() {
    this.player = this.querySelector("radio4000-player");
    this.player.addEventListener("trackChanged", (event) => {
      console.info("trackChanged event", event.detail[0]);
    });
    this.player.addEventListener("playerReady", (event) => {
      if (this.playlist) {
        this.updatePlayer();
      }
    });
  }

  updated(changedProperties) {
    if (changedProperties.has("playlist")) {
      this.updatePlayer();
    }
  }

  updatePlayer() {
    if (
      this.playlist &&
      this.player &&
      typeof this.player.getVueInstance === "function"
    ) {
      const vue = this.player.getVueInstance();
      vue.updatePlaylist(this.playlist);
    }
  }

  render() {
    return html`
      <radio4000-player
        volume="100"
        autoplay="false"
        shuffle="false"
        r4-url="false"
        showHeader="true"
        showTracklist="true"
        showControls="true"
        hostRootUrl="https://radio4000.com"
        platform="false"
      ></radio4000-player>
    `;
  }

  /* no shadow dom */
  createRenderRoot() {
    return this;
  }
}

customElements.define("r4-player", R4Player);
