import { html, LitElement } from "lit";

class R4PlaylistTrack extends LitElement {
  static properties = {
    track: { type: Object },
  };

  constructor() {
    super();
    this.track = { id: "", title: "", url: "" };
  }

  render() {
    return html`
      <div>
        ID:
        <input
          type="text"
          .value="${this.track.id}"
          @input="${(e) => this.updateTrack("id", e.target.value)}"
        /><br />
        Title:
        <input
          type="text"
          .value="${this.track.title}"
          @input="${(e) => this.updateTrack("title", e.target.value)}"
        /><br />
        URL:
        <input
          type="text"
          .value="${this.track.url}"
          @input="${(e) => this.updateTrack("url", e.target.value)}"
        /><br />
      </div>
    `;
  }

  updateTrack(prop, value) {
    this.track = { ...this.track, [prop]: value };
    this.dispatchEvent(new CustomEvent("track-update", { detail: this.track }));
  }
}
customElements.define("r4-playlist-track", R4PlaylistTrack);
