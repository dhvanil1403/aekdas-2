// Function to go back to the previous screen
function goBack() {
    window.location.href = "/Dashboard/Screens";
  }
  let selectedScreens = []; // Array to store selected screens
  
  // Function to handle screen selection
  function selectScreen(checkbox) {
    const row = checkbox.parentNode.parentNode; // Get the row of the checkbox
    const pairingcode = row.cells[1].textContent; // Get pairingcode  from the row
  
    const screenname = row.cells[2].textContent; // Get screen name from the row
    const tags = row.cells[3].textContent; // Get tags from the row
    const location = row.cells[4].textContent; // Get location from the row
    const isChecked = checkbox.checked; // Check if the checkbox is checked
  
    if (isChecked) {
      // Add the screen to the selectedScreens array
      selectedScreens.push({
        pairingcode: pairingcode.trim(),
        screenname: screenname.trim(),
        tags: tags.trim(),
        location: location.trim(),
      });
  
      // Refresh the selected screens table
      refreshSelectedScreensTable();
    } else {
      // Remove the screen from the selectedScreens array
      selectedScreens = selectedScreens.filter((screen) => {
        return !(
          screen.pairingcode === pairingcode &&
          screen.screenname === screenname &&
          screen.tags === tags &&
          screen.location === location
        );
      });
  
      // Refresh the selected screens table
      refreshSelectedScreensTable();
    }
  }
  
  // Function to refresh the selected screens table
  function refreshSelectedScreensTable() {
    const table = document.getElementById("selectedScreensTable");
    const tbody = table.getElementsByTagName("tbody")[0];
  
    // Clear existing table rows
    tbody.innerHTML = "";
  
    // If no screens are selected, show a message
    if (selectedScreens.length === 0) {
      const row = tbody.insertRow();
      const cell = row.insertCell();
      cell.colSpan = 4;
      cell.textContent = "No screens selected";
      return;
    }
  
    // Add rows for each selected screen
    selectedScreens.forEach((screen, index) => {
      const row = tbody.insertRow();
      row.insertCell().textContent = index + 1; // SR.NO
      row.insertCell().textContent = screen.screenname; // SCREEN NAME
      row.insertCell().textContent = screen.tags; // SCREEN TAG
      row.insertCell().textContent = screen.location; // SCREEN LOCATION
    });
  }
  async function saveGroup() {
    const groupName = document.querySelector('input[name="groupName"]').value;
    const description = document.querySelector('input[name="description"]').value;
    if (!groupName || !description || selectedScreens.length === 0) {
      alert("Group Name, Description, and at least one screen are required fields");
      return;
    }
  
    const data = {
      groupName: groupName,
      description: description,
      selectedScreen: selectedScreens,
      screenCount: selectedScreens.length,
    };
    try {
      const response = await fetch("/Dashboard/Screens/Groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      window.location.href = "/Dashboard/Screens"; // Redirect on success
    } catch (error) {
      alert(error);
      console.error("Error:", error);
      // Handle error
      // Optionally, you can show an error message to the user
    }
  }
  document.addEventListener("DOMContentLoaded", function () {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      selectScreen(checkbox); // Call selectScreen for each checkbox to add to selectedScreens
    });
  });