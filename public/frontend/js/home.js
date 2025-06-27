let todos = [];
let todoCounter = 0;
function formatThaiDateTime(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}


document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("auth_token");
    console.log("📦 Token จาก localStorage:", token);

    if (!token) {
        alert("กรุณาเข้าสู่ระบบก่อนใช้งาน");
        return;
    }

    await loadTodos();
    updateStats();
});

async function addTodo() {
    const input = document.getElementById("todoInput");
    const text = input.value.trim();

    if (text === "") {
        alert("กรุณาใส่รายละเอียดงานที่ต้องทำ");
        return;
    }

    const token = localStorage.getItem("auth_token");
    // console.log(" Token :", token);

    try {
        const response = await fetch("/api/todo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Server Error:", response.status, errorText);
            alert(`เกิดข้อผิดพลาด: ${response.status} - ${errorText}`);
            return;
        }

        const data = await response.json();
        todos.push(data.todo);
        input.value = "";
        await loadTodos();
    } catch (err) {
        console.error("Add Todo Error", err);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
}

async function editComment(todoId, commentIndex) {
    const todo = todos.find((t) => t.id === todoId);
    const comment = todo.comments[commentIndex];
    const newText = prompt("แก้ไขความคิดเห็น:", comment.text);

    if (newText !== null && newText.trim() !== "") {
        try {
            const response = await fetch(`/api/comments/${comment.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("auth_token"), 
                },
                body: JSON.stringify({ text: newText.trim() }),
            });

            const data = await response.json();
            comment.text = data.comment.text;
            await loadTodos();
            setTimeout(() => {
                document.getElementById(`comments-${todoId}`).style.display =
                    "block";
            }, 100);
        } catch (err) {
            console.error("Edit Comment Error", err);
        }
    }
}

async function deleteComment(todoId, commentIndex) {
    const todo = todos.find((t) => t.id === todoId);
    const comment = todo.comments[commentIndex];

    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบความคิดเห็นนี้?")) {
        try {
            const response = await fetch(`/api/comments/${comment.id}`, {
                method: "DELETE",
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("auth_token"), // ✅ แก้เป็น auth_token
                },
            });

            todo.comments.splice(commentIndex, 1);
            await loadTodos();
            setTimeout(() => {
                document.getElementById(`comments-${todoId}`).style.display =
                    "block";
            }, 100);
        } catch (err) {
            console.error("Delete Comment Error", err);
        }
    }
}

async function loadTodos() {
    try {
        const response = await fetch("/api/todo", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("auth_token"),
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Load Todos Error:", response.status, errorText);
            if (response.status === 401) {
                alert("Session หมดอายุ กรุณาเข้าสู่ระบบใหม่");
                localStorage.removeItem("auth_token");
                window.location.href = "/login";
                return;
            }
            return;
        }

        const data = await response.json();
        todos = data.todos;
        todoCounter = Math.max(...todos.map((t) => t.id), 0);
        const todoList = document.getElementById("todoList");
        todoList.innerHTML = "";

        todos.forEach((todo) => {
            const todoElement = createTodoElement(todo);
            todoList.appendChild(todoElement);
        });

        updateStats();
    } catch (err) {
        console.error("Load Todos Error", err);
    }
}

function createTodoElement(todo) {
    const formattedDate = formatThaiDateTime(todo.created_at);
    const completedDate = formatThaiDateTime(todo.completed_at);
    const progressDate = formatThaiDateTime(todo.in_progress_at);

    const todoDiv = document.createElement("div");
    todoDiv.className = `todo-item 
        ${todo.completed ? "completed" : ""} 
        ${todo.in_progress ? "in-progress" : ""}`;

    todoDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-start">
            <div class="flex-grow-1">
                <div class="todo-text fs-5 mb-2">${todo.text}</div>
                <small class="text-muted">
                    วันที่เพิ่ม: ${formattedDate}
                    ${
                        todo.completed && todo.completed_by_user?.name
                            ? `<br>✔️ ปิดโดย: <strong>${todo.completed_by_user.name}</strong> <span class="ms-2 text-muted">เวลา ${completedDate}</span>`
                            : ""
                    }
                    ${
                        todo.in_progress && todo.in_progress_by_user?.name
                            ? `<br>🔧 กำลังทำโดย: <strong>${todo.in_progress_by_user.name}</strong> <span class="ms-2 text-muted">${progressDate}</span>`
                            : ""
                    }
                </small>
            </div>
            <div class="btn-group">
                <button class="btn btn-${todo.in_progress ? "warning" : "outline-warning"} btn-sm"
                    onclick="toggleInProgress(${todo.id})"
                    title="กำลังทำ">
                    <i class="fas ${todo.in_progress ? "fa-spinner fa-spin" : "fa-spinner"}"></i>
                </button>
                <button class="btn btn-outline-success btn-sm" onclick="toggleTodo(${todo.id})">
                    <i class="fas fa-${todo.completed ? "undo" : "check"}"></i>
                </button>
                <button class="btn btn-outline-primary btn-sm" onclick="toggleComments(${todo.id})">
                    <i class="fas fa-comment"></i> ${todo.comments.length}
                </button>
                <button class="btn btn-outline-danger btn-sm" onclick="deleteTodo(${todo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>

        <div class="comment-section mt-2" id="comments-${todo.id}" style="display: none;">
            <h6><i class="fas fa-comments me-2"></i>ความคิดเห็น</h6>
            <div id="comment-list-${todo.id}">
                ${todo.comments
                    .map((comment, index) => {
                        const commentDate = formatThaiDateTime(comment.created_at);
                        const imagesHTML = comment.images?.map(
                            (img) =>
                                `<img src="/storage/${img.path}" class="img-thumbnail mt-2 me-2" style="max-height: 200px;">`
                        ).join("") || "";
                        return `
                            <div class="comment-item my-2" id="comment-${todo.id}-${index}">
                                <div>
                                    <span class="text-primary">${comment.user?.name || "ไม่ทราบชื่อ"} :</span> 
                                    <div id="comment-text-${todo.id}-${index}">${comment.text}</div>
                                    <small class="text-muted d-block">${commentDate}</small>
                                </div>
                                ${imagesHTML}
                            </div>`;
                    })
                    .join("")}
            </div>

            <div class="input-group mt-3" id="dropzone-${todo.id}">
                <input type="text" class="form-control" placeholder="เพิ่มความคิดเห็น..." id="comment-input-${todo.id}">
                <input type="file" accept="image/*" id="comment-image-${todo.id}" multiple hidden>
                <button class="btn btn-outline-secondary" id="attach-btn-${todo.id}">
                    <i class="fas fa-paperclip"></i>
                </button>
                <button class="btn btn-outline-primary" onclick="addComment(${todo.id})">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
            <div id="preview-${todo.id}" class="d-flex flex-wrap mt-2"></div>
        </div>
    `;


    const fileInput = todoDiv.querySelector(`#comment-image-${todo.id}`);
    const attachBtn = todoDiv.querySelector(`#attach-btn-${todo.id}`);
    const attachIcon = attachBtn.querySelector("i");

    attachBtn.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) {
            attachBtn.classList.replace("btn-outline-secondary", "btn-success");
            attachIcon.classList.replace("fa-paperclip", "fa-check");
        } else {
            attachBtn.classList.replace("btn-success", "btn-outline-secondary");
            attachIcon.classList.replace("fa-check", "fa-paperclip");
        }
    });

    return todoDiv;
}

