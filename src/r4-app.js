import { LitElement, html } from "lit";

class R4App extends LitElement {
  static properties = {
    playlist: { type: Object },
  };

  constructor() {
    super();
    this.playlist = this.retrievePlaylistFromURL() || this.defaultPlaylist();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("popstate", this.handlePopstate);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("popstate", this.handlePopstate);
  }

  handlePopstate = () => {
    const playlist = this.retrievePlaylistFromURL();
    if (playlist) {
      this.playlist = playlist;
    } else {
      this.playlist = this.defaultPlaylist();
    }
  };

  retrievePlaylistFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("playlist")) {
      const playlist = urlParams.get("playlist");
      return JSON.parse(decodeURIComponent(playlist));
    }
    return null;
  }

  defaultPlaylist() {
    return {
      title: "",
      image: "",
      tracks: [],
    };
  }

  notify(title, body) {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  }

  loadMediaUrls(event) {
    const { detail } = event;
    const { title, image, tracks } = detail;
    this.updatePlaylist({ title, image, tracks });
  }

  updatePlaylist(updatedPlaylist) {
    this.playlist = updatedPlaylist;
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(
      "playlist",
      encodeURIComponent(JSON.stringify(updatedPlaylist))
    );
    window.history.replaceState({}, "", "?" + urlParams.toString());
  }

  render() {
    return html`
      <details open>
        <summary>Tracks</summary>
        <r4-urls
          .playlist=${this.playlist}
          @submit=${this.loadMediaUrls}
        ></r4-urls>
      </details>
      <details open>
        <summary>Playlist</summary>
        <r4-playlist .playlist="${this.playlist}"></r4-playlist>
      </details>
      <details open>
        <summary>Player</summary>
        <r4-player .playlist=${this.playlist}></r4-player>
      </details>
    `;
  }

  /* no shadow dom */
  createRenderRoot() {
    return this;
  }
}

customElements.define("r4-text", R4App);
``;
