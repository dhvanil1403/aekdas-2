function addNewScreen() {
  document.getElementById("overlay").style.display = "flex";
}
function hideNewScreen() {
  document.getElementById("overlay").style.display = "none";
}

 function markAsDeleted(pairingCode) {
  
      const confirmDelete = confirm(
        "Are you sure you want to delete this screen?"
      );
      if (confirmDelete) {
         handleScreenDeletion(pairingCode);
      }
    
  
}

const handleScreenDeletion = async (pairingCode) => {
  try {
    const response = await fetch("/Dashboard/Screens/mark-as-deleted", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pairingCode }), // Correctly sending pairingCode in the request body
    });

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    // const row = document.querySelector(`tr[data-pairingcode="${pairingCode}"]`);
    // if (row) {
    //   row.remove();
    // }
    window.location.reload();
  } catch (error) {
    console.error("Error deleting screen:", error);
    alert('Failed to delete screen');
  }
};

function editScreen(pairingCode) {
  // Fetch screen details using pairing code
  fetch(`/Dashboard/Screens/${pairingCode}`)
    .then((response) => response.json())
    .then((screen) => {
      // Populate edit form with screen details
      document.getElementById("editPairingCode").value = screen.pairingcode;
      document.getElementById("editScreenName").value = screen.screenname;
      document.getElementById("editTags").value = screen.tags;
      document.getElementById("editLocation").value = screen.location;
      document.getElementById("editCity").value = screen.city;
      document.getElementById("editState").value = screen.state;
      document.getElementById("editCountry").value = screen.country;
      document.getElementById("editPincode").value = screen.pincode;

      // Show edit overlay
      document.getElementById("editOverlay").style.display = "flex";
    })
    .catch((error) => console.error("Error fetching screen:", error));
}
// Function to hide edit overlay
function hideEditScreen() {
  document.getElementById("editOverlay").style.display = "none";
}
function showAllScreen() {
  document.querySelector(".allScreen").classList.add("active");
  document.querySelector(".allScreen").classList.remove("inactive");

  document.querySelector(".screenGroups").classList.add("inactive");
  document.querySelector(".screenGroups").classList.remove("active");

  document.querySelector(".deletedScreen").classList.add("inactive");
  document.querySelector(".deletedScreen").classList.remove("active");

  document.getElementById("show-Screen").style.display = "block";
  document.getElementById("show-Group-Screen").style.display = "none";
  document.getElementById("show-Deleted-Screen").style.display = "none";
}
function showDeletedScreens() {
  document.querySelector(".allScreen").classList.add("inactive");
  document.querySelector(".allScreen").classList.remove("active");

  document.querySelector(".screenGroups").classList.add("inactive");
  document.querySelector(".screenGroups").classList.remove("active");

  document.querySelector(".deletedScreen").classList.add("active");
  document.querySelector(".deletedScreen").classList.remove("inactive");

  document.getElementById("show-Screen").style.display = "none";
  document.getElementById("show-Group-Screen").style.display = "none";
  document.getElementById("show-Deleted-Screen").style.display = "block";
}

function addNewGroup() {
  window.location.href = "/Dashboard/Screens/Groups";
}
function showGroupScreen() {
  document.querySelector(".allScreen").classList.add("inactive");
  document.querySelector(".allScreen").classList.remove("active");

  document.querySelector(".screenGroups").classList.add("active");
  document.querySelector(".screenGroups").classList.remove("inactive");

  document.querySelector(".deletedScreen").classList.add("inactive");
  document.querySelector(".deletedScreen").classList.remove("active");

  document.getElementById("show-Group-Screen").style.display = "block";
  document.getElementById("show-Screen").style.display = "none";
  document.getElementById("show-Deleted-Screen").style.display = "none";
}
async function restoreScreen(pairingCode) {
  try {
    const response = await fetch("/Dashboard/Screens/restore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pairingCode: pairingCode }), // Sending PairingCode in the request body
    });

    const data = await response.json();
    if (data.success) {
      // Successfully restored the screen
      // Remove the row from the DOM
      const trToDelete = document.querySelector(
        `tr[data-pairingcode="${pairingCode}"]`
      );
      if (trToDelete) {
        trToDelete.remove();
        alert('Screen restored successfully');
      } else {
        console.error(`Could not find row with Pairing Code ${pairingCode}`);
      }
      // Redirect to dashboard/screen
      window.location.href = '/Dashboard/Screens';
    } else {
      // Handle the error
      alert('Error restoring screen');
    }
  } catch (error) {
    console.error("Error restoring screen:", error);
  }
}
async function deleteGroup(groupName){
  const confirmDelete = confirm(
    "Are you sure you want to delete this Group?"
  );
  if (confirmDelete) {
    try {
      const response = await fetch(`/Dashboard/Screens/Groups/${groupName}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        location.reload(); // Reload the page to see the updated group list
      } else {
        alert('Failed to delete group');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting group');
    }
  }
}
function editGroup(groupName){
 window.location.href = `/Dashboard/Screens/Groups/${groupName}`;
}

function filterScreens() {
  // Get input element and filter value
  var input = document.getElementById('searchInput');
  var filter = input.value.toUpperCase();

  // Get table rows
  var rows = document.querySelectorAll("#show-Screen table tbody tr");

  // Variable to keep track of the number of visible rows
  var visibleRowCount = 0;
  // Loop through all table rows, and hide those that don't match the search query
  rows.forEach(function(row) {
    var pairingCode = row.querySelector('td[id^="screen.pairingcode"]').textContent.toUpperCase();
    var screenName = row.querySelector('td[id^="screen.screenname"]').textContent.toUpperCase();
    var status = row.querySelector('td[id^="screen.status"]').textContent.toUpperCase();
    var tags = row.querySelector('td[id^="screen.tags"]').textContent.toUpperCase();
    var location = row.querySelector('td[id^="screen.location"]').textContent.toUpperCase();
    var city = row.querySelector('td[id^="screen.city"]').textContent.toUpperCase();
    var pincode = row.querySelector('td[id^="screen.pincode"]').textContent.toUpperCase();

    if (pairingCode.indexOf(filter) > -1 ||
        screenName.indexOf(filter) > -1 ||
        status.indexOf(filter) > -1 ||
        tags.indexOf(filter) > -1 ||
        location.indexOf(filter) > -1 ||
        city.indexOf(filter) > -1 ||
        pincode.indexOf(filter) > -1) {
      row.style.display = "";
      visibleRowCount++;
    } else {
      row.style.display = "none";
    }
  });
  var noResultsMessage = document.getElementById('noResultsMessage');
  if (visibleRowCount === 0) {
    noResultsMessage.style.display = "block";
  } else {
    noResultsMessage.style.display = "none";
  }
}

// Bind the filterScreens function to the input event
document.getElementById('searchInput').addEventListener('input', filterScreens);