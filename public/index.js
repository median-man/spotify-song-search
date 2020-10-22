window.onload = () => {
  const searchResultEl = document.querySelector("#search-results");
  const searchParams = new URLSearchParams(window.location.search);
  const songSearch = searchParams.get("song");
  if (songSearch) {
    fetchSongSearch();
  }

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
      const songDetails = [
        ["uri", uri],
        ["artist", artistText],
        ["album", albumText],
        ["url", `<a href="${spotifyUrl}">${spotifyUrl}</a>`],
      ]
        .map((row) => row.join(": "))
        .join("<br>");
      const el = document.createElement("div");
      el.innerHTML = `
        <h3>${name}</h3>
        <p>${songDetails}</p>
      `;
      searchResultEl.appendChild(el);
    });
  }
};
