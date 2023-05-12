import { html, LitElement } from "lit";

class R4Playlist extends LitElement {
  static properties = {
    playlist: { type: Object },
  };

  constructor() {
    super();
    this.playlist = this.retrievePlaylist() || this.defaultPlaylist();
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("playlist-update", this.updatePlaylist);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("playlist-update", this.updatePlaylist);
  }

  defaultPlaylist() {
    return {
      title: "",
      image: "",
      tracks: [],
    };
  }

  retrievePlaylist() {
    const playlist = localStorage.getItem("playlist");
    return playlist ? JSON.parse(playlist) : null;
  }

  storePlaylist() {
    localStorage.setItem("playlist", JSON.stringify(this.playlist));
  }

  updatePlaylist(event) {
    this.playlist = {
      ...this.playlist,
      tracks: event.detail.map((url) => ({
        id: url,
        title: "",
        url: url,
      })),
    };
    this.storePlaylist();
  }

  render() {
    return html`
      <h2>
        Title:
        <input
          type="text"
          .value="${this.playlist.title}"
          @input="${(e) => this.updateTitle(e.target.value)}"
        />
      </h2>
      <p>
        Image URL:
        <input
          type="text"
          .value="${this.playlist.image}"
          @input="${(e) => this.updateImage(e.target.value)}"
        />
      </p>
      <img src="${this.playlist.image}" alt="" />
      ${this.playlist.tracks.map(
        (track, index) => html`
          <r4-playlist-track
            .track="${track}"
            @track-update="${(e) => this.updateTrack(index, e.detail)}"
          ></r4-playlist-track>
        `
      )}
      <button @click="${this.loadInPlayer}">Load in player</button>
    `;
  }

  updateTitle(newTitle) {
    this.playlist = { ...this.playlist, title: newTitle };
    this.storePlaylist();
  }

  updateImage(newImage) {
    this.playlist = { ...this.playlist, image: newImage };
    this.storePlaylist();
  }

  updateTrack(index, updatedTrack) {
    let newTracks = [...this.playlist.tracks];
    newTracks[index] = updatedTrack;
    this.playlist = { ...this.playlist, tracks: newTracks };
    this.storePlaylist();
    this.loadInPlayer(); // trigger a new load-playlist event after updating a track
  }

  loadInPlayer() {
    const loadEvent = new CustomEvent("load-playlist", {
      detail: this.playlist,
    });
    this.dispatchEvent(loadEvent);
  }

  /* no shadow dom */
  createRenderRoot() {
    return this;
  }
}

customElements.define("r4-playlist", R4Playlist);
