document.addEventListener('DOMContentLoaded', function() {
    var todoListNonce = todo_list_data.nonce;

    console.log('Nonce:', todoListNonce);
    console.log('AJAX URL:', todo_list_data.ajax_url);

    // Add Task
    document.getElementById('add-task').addEventListener('click', function() {
        var newTask = document.getElementById('new-task').value;
        if (newTask !== '') {
            fetch(todo_list_data.ajax_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body: 'action=add_task&nonce=' + todoListNonce + '&task=' + encodeURIComponent(newTask)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('new-task').value = '';
                    refreshTaskList();
                } else {
                    console.error('Error: ' + data.data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });

    // Refresh Task List
    function refreshTaskList() {
        fetch(todo_list_data.ajax_url + '?action=get_task_list')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('task-list').innerHTML = data.data.task_list;
                    addDeleteButtonListeners();
                } else {
                    console.error('Error: ' + data.data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
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
        fetch(todo_list_data.ajax_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: 'action=delete_task&nonce=' + todoListNonce + '&task_id=' + taskId
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                refreshTaskList();
            } else {
                console.error('Error: ' + data.data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Call refreshTaskList initially
    refreshTaskList();

});
