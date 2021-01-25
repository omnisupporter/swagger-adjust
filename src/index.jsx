import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import reportWebVitals from './reportWebVitals';
import System from './system';
import SystemContext from './system/context';

const StatePlugin = (system) => {
  return {
    components: {
      TestComponent: () => {
        const sys = system.hooks.useSystem();

        return <div>{Object.keys(sys)}</div>;
      },
    },
    statePlugins: {
      example: {
        initialState: { color: 'white' },
        actions: {
          updateAction: system.createAction('example/updateAction'),
          updateActionAsync: system.createAsyncThunk(
            'example/asyncThunkStatus',
            async (val, thunkAPI) => {
              const sys = thunkAPI.extra.getSystem();
              const { updateAction } = sys.getActions().exampleActions;
              const test = await val;

              thunkAPI.dispatch(updateAction(val));

              return test;
            }
          ),
        },
        selectors: {
          selectColor: (state, arg) => `${state.color}-${arg}`,
        },
        reducers: {
          'example/updateAction': (state, action) => ({ ...state, color: action.payload }),
        },
      },
    },
  };
};

const system = new System({
  plugins: [StatePlugin],
});
setTimeout(() => {
  system.getSystem().exampleActions.updateActionAsync('test');
}, 2000);

const store = system.getStore();

ReactDOM.render(
  <React.StrictMode>
    <SystemContext.Provider value={system.getSystem}>
      <Provider store={store}>
        <App />
      </Provider>
    </SystemContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
