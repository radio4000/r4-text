# `r4-text`

This is a simple, minimal web application developed using LitElement. It's designed to manage, display and play music playlists.

The application is divided into several custom elements (components), each responsible for a specific part of the functionality.

## Components

### `r4-app`

This is the main application component. It handles the playlist state, listens to URL changes, updates the playlist accordingly, and passes the playlist data to child components.

### `r4-player`

This component is responsible for managing and playing the playlist. It receives the playlist as a property from the `r4-app` component and updates the player whenever this property changes.

### `r4-playlist`

This component displays the current playlist. It receives the playlist as a property from the `r4-app` component and renders it.

### `r4-playlist-track`

This component is used by the `r4-playlist` component to display individual tracks in the playlist.

### `r4-urls`

This component is used to parse and display the playlist in a text area. It also emits an event whenever the user updates the playlist in the text area, which is then handled by the `r4-app` component to update the actual playlist.

## Usage

First, import the main `r4-app` component and use it in your HTML:

```html
<script type="module" src="src/r4-app.js"></script>
<r4-app></r4-app>
```

## Dev

- `npm i`
- `npm run dev`

# Issues

## gitlab url too long

With gitlab pages hosting, we get a http error 401, Request URL is too long (so we host on cloudflare pages).

## cloudflare node.js too low

create `.nvmrc` file with content `18.15.0`
