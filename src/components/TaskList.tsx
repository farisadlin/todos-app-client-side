import { Pagination, Task } from "@/types";
import ReactPaginate from "react-paginate";
import { useState } from "react";

interface TaskListProps {
  pagination: Pagination;
  tasks: Task[] | undefined;
  onPageChange: (selectedItem: { selected: number }) => void;
  onEditTask: (taskId: number, newTitle: string) => void;
  onDeleteTask: (taskId: number) => void;
  onAddTask: (title: string, description: string) => void;
}

const TaskList = ({
  tasks,
  pagination,
  onPageChange,
  onEditTask,
  onDeleteTask,
  onAddTask,
}: TaskListProps) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const handleAddTask = () => {
    if (newTaskTitle.trim() && newTaskDescription.trim()) {
      onAddTask(newTaskTitle.trim(), newTaskDescription.trim());
      setNewTaskTitle("");
      setNewTaskDescription("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <ul className="mt-5">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <li
              className="bg-white my-5 border rounded-lg text-black"
              key={task.id}
            >
              <div className="flex items-center">
                <div className="flex gap-2 flex-grow">
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => onEditTask(task.id, e.target.value)}
                    readOnly={editingTaskId !== task.id}
                    className="w-[200px] p-2 border rounded-l text-black"
                  />
                  <input
                    type="text"
                    value={task.description}
                    onChange={(e) => onEditTask(task.id, e.target.value)}
                    readOnly={editingTaskId !== task.id}
                    className="flex-grow p-2 border text-black"
                  />
                </div>
                <div>
                  <button
                    onClick={() => {
                      if (editingTaskId === task.id) {
                        setEditingTaskId(null);
                        // Call onEditTask to save changes if needed
                      } else {
                        setEditingTaskId(task.id);
                      }
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  >
                    {editingTaskId === task.id ? "Save" : "Edit"}
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500 my-5">
            No tasks available right now. Add a new one to get started!
          </p>
        )}
      </ul>

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Add New Task</h2>
        <div className="flex">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTask();
              }
            }}
            className="p-2 border border-r-0 rounded-l text-black flex-grow w-[10px]"
            placeholder="Enter task title"
            required
          />
          <input
            type="text"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTask();
              }
            }}
            className="p-2 border text-black flex-grow"
            placeholder="Enter task description"
            required
          />
          <button
            onClick={handleAddTask}
            className="bg-green-500 text-white px-4 py-2 rounded-r"
          >
            Add Task
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center mt-1">
        {pagination.total_pages > 0 ? (
          <ReactPaginate
            pageCount={pagination.total_pages}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            onPageChange={onPageChange}
            containerClassName="flex gap-5 text-2xl mt-5"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            activeClassName="active"
            previousLabel="&laquo;"
            nextLabel="&raquo;"
            breakLabel="..."
          />
        ) : null}
      </div>
    </div>
  );
};

export default TaskList;