async function toggleInProgress(id) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const token = localStorage.getItem("auth_token");

    try {
       
        if (!todo.in_progress && todo.completed) {
            const uncompleteResponse = await fetch(
                `/api/todo/${id}/uncomplete`,
                {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );

            if (!uncompleteResponse.ok) {
                const err = await uncompleteResponse.text();
                console.error("ยกเลิกปิดงานไม่สำเร็จ", err);
                alert("ไม่สามารถยกเลิกสถานะปิดงานได้");
                return;
            }
        }

        const endpoint = todo.in_progress
            ? `/api/todo/${id}/in-progress/unmark`
            : `/api/todo/${id}/in-progress`;

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(
                "Toggle InProgress Error:",
                response.status,
                errorText
            );
            alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะกำลังทำ");
            return;
        }

        await loadTodos();
        updateStats();
    } catch (err) {
        console.error("Toggle InProgress Error", err);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
}

async function toggleTodo(id) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const endpoint = todo.completed
        ? `/api/todo/${id}/uncomplete`
        : `/api/todo/${id}/complete`; 

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("auth_token"),
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Toggle Error:", response.status, errorText);
            alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะงาน");
            return;
        }

        await loadTodos();
        updateStats();
    } catch (err) {
        console.error("Toggle Todo Error", err);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
}


async function deleteTodo(id) {
    if (confirm("แน่ใจหรือไม่ที่จะลบงานนี้")) {
        try {
            const response = await fetch(`/api/todo/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("auth_token"),
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Delete Error:", response.status, errorText);
                alert(`ไม่สามารถลบได้: ${response.status}`);
                return;
            }

            todos = todos.filter((t) => t.id !== id);
            await loadTodos();
        } catch (err) {
            console.error("Delete Todo Error", err);
            alert("เกิดข้อผิดพลาดในการลบ");
        }
    }
}

function toggleComments(id) {
    const commentsDiv = document.getElementById(`comments-${id}`);
    commentsDiv.style.display =
        commentsDiv.style.display === "none" ? "block" : "none";
}

async function addComment(todoId) {
    const textInput = document.getElementById(`comment-input-${todoId}`);
    const fileInput = document.getElementById(`comment-image-${todoId}`);
    const text = textInput.value.trim();
    const images = fileInput.files;

    if (text === "" && images.length === 0) {
        alert("กรุณาใส่ข้อความหรือเลือกรูปภาพอย่างน้อยหนึ่งรายการ");
        return;
    }

    const formData = new FormData();
    formData.append("todo_id", todoId);
    formData.append("text", text);

    for (let i = 0; i < images.length; i++) {
        formData.append("images[]", images[i]); 
    }

    try {
        const response = await fetch("/api/comments", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("auth_token"),
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Upload error:", errorText);
            alert("อัปโหลดล้มเหลว");
            return;
        }

        const data = await response.json();
        textInput.value = "";
        fileInput.value = "";

        await loadTodos();
        setTimeout(() => {
            document.getElementById(`comments-${todoId}`).style.display =
                "block";
        }, 100);
    } catch (err) {
        console.error("Add Comment Error", err);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
}

function updateStats() {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
}

document.getElementById("todoInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTodo();
    }
});
