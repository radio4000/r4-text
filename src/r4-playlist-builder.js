import { html, LitElement } from "lit";

class R4PlaylistBuilder extends LitElement {
  static properties = {
    textArea: { type: String },
    validUrls: { type: Array },
  };

  constructor() {
    super();
    this.textArea = localStorage.getItem("textArea") || "";
    this.validUrls = JSON.parse(localStorage.getItem("validUrls")) || [];
  }

  firstUpdated() {
    if (this.textArea !== "" || this.validUrls.length > 0) {
      this.submitForm();
    }
  }

  render() {
    return html`
      <form>
        <textarea
          id="textArea"
          rows="3"
          cols="50"
          .value="${this.textArea}"
          @input="${this.onInput}"
        ></textarea>
        <input type="submit" id="submitButton" @click="${this.onSubmit}" />
      </form>
    `;
  }

  onInput(event) {
    this.textArea = event.target.value;
    localStorage.setItem("textArea", this.textArea);
    const lines = this.textArea.split("\n");
    this.validUrls = lines.filter((l) => {
      try {
        new URL(l);
        return true;
      } catch (e) {
        return false;
      }
    });
    localStorage.setItem("validUrls", JSON.stringify(this.validUrls));
    console.log("Valid tracks URLs:", this.validUrls);
  }

  onSubmit(event) {
    event.preventDefault();
    this.submitForm();
  }

  submitForm() {
    const playlistEvent = new CustomEvent("playlist-update", {
      detail: this.validUrls,
    });
    this.dispatchEvent(playlistEvent);
  }

  /* no shadow dom */
  createRenderRoot() {
    return this;
  }
}
customElements.define("r4-playlist-builder", R4PlaylistBuilder);
