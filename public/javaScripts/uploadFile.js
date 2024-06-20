document.getElementById("uploadButton").addEventListener("click", function () {
  document.getElementById("fileInput").click();
});

document.getElementById("fileInput").addEventListener("change", function () {
  document.getElementById("uploadForm").submit();
});

const buttons = document.querySelectorAll(".media-category button");

    buttons.forEach(button => {
      const link = button.querySelector("a");
      button.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default link behavior
        setActiveButton(button);
        window.location.href = link.getAttribute("href"); // Navigate to the link
      });
    });

    function setActiveButton(activeButton) {
      buttons.forEach(button => {
        if (button === activeButton) {
          button.classList.add("active");
        } else {
          button.classList.remove("active");
        }
      });
    }

    // Initial check for the active button based on the current URL
    const currentUrl = window.location.pathname;
    buttons.forEach(button => {
      const link = button.querySelector("a");
      if (link.getAttribute("href") === currentUrl) {
        button.classList.add("active");
      }
    });



