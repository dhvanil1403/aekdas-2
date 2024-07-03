function addPlaylistBox() {
  document.getElementById("overlay").style.display = "flex";
}
function hideNewScreen() {
  document.getElementById("overlay").style.display = "none";
}
document
  .getElementById("createPlaylistButton")
  .addEventListener("click", function () {
      const screenID = document.getElementById("screenID").value;
    const playlistName = document.getElementById("playlistName").value;
    const playlistDescription = document.getElementById(
      "playlistDescription"
    ).value;

    // Store the playlist data in session storage
    sessionStorage.setItem("screenID", screenID);
    sessionStorage.setItem("playlistName", playlistName);
    sessionStorage.setItem("playlistDescription", playlistDescription);

    window.location.href = "/Dashboard/Playlist/newPlaylist";
  });
