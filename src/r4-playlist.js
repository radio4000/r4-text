import { html, LitElement } from "lit";

class R4Playlist extends LitElement {
  static properties = {
    playlist: { type: Object },
  };

  constructor() {
    super();
    this.playlist = this.defaultPlaylist();
  }

  defaultPlaylist() {
    return {
      title: "",
      image: "",
      tracks: [],
    };
  }

  updatePlaylist(event) {
    const tracks = event.detail || []; // Ensure tracks is an array
    this.playlist = {
      ...this.playlist,
      tracks: tracks.map((url) => ({
        id: url,
        title: "",
        url: url,
      })),
    };
  }

  render() {
    return html`
      <h2>
        Title:
        <input
          type="text"
          .value="${this.playlist?.title || ""}"
          @input="${(e) =>
            (this.playlist = {
              ...this.playlist,
              title: e.target.value,
            })}"
        />
      </h2>
      <p>
        Image URL:
        <input
          type="text"
          .value="${this.playlist?.image || ""}"
          @input="${(e) =>
            (this.playlist = {
              ...this.playlist,
              image: e.target.value,
            })}"
        />
      </p>
      <img
        style="max-width: 5rem;"
        src="${this.playlist?.image || ""}"
        alt=""
      />
      <ol>
        ${(this.playlist?.tracks || []).map(
          (track, index) => html`
            <li>
              <r4-playlist-track
                .track="${track}"
                @track-update="${(e) => this.updateTrack(index, e.detail)}"
              ></r4-playlist-track>
            </li>
          `
        )}
      </ol>
      <button @click="${this.loadInPlayer}">Load in player</button>
    `;
  }

  updateTrack(index, updatedTrack) {
    let newTracks = [...(this.playlist?.tracks || [])];
    newTracks[index] = updatedTrack;
    this.playlist = { ...this.playlist, tracks: newTracks };
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
