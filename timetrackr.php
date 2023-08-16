<?php
/*
Plugin Name: TaskTrackr
Description: A simple task management system
Version: 3.0
Author: Mu-een Slamat
*/

// Enqueue JavaScript and CSS
function todo_list_manager_enqueue_scripts() {
    wp_enqueue_script('todo-list-script', plugin_dir_url(__FILE__) . 'js/script.js', array('jquery'), '1.0', true);
    wp_enqueue_style('todo-list-style', plugin_dir_url(__FILE__) . 'css/style.css');
}
add_action('wp_enqueue_scripts', 'todo_list_manager_enqueue_scripts');


// Register the shortcode
function todo_list_shortcode() {
    ob_start();
    ?>
    <div class="todo-list">
        <h3>To-Do List</h3>
        <ul id="task-list">
            <!-- Existing tasks will be populated here -->
        </ul>
        <div class="add-task">
            <input type="text" id="new-task" placeholder="Add a new task">
            <button id="add-task">Add Task</button>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('todo_list', 'todo_list_shortcode');

// AJAX handler for adding tasks
function add_task_callback() {
    if (isset($_POST['nonce']) && wp_verify_nonce($_POST['nonce'], 'new-todo-list-nonce')) {
        $task = sanitize_text_field($_POST['task']);
        $tasks = get_option('todo_list_tasks', array());
        $tasks[] = array('task' => $task, 'completed' => false);
        update_option('todo_list_tasks', $tasks);
        
        wp_send_json_success(array('message' => 'Task added successfully.'));
    } else {
        wp_send_json_error(array('message' => 'Nonce verification failed.'));
    }
}
add_action('wp_ajax_add_task', 'add_task_callback');
add_action('wp_ajax_nopriv_add_task', 'add_task_callback');

// AJAX handler for getting the task list
function get_task_list_callback() {
    $tasks = get_option('todo_list_tasks', array());

    ob_start();
    if (!empty($tasks)) {
        echo '<ul>';
        foreach ($tasks as $index => $task) {
            $task_status = $task['completed'] ? 'completed' : 'incomplete';
            echo '<li class="' . $task_status . '">' . esc_html($task['task']);
            echo '<button class="delete-task" data-task-id="' . $index . '">Delete</button></li>';
        }
        echo '</ul>';
    } else {
        echo '<p>No tasks found.</p>';
    }
    $task_list = ob_get_clean();

    wp_send_json_success(array('task_list' => $task_list));
}
add_action('wp_ajax_get_task_list', 'get_task_list_callback');
add_action('wp_ajax_nopriv_get_task_list', 'get_task_list_callback');



// AJAX handler for deleting a task
function delete_task_callback() {
    if (isset($_POST['nonce']) && wp_verify_nonce($_POST['nonce'], 'new-todo-list-nonce')) {
        $task_id = intval($_POST['task_id']);
        $tasks = get_option('todo_list_tasks', array());
        if (isset($tasks[$task_id])) {
            unset($tasks[$task_id]);
            update_option('todo_list_tasks', $tasks);
            wp_send_json_success(array('message' => 'Task deleted.'));
        } else {
            wp_send_json_error(array('message' => 'Task not found.'));
        }
    } else {
        wp_send_json_error(array('message' => 'Nonce verification failed.'));
    }
}
add_action('wp_ajax_delete_task', 'delete_task_callback');


// Localize the JavaScript file
function todo_list_localize_script() {
    wp_localize_script('todo-list-script', 'todo_list_data', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('new-todo-list-nonce'),
    ));
}
add_action('wp_enqueue_scripts', 'todo_list_localize_script');
