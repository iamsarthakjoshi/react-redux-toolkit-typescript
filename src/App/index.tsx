import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';

// import {
//   createTaskActionCreator,
//   deleteTaskActionCreator,
//   editTaskActionCreator,
//   selectTaskActionCreator,
//   toggleTaskActionCreator,
// } from '../redux-oldway';
import { State } from '../type';
import './App.css';

const App = function() {
  const dispatch = useDispatch();
  const tasks = useSelector((state: State) => state.tasks);
  const selectedTaskId = useSelector((state: State) => state.selectedTask);
  const editedCount = useSelector((state: State) => state.counter);

  const [newTaskInput, setNewTaskInput] = useState<string>('');
  const [editTaskInput, setEditTaskInput] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const editInput = useRef<HTMLInputElement>(null);

  const selectedTask =
    (selectedTaskId && tasks.find((task) => task.id === selectedTaskId)) ||
    null;

  const handleNewInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewTaskInput(e.target.value);
  };

  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEditTaskInput(e.target.value);
  };

  const handleCreateNewTodo = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!newTaskInput.length) return;
    dispatch(createTaskActionCreator({ description: newTaskInput }));
    setNewTaskInput('');
  };

  const handleSelectTodo = (taskId: string) => (): void => {
    dispatch(selectTaskActionCreator({ id: taskId }));
  };

  const handleEdit = (): void => {
    if (!selectedTask) return;

    setEditTaskInput(selectedTask.description);
    setIsEditMode(true);
  };

  useEffect(() => {
    if (isEditMode) {
      editInput?.current?.focus();
    }
  }, [isEditMode]);

  const handleUpdate = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!editTaskInput.length || !selectedTaskId) {
      handleCancelUpdate();
      return;
    }

    dispatch(
      editTaskActionCreator({ id: selectedTaskId, description: editTaskInput })
    );
    handleCancelUpdate();
  };

  const handleCancelUpdate = (
    e?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e?.preventDefault();
    setIsEditMode(false);
    setEditTaskInput('');
  };

  const handleToggle = (): void => {
    if (!selectedTaskId || !selectedTask) return;

    dispatch(
      toggleTaskActionCreator({
        id: selectedTaskId,
        isComplete: !selectedTask.isComplete,
      })
    );
  };

  const handleDelete = (): void => {
    if (!selectedTaskId) return;

    dispatch(deleteTaskActionCreator({ id: selectedTaskId }));
  };

  return (
    <div className="App">
      <div className="App__header">
        <h1>To-do: Redux Old Way vs RTK Way</h1>
        <form onSubmit={handleCreateNewTodo}>
          <label htmlFor="new-todo">Create a new task:</label>
          <input
            placeholder="Enter your task"
            onChange={handleNewInputChange}
            id="new-todo"
            value={newTaskInput}
          />
          <button type="submit">Create</button>
        </form>
      </div>
      <div className="App__body">
        <ul className="App__list">
          <h2>My Tasks:</h2>
          {tasks.map((task, i) => (
            <li
              className={`${task.isComplete ? 'done' : ''} ${
                task.id === selectedTaskId ? 'active' : ''
              }`}
              key={task.id}
              onClick={handleSelectTodo(task.id)}
            >
              <span className="list-number">{i + 1})</span> {task.description}
            </li>
          ))}
        </ul>
        <div className="App_todo-info">
          <h2>Selected Task:</h2>
          {selectedTask === null ? (
            <span className="empty-state">No Task Selected</span>
          ) : !isEditMode ? (
            <>
              <span
                className={`todo-desc ${
                  selectedTask?.isComplete ? 'done' : ''
                }`}
              >
                {selectedTask.description}
              </span>
              <div className="todo-actions">
                <button onClick={handleEdit}>Edit</button>
                <button onClick={handleToggle}>Toggle</button>
                <button onClick={handleDelete}>Delete</button>
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdate}>
              <label htmlFor="edit-todo">Edit:</label>
              <input
                ref={editInput}
                onChange={handleEditInputChange}
                value={editTaskInput}
              />
              <button type="submit">Update</button>
              <button onClick={handleCancelUpdate}>Cancel</button>
            </form>
          )}
        </div>
      </div>
      <div className="App__counter">Action Count: {editedCount}</div>
    </div>
  );
};

export default App;
