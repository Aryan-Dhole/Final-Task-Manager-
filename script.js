// Grabing Elements 
const taskInput = document.getElementById("taskInput")
const taskList = document.getElementById("taskList")
const addBtn = document.getElementById("addBtn")
const priorityInput = document.getElementById("selectPriority")

//UI Helper: Assigns badge color based on priority
function getPriorityBadgeColor(priority) {
    if (priority === "High") return "danger"
    if (priority === "Medium") return "warning"
    return "secondary"
}


//UI Helper: Assigns badge color based on category badges
function getBadgeColor(category) {
    if (category === "Personal") return " bg-info text-dark"
    if (category === "Work") return " bg-warning text-dark"
    return " bg-secondary"

}


// Logic Helper: Checks if task is overdue
function isOverdue(dueDate) {

    const today = new Date().toISOString().split("T")[0]
    return dueDate && dueDate < today;
}


// Logic Helper: Sorts tasks by priority
function sortByPriority(taskArray) {//??
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    return taskArray.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
}

// global index
let editIndex = null
// priority global index
let isSortedByPriority = false;


// saving tasks to local storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || []

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}


//render tasks
function renderTasks() {
    taskList.innerHTML = "";//clear tasklist display
    //filter by category
    const selectedCategory = document.getElementById("filterCategory").value

    const filteredTasks = selectedCategory === "All"
        ? tasks
        : tasks.filter(t => t.category === selectedCategory)
    //filter by text
    const searchTerm = document.getElementById("filterInput").value.toLowerCase()

    let searchFilteredTasks = filteredTasks.filter(taskObj =>
        taskObj.task.toLowerCase().includes(searchTerm)
    )
    //sort by priority
    if (isSortedByPriority) {
        searchFilteredTasks = sortByPriority(searchFilteredTasks)
    }


    searchFilteredTasks.forEach((taskObj, index) => {

        //Overdue Badge
        const overdueBadge = isOverdue(taskObj.dueDate)
            ? `<span class="badge bg-danger ms-2">Overdue</span>`
            : "";

        //priority badge 
        const priorityBadge = `<span class="badge me-2 bg-${getPriorityBadgeColor(taskObj.priority)}">${taskObj.priority}</span>`


        // creating element li
        const li = document.createElement("li")
        li.className = "list-group-item d-flex justify-content-between align-items-center"
        li.id = `task-${index}`


        li.innerHTML = `<div>
        <input type="checkbox" id="checkbox" onchange="toggleDone(${index})" ${taskObj.done ? "checked" : ""}>
        <span class="${taskObj.done ? "text-decoration-line-through" : ""}">
        <strong class="text-capitalize fw-bold">${taskObj.task}</strong> <br>${priorityBadge}
        <br>
        <small class="text-muted">${taskObj.time}</small></span>
        </div>
        <small>Due: ${taskObj.dueDate || "no due date"}${overdueBadge} </small>
        <div>
        <strong class="badge me-2 p-2${getBadgeColor(taskObj.category)}">${taskObj.category}</strong>
        <Button class="btn btn-outline-secondary btn-sm" onclick="editTask(${index})">Edit</button>
        <Button class="btn btn-danger btn-sm" onclick="deleteTask(${index})">Delete</button>
        </div>`

        taskList.appendChild(li)//pushing to tasklist


    });
}


// deleting tasks
function deleteTask(index) {
    tasks.splice(index, 1)//deleting 1 task at the index
    saveTasks()
    renderTasks()
}


// function for add btn 
addBtn.addEventListener("click", () => {
    const task = taskInput.value.trim()//value we put into input
    const category = document.getElementById("category").value// same foe category
    const dueDate = document.getElementById("dueDateInput").value// due date

    if (task !== "") {
        const taskObj = {
            task: task,
            category: category,
            time: new Date().toLocaleString(),
            done: false,
            priority: priorityInput.value,
            dueDate: dueDate
        }
        tasks.push(taskObj)
        saveTasks()
        renderTasks()
        taskInput.value = "";
    }
})


//edit task function
function editTask(index) {
    const task = tasks[index]

    //prefills the form edit input
    document.getElementById("editTask").value = task.task
    document.getElementById("editCategory").value = task.category
    document.getElementById("editPriority").value = task.priority
    document.getElementById("editDoneCheckbox").checked = task.done
    document.getElementById("updateDueDate").value = task.dueDate

    editIndex = index
    // displaying of the edit section after pressing edit btn
    document.getElementById("editSection").classList.remove("d-none")
}


//fns for update btn
document.getElementById("updateBtn").addEventListener("click", () => {
    // grabing value of user input from edit section
    const UpdatedTask = document.getElementById("editTask").value.trim()
    const UpdateCategory = document.getElementById("editCategory").value
    const Updatedpriority = document.getElementById("editPriority").value
    const updatedDone = document.getElementById("editDoneCheckbox").checked
    const updatedDueDate = document.getElementById("updateDueDate").value


    if (editIndex !== null && UpdatedTask !== "") {
        tasks[editIndex] = {
            task: UpdatedTask,
            category: UpdateCategory,
            time: new Date().toLocaleString(),
            priority: Updatedpriority,
            done: updatedDone,
            dueDate: updatedDueDate


        }
        saveTasks()
        renderTasks()
        const updatedIndex = editIndex
        editIndex = null
        //hides the edit section 
        document.getElementById("editSection").classList.add("d-none")

        // gives flash animation
        setTimeout(() => {
            const updatedTaskEl = document.getElementById(`task-${updatedIndex}`);

            if (updatedTaskEl) {
                // FORCE reflow
                updatedTaskEl.classList.remove("flash-update");
                void updatedTaskEl.offsetWidth; // <- forces DOM to repaint

                updatedTaskEl.classList.add("flash-update");

                setTimeout(() => {
                    updatedTaskEl.classList.remove("flash-update");
                }, 1000);

            }
        }, 50);
    }

})


document.getElementById("filterCategory").addEventListener("change", renderTasks)// changes the order of tasks according to category selected
document.getElementById("filterInput").addEventListener("input", renderTasks)// grabs the users input typed and render the tasks


// checkbox done  
function toggleDone(index) {
    tasks[index].done = !tasks[index].done// toggles the boolean value true<=> false
    saveTasks()
    renderTasks()
}


// triggers button for sorting by priority 
document.getElementById("sortPriorityBtn").addEventListener("click", () => {
    isSortedByPriority = !isSortedByPriority//toggles the boolean value true<=> false
    saveTasks()
    renderTasks()
})


// renders the tasks saved in local storage
renderTasks()
