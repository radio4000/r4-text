import { html, LitElement } from "lit";

class R4PlaylistTrack extends LitElement {
  static properties = {
    track: { type: Object },
  };

  constructor() {
    super();
    this.track = { id: "", title: "", url: "", description: "" };
  }

  render() {
    return html`
      <article>
        <dl>
          <dt>
            <a href="${this.track.url}">${this.track.title}</a>
          </dt>
          <dd>${this.track.description}</dd>
        </dl>
      </article>
    `;
  }
}

customElements.define("r4-playlist-track", R4PlaylistTrack);
