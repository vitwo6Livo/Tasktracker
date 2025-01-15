document.addEventListener("DOMContentLoaded", () => {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Load tasks from localStorage

  // Function to get unique names from both fields (teamMember and teamLeader)
  const getUniqueNames = () => {
    const members = tasks.map((task) => task.member || ""); // Extract team members
    const leaders = tasks.map((task) => task.leader || ""); // Extract team leaders
    return [...new Set([...members, ...leaders])]; // Combine and remove duplicates
  };

  // Generate labels (unique team members and leaders)
  const labels = getUniqueNames();
  localStorage.setItem("chartLabels", JSON.stringify(labels)); // Save to localStorage

  const ctx = document.getElementById("lineGraph").getContext("2d");
  const barGraph = new Chart(ctx, {
    type: "bar", // Specify chart type
    data: {
      labels: labels, // Combined teamMember and teamLeader names
      datasets: [
        {
          label: "On-Time",
          data: labels.map(() => Math.floor(Math.random() * 20)), // Placeholder data
          backgroundColor: "rgb(75, 192, 85)", // Bar color
        },
        {
          label: "Over-Time",
          data: labels.map(() => Math.floor(Math.random() * 10)), // Placeholder data
          backgroundColor: "rgba(255, 159, 64, 1)", // Bar color
        },
        {
          label: "Open",
          data: labels.map(() => Math.floor(Math.random() * 15)), // Placeholder data
          backgroundColor: "rgba(250, 103, 74, 0.66)", // Bar color
        },
      ],
    },
    options: {
      responsive: true,
      indexAxis: "y", // Horizontal orientation
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Task Report",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Number of Tasks",
          },
          beginAtZero: true,
        },
        y: {
          title: {
            display: true,
            text: "Team Members and Leaders",
          },
        },
      },
    },
  });
});
