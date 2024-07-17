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





//

// document.querySelector('.media-btn-upload').addEventListener('click', function () {
//   document.querySelector('.file-input').click();
// });

// document.querySelector('.file-input').addEventListener('change', function (event) {
//   var file = event.target.files[0];
//   if (file) {
//       uploadToCloudinary(file);
//   }
// });

// function uploadToCloudinary(file) {
//   var url = `https://api.cloudinary.com/v1_1/dqfnwh89v/upload`;
//   var timestamp = Math.round((new Date()).getTime() / 1000);
//   var apiKey = '451893856554714';
//   var apiSecret = 'zgbspSZH8AucreQM8aL1AKN9S-Y';
//   var signature = CryptoJS.SHA1(`timestamp=${timestamp}${apiSecret}`).toString();

//   var formData = new FormData();
//   formData.append('file', file);
//   formData.append('api_key', apiKey);
//   formData.append('timestamp', timestamp);
//   formData.append('signature', signature);

//   var xhr = new XMLHttpRequest();
//   xhr.open('POST', url, true);

//   xhr.upload.addEventListener('progress', function (event) {
//       if (event.lengthComputable) {
//           var percentComplete = (event.loaded / event.total) * 100;
//           document.querySelector('.progress-bar').style.width = percentComplete + '%';
//           document.querySelector('.progress-bar').setAttribute('aria-valuenow', percentComplete);
//       }
//   });

//   xhr.onreadystatechange = function () {
//       if (xhr.readyState === 4) {
//           if (xhr.status === 200) {
//               alert('Upload complete!');
//               // You may want to refresh the page or update the media list here
//           } else {
//               alert('Upload failed!');
//           }
//       }
//   };

//   xhr.send(formData);
// }

document.addEventListener("DOMContentLoaded", function() {
  const uploadButton = document.querySelector('.media-btn-upload');
  const fileInput = document.querySelector('.file-input');
  const uploadForm = document.querySelector('.upload-form');
  const progressBar = document.getElementById('progress-bar');

  uploadButton.addEventListener('click', function() {
      fileInput.click(); // Trigger the file input click event
  });

  fileInput.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
          uploadForm.style.display = 'block'; // Show the form
      }
  });

  uploadForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const file = fileInput.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/Dashboard/Library/UploadMedia'); // Replace with your endpoint
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); // Add any headers needed

      // Upload progress listener
      xhr.upload.onprogress = function(e) {
          if (e.lengthComputable) {
              const percentComplete = (e.loaded / e.total) * 100;
              progressBar.style.width = percentComplete + '%';
          }
      };

      // Request finished callback
      xhr.onload = function() {
          if (xhr.status === 200) {
              console.log('File uploaded successfully.');
              // Optionally handle response or update UI
          } else {
              console.error('Upload failed. Status:', xhr.status);
              // Handle errors or display error message
          }
      };

      // Send request
      xhr.send(formData);
  });
});


document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.delete-form').forEach(form => {
    form.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the default form submission

      // Show confirmation alert
      const isConfirmed = confirm('Are you sure you want to delete this file?');
      if (!isConfirmed) {
        return; // If the user cancels, do nothing
      }

      const formAction = this.action;

      fetch(formAction, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(response => {
        if (response.ok) {
          // Successfully deleted, reload the page or update the UI
          console.log("Deleted successfully");
          location.reload();
        } else {
          // Handle error
          alert('Error deleting file');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error deleting file');
      });
    });
  });
});

