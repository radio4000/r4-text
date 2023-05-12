import { html, LitElement } from "lit";

class R4PlaylistUrls extends LitElement {
  static properties = {
    textArea: { type: String },
    tracks: { type: Array },
  };

  constructor() {
    super();
    this.textArea = "";
    this.tracks = [];
  }

  firstUpdated() {
    if (this.tracks.length) {
      this.updateTextArea();
    }
  }

  updateTextArea() {
    this.textArea = this.tracksToTextArea();
  }

  tracksToTextArea() {
    return this.tracks.map((track) => track.url).join("\n");
  }

  render() {
    return html`
      <form>
        <textarea .value="${this.textArea}" @input="${this.onInput}"></textarea>
        <input type="submit" id="submitButton" @click="${this.onSubmit}" />
      </form>
    `;
  }

  onInput(event) {
    this.textArea = event.target.value;
  }

  async onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    const lines = this.textArea.split("\n");

    const fetchPromises = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      try {
        const { href: url } = new URL(line);
        fetchPromises.push(
          fetchAndParse(url).then((title) => {
            const id = generateTrackId(i, url);
            return { id, title, url };
          })
        );
      } catch (error) {
        // Ignore invalid URLs
      }
    }

    const tracks = await Promise.all(fetchPromises);
    this.tracks = tracks;

    const submitUrls = new CustomEvent("submit", {
      detail: this.tracks,
    });
    this.dispatchEvent(submitUrls);
  }

  /* no shadow dom */
  createRenderRoot() {
    return this;
  }
}

customElements.define("r4-playlist-urls", R4PlaylistUrls);

async function fetchAndParse(url) {
  try {
    const response = await fetch(url);
    let title = "";
    if (response.ok) {
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const titleElement = doc.querySelector("title");
      title = titleElement ? titleElement.textContent : "";
    }
    return title;
  } catch (error) {
    return "";
  }
}

function generateTrackId(index, url) {
  const encodedIndex = btoa(index);
  const encodedUrl = btoa(url);
  return `${encodedIndex}-${encodedUrl}`;
}
