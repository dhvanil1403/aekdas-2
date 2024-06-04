function addNewScreen() {
  document.getElementById("overlay").style.display = "flex";
}
function hideNewScreen() {
  document.getElementById("overlay").style.display = "none";
}

function markAsDeleted() {
  document.querySelectorAll(".delete").forEach((button) => {
    button.addEventListener("click", async function () {
      const pairingCode = this.closest("tr").dataset.pairingcode;
      const confirmDelete = confirm(
        "Are you sure you want to delete this screen?"
      );
      if (confirmDelete) {
        await handleScreenDeletion(pairingCode);
      }
    });
  });
}

const handleScreenDeletion = async (pairingCode) => {
  try {
    const response = await fetch("/Dashboard/Screens/mark-as-deleted", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ PairingCode: pairingCode }), // Sending PairingCode in the request body
    });

    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    // Remove the row from the DOM
    const trToDelete = document.querySelector(
      `tr[data-pairingcode="${pairingCode}"]`
    );
    if (trToDelete) {
      trToDelete.remove();
    } else {
      console.error(`Could not find row with Pairing Code ${pairingCode}`);
    }
  } catch (error) {
    console.error("Error deleting screen:", error);
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
      document.getElementById("editArea").value = screen.area;

      // Show edit overlay
      document.getElementById("editOverlay").style.display = "flex";
    })
    .catch((error) => console.error("Error fetching screen:", error));
}
// Function to hide edit overlay
function hideEditScreen() {
  document.getElementById("editOverlay").style.display = "none";
}

function showDeletedScreens() {
  fetch("/Dashboard/Screens/Deleted-Screen")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((screens) => {
      const tableBody = document.querySelector("#show-Deleted-Screen tbody");
      tableBody.innerHTML = "";

      screens.forEach((screen) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${screen.pairingcode}</td>
            <td>${screen.screenname}</td>
            <td>${screen.tags}</td>
            <td>${screen.location}</td>
            <td>${screen.city}</td>
            <td>${screen.state}</td>
            <td>${screen.country}</td>
            <td>${screen.area}</td>
          `;
        tableBody.appendChild(row);
      });

      // Show edit overlay
      document.getElementById("show-Deleted-Screen").style.display = "block";
      document.getElementById("show-Group-Screen").style.display = "none";

      document.getElementById("show-Screen").style.display = "none";
    })
    .catch((error) => console.error("Error fetching Deleted screen:", error));
}

function addNewGroup() {
  window.location.href = "/Dashboard/Screens/Groups";
}
function showGroupScreen() {
  console.log("showGroupScreen Clicked");
  fetch("/Dashboard/Screens/GroupScreen")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((screens) => {
      const tableBody = document.querySelector("#show-Group-Screen tbody");
      tableBody.innerHTML = "";

      screens.forEach((screen) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${screen.group_name}</td>
        <td>${screen.group_description}</td>
        <td>${screen.total_screen}</td>
      `;
        tableBody.appendChild(row);
      });

      document.getElementById("show-Group-Screen").style.display = "block";

      document.getElementById("show-Deleted-Screen").style.display = "none";
      document.getElementById("show-Screen").style.display = "none";
    })
    .catch((error) => console.error("Error fetching group screen:", error));
}
