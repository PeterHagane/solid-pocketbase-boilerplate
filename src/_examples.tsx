import { createSignal } from 'solid-js'
import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Toaster } from 'solid-toast';
import { notify } from './app/components/notify';
import { produce } from 'solid-js/store';
import { createStore } from 'solid-js/store';

interface ICount {
  count: number
}

interface IStore {
  // count: number
  user: {
    name: string
    age: number
  },
  list: string[],
}

export const storeCounter = createSignal<ICount>({count: 0});

const [state, setState] = createStore<IStore>({
    user: {
      name: "John",
      age: 30,
    },
    list: ["book", "pen"],
  });
  
  export const setStoreState = ()=>  (
    setState(
      produce((state: IStore) => {
      state.user.name = "Jane";
      state.list.push("pencil");
      })
  )
  );


function App() {
  const [count, setCount] = createSignal(0)
  const [countStore, setCountStore] = storeCounter


  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <h1>Vite + Solid</h1>
      <div class="card">
        <button onClick={() => {
          setCount((count) => count + 1)
          setCountStore({count: countStore().count + 1})
          notify({title: "Hello", message: "World"})
          }}>
          count is {count()}
        </button>

        <button onClick={()=>{ 
          notify({title: "asd", message: "asd"})
        }}>asdasd</button>
        <p>
          countstore is {countStore().count} <br/>

          {process.env.APP_IS_DEV === "true" && "asdasdasd"}
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>

        {countStore().count % 2 === 0 && <p>SWAG</p>}
        {countStore().count % 2 >= 0.1 && <p>SMEG</p>}
      </div>
      <p class="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p>
      <Toaster
        position="bottom-right"
        gutter={8}
      />
    </>
  )
}

export default App
