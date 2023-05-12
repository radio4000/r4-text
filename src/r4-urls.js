import { html, LitElement } from "lit";

class R4Urls extends LitElement {
  static properties = {
    textArea: { type: String },
    title: { type: String },
    image: { type: String },
    tracks: { type: Array },

    // used to populate original state
    playlist: { type: Object },
  };

  constructor() {
    super();
    this.textArea = "";
    this.tracks = [];
    this.title = "";
    this.image = "";
    this.playlist = {};
  }

  firstUpdated() {
    this.updateTextArea();
  }

  updateTextArea() {
    this.textArea = this.playlistToTextArea();
  }

  playlistToTextArea() {
    const { title, image, tracks } = this.playlist;
    let value = "";
    if (title) value += `${title}\n`;
    if (image) value += `${image}\n`;
    if (title || image) value += `\n`;
    if (tracks) value += tracks.map(this.trackToTextArea).join("\n");
    return value;
  }

  trackToTextArea(track) {
    return `${track.title}\n${track.url}\n${track.description}\n`;
  }

  render() {
    return html`
      <form>
        <textarea .value="${this.textArea}" @input="${this.onInput}"></textarea>
      </form>
    `;
  }

  onInput(event) {
    const text = event.target.value;
    this.textArea = text;
    const lines = text.split("\n");
    const { title, image } = this.parsePlaylist(lines);
    if (title) {
      this.title = title;
    }
    if (image) {
      this.image = image;
    }
    this.tracks = this.parseTracks(lines);
    this.dispatchSubmitEvent();
  }

  dispatchSubmitEvent() {
    const submitEvent = new CustomEvent("submit", {
      detail: {
        title: this.title,
        image: this.image,
        tracks: this.tracks,
      },
    });
    this.dispatchEvent(submitEvent);
  }

  parsePlaylist(lines) {
    const playlist = {};
    const firstLine = lines[0].trim();
    if (!this.isURL(firstLine) && firstLine.startsWith("# ")) {
      playlist.title = firstLine;
    }
    if (playlist.title) {
      const imageLine = lines[1].trim();
      if (this.isURL(imageLine)) {
        playlist.image = imageLine;
      }
    }
    return playlist;
  }

  parseTracks(lines) {
    const tracks = [];
    let currentTrack = null;
    const playlist = this.parsePlaylist(lines);
    const titleLine = playlist.title ? 1 : 0;
    const imageLine = playlist.image ? 1 : 0;

    for (let i = titleLine + imageLine; i < lines.length; i++) {
      const trimmedLine = lines[i].trim();

      if (this.isURL(trimmedLine)) {
        if (currentTrack) {
          tracks.push(currentTrack);
        }

        const url = trimmedLine;
        const previousLine = lines[i - 1]?.trim();
        const nextLine = lines[i + 1]?.trim();

        const title =
          previousLine && !this.isURL(previousLine) ? previousLine : "";
        const description = this.parseDescription(lines, i + 1);

        currentTrack = {
          id: i, // only used inside the app (not in the content of textarea)
          url: url,
          title: title,
          description: description,
        };
      }
    }

    if (currentTrack) {
      tracks.push(currentTrack);
    }

    return tracks;
  }

  parseDescription(lines, startIndex) {
    let description = "";
    let currentIndex = startIndex;

    while (currentIndex < lines.length) {
      const trimmedLine = lines[currentIndex].trim();

      if (this.isURL(trimmedLine) || trimmedLine === "") {
        break;
      }

      description += trimmedLine + "\n";
      currentIndex++;
    }

    return description.trim();
  }

  isURL(text) {
    try {
      new URL(text);
      return true;
    } catch (error) {
      return false;
    }
  }

  /* no shadow dom */
  createRenderRoot() {
    return this;
  }
}

customElements.define("r4-urls", R4Urls);
