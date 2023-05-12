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

  render() {
    return html`
      <h2>Title: ${this.playlist?.title || ""}</h2>
      <img
        style="max-width: 5rem;"
        src="${this.playlist?.image || ""}"
        alt=""
      />
      <ol>
        ${(this.playlist?.tracks || []).map(
          (track, index) => html`
            <li>
              <r4-playlist-track .track="${track}"></r4-playlist-track>
            </li>
          `
        )}
      </ol>
    `;
  }

  /* no shadow dom */
  createRenderRoot() {
    return this;
  }
}

customElements.define("r4-playlist", R4Playlist);
