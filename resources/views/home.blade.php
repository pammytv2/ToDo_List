<!DOCTYPE html>
<html lang="th">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List Application</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{url('frontend/css/home.css')}}">
    
</head>

<body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-8 col-md-10">
                <div class="todo-container">
                    <div class="todo-header">
                        <h1><i class="fas fa-tasks me-3"></i>Todo List Application</h1>
                    </div>

                    <!-- Statistics -->
                    <div class="row mb-4">
                        <div class="col-md-6 offset-md-3">
                            <div class="stats-card">
                                <h5 class="mb-1">สถิติงาน</h5>
                                <div class="row">
                                    <div class="col-6">
                                        <div class="fw-bold" id="totalTasks">0</div>
                                        <small>ทั้งหมด</small>
                                    </div>
                                    <div class="col-6">
                                        <div class="fw-bold" id="completedTasks">0</div>
                                        <small>เสร็จแล้ว</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Add Todo Form -->
                    <div class="card mb-4" style="border: none; border-radius: 15px;">
                        <div class="card-body">
                            <h5 class="card-title mb-3"><i class="fas fa-plus-circle me-2"></i>เพิ่มงานใหม่</h5>
                            <div class="row">
                                <div class="col-md-8">
                                    <input type="text" class="form-control" id="todoInput"
                                        placeholder="ใส่รายละเอียดงานที่ต้องทำ..." style="border-radius: 25px;">
                                </div>
                                <div class="col-md-4">
                                    <button class="btn btn-gradient w-100" onclick="addTodo()">
                                        <i class="fas fa-plus me-2"></i>เพิ่มงาน
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Todo List -->
                    <div class="mb-4">
                        <h5 class="mb-3"><i class="fas fa-list me-2"></i>รายการงาน</h5>
                        <div id="todoList">
                            <!-- Todo items will be dynamically added here -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
     <script src="{{url('frontend/js/home.js')}}"></script>
    
</body>

</html>
