window.onload = () => {
  const searchResultEl = document.querySelector("#search-results");
  const searchParams = new URLSearchParams(window.location.search);
  const spotifyEmbed = new SpotifyEmbed({
    parentEl: document.querySelector("#spotify-embed"),
  });
  const songSearch = searchParams.get("song");
  if (songSearch) {
    fetchSongSearch();
  }

  searchResultEl.addEventListener("click", (e) => {
    if (e.target.matches(".btn-listen")) {
      return spotifyEmbed.src(e.target.value);
    }
  });

  async function fetchSongSearch() {
    try {
      const response = await fetch(`/api/search/songs?song=${songSearch}`);
      if (response.ok) {
        const { items } = await response.json();
        renderSongs(items);
      } else {
        console.log("http error:", response.status, response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function renderSongs(songs) {
    songs.forEach((song) => {
      const { name, uri, album, artists, external_urls } = song;
      const albumText = album.name;
      const artistText = artists.map((a) => a.name).join(", ");
      const spotifyUrl = external_urls.spotify;

      const el = document.createElement("div");
      el.classList.add("mb-3");
      el.innerHTML = `
        <h3>${name}</h3>
        <p>${songDetails({ uri, artistText, albumText, spotifyUrl })}</p>
        <button class="btn btn-secondary btn-listen" value="${spotifyEmbedUrl(
          uri
        )}">Listen</button>
      `;
      searchResultEl.appendChild(el);
    });

    function songDetails({ uri, artistText, albumText, spotifyUrl }) {
      return [
        ["uri", uri],
        ["artist", artistText],
        ["album", albumText],
        ["url", `<a href="${spotifyUrl}">${spotifyUrl}</a>`],
      ]
        .map((row) => row.join(": "))
        .join("<br>");
    }

    function spotifyEmbedUrl(songUri) {
      const [type, id] = songUri.split(":").slice(1);
      return `https://open.spotify.com/embed/${type}/${id}`;
    }
  }
};
