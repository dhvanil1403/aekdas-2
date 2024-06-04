// Function to go back to the previous screen
let selectedScreens = []; // Array to store selected screens

function goBack() {
  window.location.href = "/Dashboard/Screens";
}
// Function to handle screen selection
function selectScreen(checkbox) {
  const row = checkbox.parentNode.parentNode; // Get the row of the checkbox
  const screenname = row.cells[1].textContent; // Get screen name from the row
  const tags = row.cells[2].textContent; // Get tags from the row
  const location = row.cells[3].textContent; // Get location from the row
  const isChecked = checkbox.checked; // Check if the checkbox is checked

  if (isChecked) {
    // Add the screen to the selectedScreens array
    selectedScreens.push({
      screenname: screenname,
      tags: tags,
      location: location,
    });

    // Refresh the selected screens table
    refreshSelectedScreensTable();
  } else {
    // Remove the screen from the selectedScreens array
    selectedScreens = selectedScreens.filter((screen) => {
      return !(
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
  if (!groupName || !description) {
    alert("Group Name and Description are required fields");
    return; 
  }

  const screenCount = selectedScreens.length;

  const data = {
    groupName: groupName,
    description: description,
    screenCount: screenCount,
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
      throw new Error('Network response was not ok');
    }

    window.location.href = "/Dashboard/Screens"; // Redirect on success
  } catch (error) {
    alert(error)
    console.error('Error:', error);
    // Handle error
    // Optionally, you can show an error message to the user
  }
}
