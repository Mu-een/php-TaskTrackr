document.addEventListener('DOMContentLoaded', function() {
    var todoListNonce = '<?php echo esc_js(todo_list_data.nonce); ?>'; // Update the nonce name here as well


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
            xhr.send('action=add_task&task=' + encodeURIComponent(newTask));
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
                    console.log('Task list:', response.data.task_list); // Add this line for debugging
                    document.getElementById('task-list').innerHTML = response.data.task_list;
                } else {
                    console.error('Error: ' + response.data.message);
                }
            }
        };
        xhr.send();
    }

    // Call refreshTaskList initially
    refreshTaskList();
});
