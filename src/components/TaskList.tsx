import { Pagination, Task } from "@/types";
import ReactPaginate from "react-paginate";
import { useState, useRef } from "react";
import { FaEdit, FaSave, FaTrash, FaPlus } from "react-icons/fa";

interface TaskListProps {
  pagination: Pagination;
  tasks: Task[] | undefined;
  onPageChange: (selectedItem: { selected: number }) => void;
  onEditTask: (
    taskId: number,
    newTitle: string,
    newDescription: string
  ) => void;
  onDeleteTask: (taskId: number) => void;
  onAddTask: (title: string, description: string) => void;
  onUpdateTaskStatus: (taskId: number, completed: boolean) => void;
}

const TaskList = ({
  tasks,
  pagination,
  onPageChange,
  onEditTask,
  onDeleteTask,
  onAddTask,
  onUpdateTaskStatus,
}: TaskListProps) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [editedTask, setEditedTask] = useState<Task | null>(null);

  const handleAddTask = () => {
    if (newTaskTitle.trim() && newTaskDescription.trim()) {
      onAddTask(newTaskTitle.trim(), newTaskDescription.trim());
      setNewTaskTitle("");
      setNewTaskDescription("");
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditedTask({ ...task });
  };

  const handleSaveTask = () => {
    if (editedTask) {
      onEditTask(editedTask.id, editedTask.title, editedTask.description);
      setEditingTaskId(null);
      setEditedTask(null);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    task: Task
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveTask();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="min-h-[400px]">
        <ul className="mt-5">
          {tasks && tasks.length > 0 ? (
            tasks.map((task) => (
              <li
                className="bg-white my-5 border rounded-lg text-black"
                key={task.id}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      onUpdateTaskStatus(task.id, !task.completed)
                    }
                    className="ml-2 mr-4"
                  />
                  <div className="flex flex-grow max-md:flex-col">
                    <input
                      type="text"
                      value={
                        editingTaskId === task.id
                          ? editedTask?.title
                          : task.title
                      }
                      onChange={(e) =>
                        editedTask &&
                        setEditedTask({ ...editedTask, title: e.target.value })
                      }
                      placeholder="Enter task title"
                      onKeyDown={(e) => handleKeyDown(e, task)}
                      readOnly={editingTaskId !== task.id}
                      disabled={editingTaskId !== task.id}
                      className={`md:w-[230px] p-2 border border-r-0 rounded-l text-black disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        task.completed ? "line-through" : ""
                      }`}
                    />
                    <input
                      type="text"
                      value={
                        editingTaskId === task.id
                          ? editedTask?.description
                          : task.description
                      }
                      onChange={(e) =>
                        editedTask &&
                        setEditedTask({
                          ...editedTask,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter task description"
                      onKeyDown={(e) => handleKeyDown(e, task)}
                      readOnly={editingTaskId !== task.id}
                      disabled={editingTaskId !== task.id}
                      className={`flex-grow p-2 border text-black disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        task.completed ? "line-through" : ""
                      }`}
                    />
                  </div>
                  <div className="mx-2 max-md:flex max-md:flex-col max-md:gap-2">
                    {!task.completed && (
                      <button
                        onClick={() => {
                          if (editingTaskId === task.id) {
                            handleSaveTask();
                          } else {
                            handleEditTask(task);
                          }
                        }}
                        className="bg-blue-500 text-white p-2 rounded md:mr-2"
                      >
                        {editingTaskId === task.id ? <FaSave /> : <FaEdit />}
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="bg-red-500 text-white p-2 rounded"
                    >
                      <FaTrash />
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
          <h2 className="text-xl font-bold mb-2 max-md:text-center">
            Add New Task
          </h2>
          <div className="flex flex-col md:flex-row">
            <input
              ref={titleInputRef}
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddTask();
                }
              }}
              className="p-2 border md:border-r-0 rounded-t md:rounded-r-none md:rounded-l text-black flex-grow md:max-w-[270px] md:mb-0"
              placeholder="Enter task title"
              required
            />
            <input
              type="text"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  titleInputRef.current?.focus();
                  handleAddTask();
                }
              }}
              className="p-2 border text-black flex-grow md:mb-0"
              placeholder="Enter task description"
              required
            />
            <button
              onClick={handleAddTask}
              className="bg-green-500 text-white px-4 py-2 rounded-b md:rounded-b-none md:rounded-r max-md:flex max-md:justify-center max-md:items-center"
              aria-label="Add Task"
            >
              <FaPlus />
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center mt-8">
        {pagination.total_pages > 0 ? (
          <ReactPaginate
            pageCount={pagination.total_pages}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            onPageChange={(selectedItem) => {
              if (typeof selectedItem.selected === "number") {
                onPageChange({ selected: selectedItem.selected });
              }
            }}
            forcePage={pagination.current_page - 1}
            containerClassName="flex items-center space-x-2"
            pageClassName="page-item"
            pageLinkClassName="px-3 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 transition-colors duration-200"
            previousClassName="page-item"
            previousLinkClassName="px-3 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 transition-colors duration-200"
            nextClassName="page-item"
            nextLinkClassName="px-3 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 transition-colors duration-200"
            breakClassName="page-item"
            breakLinkClassName="px-3 py-2"
            activeClassName="active"
            activeLinkClassName="active-page-link"
            disabledClassName="opacity-50 cursor-not-allowed"
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
