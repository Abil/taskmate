import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import AddTask from './components/AddTask';
import ShowTask from './components/ShowTask';

/**
 * @description This `App` function does the following:
 * 
 * 1/ Declares several state variables: `task`, `editid`, `tasklist`, and `theme`.
 * 2/ Uses `useState` to initialize these variables with default values.
 * 3/ Implements a form for adding new tasks, which includes an input field for
 * entering task names and a submit button.
 * 4/ When the submit button is pressed, it prevents the default form submission
 * behavior and performs the following actions:
 * 		- If `editid` is not set, it updates the `tasklist` state by mapping over it and
 * replacing any tasks with the same ID as the current task name with a new task
 * object ({ID: new Date().getTime(), name: task, time: `${new Date().toLocaleTimeString()}
 * ${new Date().toLocaleDateString()`})
 * 		- If `editid` is set, it sets `task` to an empty string and sets `editid` to 0.
 * 5/ Implements a button for editing existing tasks, which takes the ID of the task
 * to edit as a parameter and sets `editid` to that ID when clicked.
 * 6/ Uses `useEffect` to set the local storage item `tasklist` to the `tasklist`
 * state after each rendering, and sets the local storage item `theme` to the `theme`
 * state after each rendering.
 * 
 * @returns { array } The `App` function returns a JSX component that renders a
 * container element with various components, including a header, an add task form,
 * and a list of tasks. Here's a breakdown of what the function outputs:
 * 
 * 	- A `Header` component with a `setTheme` function and a `theme` prop, which sets
 * the theme for the application.
 * 	- An `AddTask` form that allows the user to input a task name and submit it. When
 * the form is submitted, the `handleSubmit` function is called, which updates the
 * list of tasks in the local storage.
 * 	- A `ShowTask` component that renders the list of tasks and provides functions
 * for editing and deleting tasks. The `tasklist` prop is updated when a task is
 * edited or deleted.
 * 	- The `useEffect` hooks are used to set the locally stored task list and theme
 * to the state variables `tasklist` and `theme`.
 */
function App() {
  const [task, setTask] = useState("");
  const [tasklist, setTasklist] = useState(JSON.parse(localStorage.getItem('tasklist')) || []);
  const [editid, setEditid] = useState(0);
  const [theme, setTheme] = useState(JSON.parse(localStorage.getItem('theme')) || "medium");

  /**
   * @description This function handles user input events related to task editing and
   * adds, updates or removes tasks from a list. Here's what it does:
   * 
   * 1/ Prevents the default event behavior.
   * 2/ Checks if an ID is provided for editing ( line 7). If yes,...
   * 3/ Finds the corresponding task in the `tasklist` array using `find()` (line 8)...
   * 4/ Updates the `tasklist` array with a new object containing the task ID, name,
   * and current time ( lines 9-12 )
   * 5/ Resets `editid` ( line 13 ) and `task` ( line 14 ) to their default values.
   * 6/ If no ID was provided for editing,...
   * 7/ Adds a new task to the list with the current date and time (lines 15-17).
   * 
   * @param {  } event - In this function, `event` is an object that represents the
   * event that triggered the function to run. The `event.preventDefault()` method is
   * called to prevent the default behavior of the event, which is typically to navigate
   * away from the current page or form. By preventing the default behavior, the function
   * can execute its logic without interfering with the original intent of the event.
   * 
   * @returns { object } This function handles two possible events:
   * 
   * 1/ Preventing the default behavior of an action triggered by a button, input, or
   * link.
   * 2/ Updating the tasklist when the user enters a new task name or edits an existing
   * task.
   * 
   * When the function is called with no arguments, it prevents the default behavior
   * of the action and sets `editid` to 0, `task` to an empty string, and `setTasklist`
   * to an array of objects representing the current tasklist.
   * 
   * When `event` is passed as an argument, the function checks if a task ID was selected,
   * and if so, updates the tasklist by replacing the selected task with a new object
   * containing the updated `time` field. It then sets `editid` to 0, `task` to an empty
   * string, and `setTasklist` to the updated array of tasks.
   * 
   * Finally, when `task` is passed as an argument, the function simply adds a new task
   * to the `tasklist` with the current date and time.
   */
  const handleSubmit = (event) => {
    event.preventDefault();    

    if(editid){
      const date = new Date();
      const selectedTask = tasklist.find(task => task.id === editid);
      const updateTask = tasklist.map((e) => (e.id === selectedTask.id ? (e = {id: e.id, name: task, time: `${date.toLocaleTimeString()} ${date.toLocaleDateString()}`}) : {id: e.id, name: e.name, time: e.time}));
      setTasklist(updateTask);
      setEditid(0);
      setTask("");
      return;
    }

    if(task){
      const date = new Date();
      setTasklist([...tasklist, {id: date.getTime(), name: task, time: `${date.toLocaleTimeString()} ${date.toLocaleDateString()}`}]);
      setTask("");
    }

  }

  /**
   * @description This function takes an `id` parameter and performs the following actions:
   * 
   * 1/ Finds the task in the `tasklist` array that has the matching `id`.
   * 2/ Sets the `Task` component's `name` prop to the name of the selected task.
   * 3/ Sets the `EditId` state variable to the `id` parameter passed in.
   * 
   * @param { number } id - The `id` input parameter in the provided code serves as a
   * identifier for the specific task that will be selected and updated in the state
   * variables `task` and `editid`. It is used to find the specific task within the
   * `tasklist` array that corresponds to the input `id`, and to set the name of that
   * task to the `task` state variable, as well as the `id` value to the `editid` state
   * variable.
   */
  const handleEdit = (id) => {
    const selectedTask = tasklist.find(task => task.id === id);
    setTask(selectedTask.name);
    setEditid(id);
  }

  /**
   * @description This function filters the `tasklist` state by removing any tasks that
   * have an `id` property equal to the `id` passed as a parameter. It then sets the
   * new filtered list of tasks back as the `tasklist` state.
   * 
   * @param { number } id - The `id` input parameter in the provided code snippet does
   * the following:
   * 
   * It filters the `tasklist` array to remove the task with the ID that is equal to
   * the value passed as an argument to the function. In other words, it excludes the
   * task with the specified ID from the list of tasks when the function is called.
   */
  const handleDelete = (id) => {
    const updatedTasklist = tasklist.filter(task => task.id !== id);
    setTasklist(updatedTasklist);
  }

  useEffect(() => {
    localStorage.setItem('tasklist', JSON.stringify(tasklist));
  }, [tasklist]);

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);

  return (
    <div className={"App " + theme}>
      <div className="container">
        <Header setTheme={setTheme} theme={theme}>
          Taskmate
        </Header>
        <AddTask handleSubmit={handleSubmit} editid={editid} task={task} setTask={setTask}/>
        <ShowTask tasklist={tasklist} setTasklist={setTasklist} handleEdit={handleEdit} handleDelete={handleDelete}/>
      </div>
    </div>
  );
}

export default App;
