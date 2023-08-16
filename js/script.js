document.addEventListener('DOMContentLoaded', function() {
    var todoListNonce = todo_list_data.nonce;

    console.log('Nonce:', todoListNonce);
    console.log('AJAX URL:', todo_list_data.ajax_url);

    // Add Task
    document.getElementById('add-task').addEventListener('click', function() {
        var newTask = document.getElementById('new-task').value;
        if (newTask !== '') {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', todo_list_data.ajax_url, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        document.getElementById('new-task').value = '';
                        refreshTaskList();
                    } else {
                        console.error('Error: ' + response.data.message);
                    }
                }
            };
            xhr.send('action=add_task&nonce=' + todoListNonce + '&task=' + encodeURIComponent(newTask));
        }
    });

// Refresh Task List
function refreshTaskList() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', todo_list_data.ajax_url + '?action=get_task_list', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.success) {
                document.getElementById('task-list').innerHTML = response.data.task_list;
                addDeleteButtonListeners();
            } else {
                console.error('Error: ' + response.data.message);
            }
        }
    };
    xhr.send();
}

// Function to add event listeners for delete buttons
function addDeleteButtonListeners() {
    var deleteButtons = document.querySelectorAll('.delete-task');
    deleteButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var taskId = this.getAttribute('data-task-id');
            deleteTask(taskId);
        });
    });
}

// Function to delete a task
function deleteTask(taskId) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', todo_list_data.ajax_url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.success) {
                refreshTaskList(); // Refresh the task list after deleting a task
            } else {
                console.error('Error: ' + response.data.message);
            }
        }
    };
    xhr.send('action=delete_task&nonce=' + todoListNonce + '&task_id=' + taskId);
}

// Call refreshTaskList initially
refreshTaskList();

});
