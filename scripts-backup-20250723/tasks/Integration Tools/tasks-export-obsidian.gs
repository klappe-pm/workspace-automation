/**
 * Title: Google Tasks to Obsidian Export
 * Service: Google Tasks
 * Purpose: Export tasks to Obsidian-compatible markdown format
 * Created: 2024-01-15
 * Updated: 2025-01-16
 * Author: Kevin Lappe
 * Contact: kevin@averageintelligence.ai
 * License: MIT
 */

/*
Script Summary:
- Purpose: Export Google Tasks specifically formatted for Obsidian note-taking system
- Description: Finds 'My Tasks' tasklist and exports to markdown with Obsidian-compatible formatting
- Problem Solved: Enables seamless integration between Google Tasks and Obsidian workflows
- Successful Execution: Creates markdown file in Google Drive with task checkboxes and proper formatting

Key Features:
1. Targets 'My Tasks' tasklist by default
2. Creates Obsidian-compatible markdown format
3. Includes task metadata and completion status
4. Supports task checkbox format (- [ ] and - [x])
5. Organized folder structure for Obsidian vaults
6. Automatic file creation in Google Drive
*/

function exportTasksToMarkdown() {
  try {
    // List all task lists
    const taskLists = Tasks.Tasklists.list();

    // Find the 'Inbox' task list
    const inboxTaskList = taskLists.items.find(taskList => taskList.title === 'My Tasks');

    if (!inboxTaskList) {
      console.log('Inbox task list not found.');
      return;
    }

    // List tasks from the 'Inbox'
    const tasks = Tasks.Tasks.list(inboxTaskList.id);

    if (!tasks.items || tasks.items.length === 0) {
      console.log('No tasks found in Inbox.');
      return;
    }

    // Prepare Markdown content
    let markdownContent = "# Inbox\n\n";
    for (const task of tasks.items) {
      const status = task.status === 'completed' ? 'x' : ' ';
      const dueDate = task.due ? `` : ''; // Hidden due date comment
      markdownContent += `- [${status}] ${task.title} ${dueDate}\n`;
    }

    // Create or get the '_todos' folder
    const folderId = getOrCreateFolderId('_todos');

    // Create the Markdown file
    DriveApp.createFile(folderId, 'tasks.md', markdownContent);
    console.log('Markdown file created successfully in "_todos" folder.');

  } catch (err) {
    // Handle errors from the Tasks API or DriveApp
    console.error('An error occurred:', err.message);
  }
}

function getOrCreateFolderId(folderName) {
  try {
    let folders = DriveApp.getFoldersByName(folderName);
    if (folders.hasNext()) {
      return folders.next().getId();
    } else {
      return DriveApp.createFolder(folderName).getId();
    }
  } catch (err) {
    console.error('Error finding or creating folder:', err.message);
    throw err; // Re-throw the error to stop execution
  }
}
