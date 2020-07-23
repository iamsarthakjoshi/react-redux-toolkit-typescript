import { combineReducers, createStore, applyMiddleware } from 'redux';
import { v1 as uuid } from 'uuid';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

import { Task } from './type';

// Constants
const CREATE_TASK = 'CREATE_TASK';
const EDIT_TASK = 'EDIT_TASK';
const TOGGLE_TASK = 'TOGGLE_TASK';
const DELETE_TASK = 'DELETE_TASK';
const SELECT_TASK = 'SELECT_TASK';

// ACtions and Action Types

// CreateTaskActionTpye
interface CreateTaskActionTpye {
  type: typeof CREATE_TASK;
  payload: Task;
}

export const createTaskActionCreator = ({
  description,
}: {
  description: string;
}): CreateTaskActionTpye => {
  return {
    type: CREATE_TASK,
    payload: {
      id: uuid(),
      description,
      isComplete: false,
    },
  };
};

// EditTaskActionTpye
interface EditTaskActionTpye {
  type: typeof EDIT_TASK;
  payload: { id: string; description: string };
}

export const editTaskActionCreator = ({
  id,
  description,
}: {
  id: string;
  description: string;
}): EditTaskActionTpye => {
  return {
    type: EDIT_TASK,
    payload: { id, description },
  };
};

// ToggleTaskActionTpye
interface ToggleTaskActionTpye {
  type: typeof TOGGLE_TASK;
  payload: { id: string; isComplete: boolean };
}

export const toggleTaskActionCreator = ({
  id,
  isComplete,
}: {
  id: string;
  isComplete: boolean;
}): ToggleTaskActionTpye => {
  return {
    type: TOGGLE_TASK,
    payload: { id, isComplete },
  };
};

// DeleteTaskActionTpye
interface DeleteTaskActionTpye {
  type: typeof DELETE_TASK;
  payload: { id: string };
}

export const deleteTaskActionCreator = ({
  id,
}: {
  id: string;
}): DeleteTaskActionTpye => {
  return {
    type: DELETE_TASK,
    payload: { id },
  };
};

// SelectTaskActionTpye
interface SelectTaskActionTpye {
  type: typeof SELECT_TASK;
  payload: { id: string };
}

export const selectTaskActionCreator = ({
  id,
}: {
  id: string;
}): SelectTaskActionTpye => {
  return {
    type: SELECT_TASK,
    payload: { id },
  };
};

// Reducers
const initialState: Task[] = [
  {
    id: uuid(),
    description: 'Learn React',
    isComplete: true,
  },
  {
    id: uuid(),
    description: 'Learn Redux',
    isComplete: true,
  },
  {
    id: uuid(),
    description: 'Learn Redux-ToolKit',
    isComplete: false,
  },
];

type TaskActionTypes =
  | CreateTaskActionTpye
  | EditTaskActionTpye
  | ToggleTaskActionTpye
  | DeleteTaskActionTpye;

const tasksReducer = (
  state: Task[] = initialState,
  action: TaskActionTypes // destructured action in key part
) => {
  switch (action.type) {
    case CREATE_TASK: {
      return [...state, action.payload];
    }
    case EDIT_TASK: {
      const { payload } = action;
      return state.map((task) =>
        task.id === payload.id
          ? { ...task, description: payload.description }
          : task
      );
    }
    case TOGGLE_TASK: {
      const { payload } = action;
      return state.map((task) =>
        task.id === payload.id
          ? { ...task, isComplete: payload.isComplete }
          : task
      );
    }
    case DELETE_TASK: {
      const { payload } = action;
      return state.filter((task) => task.id !== payload.id);
    }
    default: {
      return state;
    }
  }
};

type SelectedTaskActionTypes = SelectTaskActionTpye;
const selectedTaskReducer = (
  state: string | null = null,
  action: SelectedTaskActionTypes
) => {
  switch (action.type) {
    case SELECT_TASK: {
      const { payload } = action;
      return payload.id;
    }
    default: {
      return state;
    }
  }
};

const conunterReducer = (state: number = 0, action: TaskActionTypes) => {
  switch (action.type) {
    case CREATE_TASK: {
      return state + 1;
    }
    case EDIT_TASK: {
      return state + 1;
    }
    case TOGGLE_TASK: {
      return state + 1;
    }
    case DELETE_TASK: {
      return state + 1;
    }
    default: {
      return state;
    }
  }
};

// Combined reducers
const reducers = combineReducers({
  tasks: tasksReducer,
  counter: conunterReducer,
  selectedTask: selectedTaskReducer,
});

// Store
export default createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk, logger))
);
