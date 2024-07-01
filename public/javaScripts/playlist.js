function addPlaylistBox() {
  document.getElementById("overlay").style.display = "flex";
}
function hideNewScreen() {
  document.getElementById("overlay").style.display = "none";
}
document
  .getElementById("createPlaylistButton")
  .addEventListener("click", function () {
    window.location.href = "/Dashboard/Playlist/newPlaylist";
  });
