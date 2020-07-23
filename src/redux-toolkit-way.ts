import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';
import { Task } from './type';
import { v4 as uuid } from 'uuid';

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

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    create: {
      reducer: (
        state,
        action: PayloadAction<{
          id: string;
          description: string;
          isComplete: boolean;
        }>
      ) => {
        // const { id, description, isComplete } = action.payload;
        // state.push({ id, description, isComplete });
        state.push(action.payload);
      },
      prepare: ({ description }: { description: string }) => ({
        payload: {
          id: uuid(),
          description,
          isComplete: false,
        },
      }),
    },
    edit: (
      state,
      action: PayloadAction<{ id: string; description: string }>
    ) => {
      const { payload } = action;
      const task = state.find((task) => task.id === payload.id);
      if (task) task.description = payload.description;
    },
    toggle: (
      state,
      action: PayloadAction<{ id: string; isComplete: boolean }>
    ) => {
      const { payload } = action;
      const task = state.find((task) => task.id === payload.id);
      if (task) task.isComplete = payload.isComplete;
    },
    delete: (state, action: PayloadAction<{ id: string }>) => {
      const { payload } = action;
      const index = state.findIndex((task) => task.id === payload.id);
      if (index !== -1) state.splice(index, 1);
    },
  },
});

const selectedTaskSlice = createSlice({
  name: 'selectedTask',
  initialState: null as string | null,
  reducers: {
    select: (state, action: PayloadAction<{ id: string }>) => action.payload.id,
  },
});

// counterSlice does not has it's own reducers but uses of tasksSlice
const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {},
  extraReducers: {
    [tasksSlice.actions.create.type]: (state) => state + 1,
    [tasksSlice.actions.edit.type]: (state) => state + 1,
    [tasksSlice.actions.toggle.type]: (state) => state + 1,
    [tasksSlice.actions.delete.type]: (state) => state + 1,
  },
});

export const {
  create: createTaskActionCreator,
  delete: deleteTaskActionCreator,
  edit: editTaskActionCreator,
  toggle: toggleTaskActionCreator,
} = tasksSlice.actions;

export const { select: selectTaskActionCreator } = selectedTaskSlice.actions;

const reducer = {
  tasks: tasksSlice.reducer,
  selectedTask: selectedTaskSlice.reducer,
  counter: counterSlice.reducer,
};

export default configureStore({
  reducer,
});
