document.addEventListener("DOMContentLoaded", () => {
  const createTaskButton = document.getElementById("createTaskButton");
  const taskModal = document.getElementById("taskModal");
  const closeModal = document.getElementById("closeModal");
  const cancelButton = document.querySelector(".cancel-button");
  const taskForm = document.getElementById("taskForm");
  const tasksList = document.getElementById("tasks");
  // const filterTargetDate = document.getElementById("filterTargetDate");
  // const filterActualDate = document.getElementById("filterActualDate");

  const filterTaskButton = document.getElementById("filterTaskButton");
  const filterModal = document.getElementById("filterModal");
  const closeFilterModal = document.getElementById("closeFilterModal");
  const clearFilterButton = document.getElementById("clearFilter");
  const applyFilterButton = document.getElementById("applyFilter");

  const filterTargetDate = document.getElementById("filterTargetDate");
  const filterActualDate = document.getElementById("filterActualDate");
  const filterLeader = document.getElementById("filterTeamLeader");
  const filterMember = document.getElementById("filterTeamMember");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Load tasks from localStorage
  let editingTaskIndex = null; // Track which task is being edited

  // Open the modal for creating tasks
  createTaskButton.addEventListener("click", () => {
    taskModal.classList.add("show");
    editingTaskIndex = null; // Reset editing index
    document.querySelector(".create-button").textContent = "Create"; // Reset button text
    taskForm.reset(); // Clear the form inputs
  });

  // Close the modal
  const closeTaskModal = () => {
    taskModal.classList.remove("show");
  };
  closeModal.addEventListener("click", closeTaskModal);
  cancelButton.addEventListener("click", closeTaskModal);

  // Add or Update task
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newTask = {
      client: document.getElementById("clientName").value,
      description: document.getElementById("taskDescription").value,
      leader: document.getElementById("teamLeader").value,
      member: document.getElementById("teamMember").value,
      targetDate: document.getElementById("targetDate").value,
      actualDate: document.getElementById("actualDate").value || "N/A",
    };

    if (editingTaskIndex !== null) {
      // Update existing task
      tasks[editingTaskIndex] = newTask;
      showScaffoldMessage("Task updated successfully!");
    } else {
      // Add new task
      tasks.push(newTask);
      showScaffoldMessage("Task added successfully!");
    }

    // Save tasks to localStorage and update the list
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks(tasks);
    closeTaskModal();
    editingTaskIndex = null;
  });

  // Display tasks
  const displayTasks = (filteredTasks) => {
    tasksList.innerHTML = ""; // Clear existing tasks
    const emptyMessage = document.getElementById("emptyMessage");

    if (filteredTasks.length === 0) {
      emptyMessage.style.display = "block"; // Show empty message
    } else {
      emptyMessage.style.display = "none"; // Hide empty message

      filteredTasks.forEach((task, index) => {
        const taskCard = document.createElement("li");
        taskCard.classList.add("task-card");

        taskCard.innerHTML = `
        <div class="task-options">
          <span class="edit-icon" data-index="${index}">
            <i class="fa-solid fa-pen"></i>
          </span>
          <span class="delete-icon" data-index="${index}">
            <i class="fa-solid fa-trash"></i>
          </span>
        </div>
        <h3>Client: ${task.client}</h3>
        <p>Task: ${task.description}</p>
        <div class="task-row">
          <span>Team Leader: ${task.leader}</span>
          <span>Target Date: ${task.targetDate}</span>

        </div>
        <div class="task-row">
          <span>Team Member: ${task.member}</span>
          <span>Actual Date: ${task.actualDate}</span>
        </div>
      `;

        tasksList.appendChild(taskCard);
      });

      // Add delete functionality
      document.querySelectorAll(".delete-icon").forEach((icon) => {
        icon.addEventListener("click", (event) => {
          const index = event.target.closest(".delete-icon").dataset.index;
          tasks.splice(index, 1); // Remove task
          localStorage.setItem("tasks", JSON.stringify(tasks)); // Update localStorage
          showScaffoldMessage("Task deleted successfully!");
          displayTasks(tasks);
        });
      });

      // Add edit functionality
      document.querySelectorAll(".edit-icon").forEach((icon) => {
        icon.addEventListener("click", (event) => {
          const index = event.target.closest(".edit-icon").dataset.index;
          const taskToEdit = tasks[index];

          // Populate modal with task details
          document.getElementById("clientName").value = taskToEdit.client;
          document.getElementById("taskDescription").value =
            taskToEdit.description;
          document.getElementById("teamLeader").value = taskToEdit.leader;
          document.getElementById("teamMember").value = taskToEdit.member;
          document.getElementById("targetDate").value = taskToEdit.targetDate;
          document.getElementById("actualDate").value = taskToEdit.actualDate;

          taskModal.classList.add("show");
          editingTaskIndex = index;
          document.querySelector(".create-button").textContent = "Update"; // Change button text
        });
      });
    }
  };

  // Show scaffold message
  const showScaffoldMessage = (message) => {
    const scaffoldMessage = document.createElement("div");
    scaffoldMessage.className = "scaffold-message";
    scaffoldMessage.textContent = message;
    document.body.appendChild(scaffoldMessage);

    setTimeout(() => scaffoldMessage.remove(), 3000); // Remove after 3 seconds
  };

  // Open filter modal
  filterTaskButton?.addEventListener("click", () => {
    filterModal.classList.add("show");
  });

  // Close filter modal
  closeFilterModal?.addEventListener("click", () => {
    filterModal.classList.remove("show");
  });

  // Clear filters
  clearFilterButton?.addEventListener("click", () => {
    filterTargetDate.value = "";
    filterActualDate.value = "";
    filterLeader.value = "";
    filterMember.value = "";
    displayTasks(tasks); // Show all tasks
  });

  // Apply filters
  applyFilterButton?.addEventListener("click", (event) => {
    event.preventDefault();
    let filteredTasks = tasks;

    if (filterTargetDate.value) {
      filteredTasks = filteredTasks.filter(
        (task) => task.targetDate === filterTargetDate.value
      );
    }
    if (filterActualDate.value) {
      filteredTasks = filteredTasks.filter(
        (task) => task.actualDate === filterActualDate.value
      );
    }
    if (filterLeader.value.trim()) {
      filteredTasks = filteredTasks.filter((task) =>
        task.leader
          .toLowerCase()
          .includes(filterLeader.value.trim().toLowerCase())
      );
    }
    if (filterMember.value.trim()) {
      filteredTasks = filteredTasks.filter((task) =>
        task.member
          .toLowerCase()
          .includes(filterMember.value.trim().toLowerCase())
      );
    }

    displayTasks(filteredTasks);
    filterModal.classList.remove("show");
  });

  // Display tasks on page load
  displayTasks(tasks);
});
