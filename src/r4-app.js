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
    this.playlist = this.retrievePlaylistFromURL() || this.defaultPlaylist();
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
    console.log("load media url", detail);
    this.notify(
      "Playlist updated",
      "The playlist has been updated with new tracks."
    );
    // Update playlist
    const updatedTracks = detail.filter((newTrack) => {
      return !this.playlist.tracks.some((track) => track.id === newTrack.id);
    });
    const updatedPlaylist = {
      ...this.playlist,
      tracks: [...this.playlist.tracks, ...updatedTracks],
    };
    this.updatePlaylist(updatedPlaylist);
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
      <details open>
        <summary>Settings</summary>
        <r4-notification></r4-notification>
      </details>
      <details open>
        <summary>Tracks</summary>
        <r4-playlist-urls
          .tracks="${this.playlist ? this.playlist.tracks : []}"
          @submit="${this.loadMediaUrls}"
        ></r4-playlist-urls>
      </details>
      <details open>
        <summary>Playlist</summary>
        <r4-playlist
          .playlist="${this.playlist}"
          @load-playlist="${this.loadInPlayer}"
        ></r4-playlist>
      </details>
      <details open>
        <summary>Player</summary>
        <r4-player></r4-player>
      </details>
    `;
  }

  /* no shadow dom */
  createRenderRoot() {
    return this;
  }
}

customElements.define("r4-manager", R4App);
