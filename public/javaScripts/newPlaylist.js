document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".media-category button");
  //  console.log(buttons); // Check if buttons are correctly selected

  function sendSelectedItemsToBackend() {
    fetch('/Dashboard/Playlist/createVideos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: selectedItems }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Videos created:', data);
      // Handle response from backend if necessary
    })
    .catch(error => {
      console.error('Error creating videos:', error);
      // Handle errors if any
    });
  }
  window.sendSelectedItemsToBackend = sendSelectedItemsToBackend;
  buttons.forEach((button) => {
    const link = button.querySelector("a");
    // console.log(link); // Check the links

    button.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default link behavior
      setActiveButton(button);
      //   console.log(`Navigating to: ${link.getAttribute("href")}`); // Log the navigation
      window.location.href = link.getAttribute("href"); // Navigate to the link
    });
  });

  function setActiveButton(activeButton) {
    buttons.forEach((button) => {
      if (button === activeButton) {
        button.classList.add("active");
        //      console.log(`Active button: ${activeButton.innerHTML}`); // Log active button
      } else {
        button.classList.remove("active");
      }
    });
  }

  // Initial check for the active button based on the current URL
  const currentUrl = window.location.pathname;
  // console.log(`Current URL: ${currentUrl}`); // Log the current URL

  let activeButtonFound = false;
  buttons.forEach((button) => {
    const link = button.querySelector("a");
    if (link.getAttribute("href") === currentUrl) {
      button.classList.add("active");
      activeButtonFound = true;
    }
  });

  // If no button matches the current URL, default to the "All" button
  if (!activeButtonFound) {
    const allButton = document.querySelector(".media-category .media-all");
    allButton.classList.add("active");
  }
  document
    .getElementById("uploadButton")
    .addEventListener("click", function () {
      document.getElementById("fileInput").click();
    });

  document.getElementById("fileInput").addEventListener("change", function () {
    document.getElementById("uploadForm").submit();
  });

  const mediaItems = document.querySelectorAll(".media-item");
  const imgSlider = document.getElementById("imgSlider");
  const imgPreview = document.querySelector(".img-preview");
  let itemsCount = 0; // Counter to track the number of items
  let selectedItems = []; // Array to store selected item URLs
  mediaItems.forEach((item) => {
    item.addEventListener("click", function () {
      if (itemsCount < 10) {
        // Check if the number of items is less than 10
        if (item.tagName.toLowerCase() === "img") {
          const img = document.createElement("img");
          img.src = item.src;
          img.classList.add("slider-item");
          imgSlider.appendChild(img);
          selectedItems.push(item.src);
          itemsCount++;
        } else if (item.tagName.toLowerCase() === "video") {
          const video = document.createElement("video");
          video.controls = true;
          video.classList.add("slider-item");
          const source = document.createElement("source");
          source.src = item.querySelector("source").src;
          source.type = item.querySelector("source").type;
          video.appendChild(source);
          imgSlider.appendChild(video);
          selectedItems.push(source.src);
          itemsCount++;
        }
      } else {
        alert("You can only select up to 10 items.");
      }
    });
  });

  imgSlider.addEventListener("click", function (event) {
    const target = event.target;
    imgPreview.innerHTML = ""; // Clear previous content

    if (target.tagName.toLowerCase() === "img") {
      const img = document.createElement("img");
      img.src = target.src;
      img.classList.add("preview-item");
      imgPreview.appendChild(img);
    } else if (target.tagName.toLowerCase() === "video") {
      const video = document.createElement("video");
      video.controls = true;
      video.classList.add("preview-item");
      const source = document.createElement("source");
      source.src = target.querySelector("source").src;
      source.type = target.querySelector("source").type;
      video.appendChild(source);
      imgPreview.appendChild(video);
    }
  });



});
