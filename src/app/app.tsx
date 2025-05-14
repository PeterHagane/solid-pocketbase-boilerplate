import { Route, Router } from "@solidjs/router"
import Playground from "./pages/playground"
import Home from "./pages/home"
import Admin from "./pages/admin"
import Login from "./pages/login"
import ProtectedRoute from "./components/protectedRoute"
import { Toaster } from "solid-toast"
import { onCleanup, onMount } from "solid-js"
import Layout from "./components/layout/_layout"
import { getLocalStorageTheme, saveTheme } from "./stores/themesStore"
import Profile from "./pages/profile"
import { useScreenSize } from "./stores/settingsStore"
import NotFound from "./pages/404"


function App() {
  const [mountListener, cleanupListener] = useScreenSize()

  onMount(() => {
    const localStorageTheme = getLocalStorageTheme();
    //sync theme in localStorage to signal and index.html data-theme
    saveTheme(localStorageTheme, false);
    mountListener()
  });

  onCleanup(() => {
    cleanupListener()
  })


  return (
    <>
      <Router root={(props: any) => <Layout>
        {props.children}
      </Layout>}>
        <Route path="/login" component={() => <Login />} />
        <Route path="/" component={() => <ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" component={() => <ProtectedRoute><Profile /></ProtectedRoute>} />
        {process.env.APP_IS_DEV === "true" && <Route path="/playground" component={() => <ProtectedRoute><Playground /></ProtectedRoute>} />}        
        <Route path="/admin" component={() => <ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="*404" component={()=><NotFound/>} />
      </Router>

      <Toaster position="bottom-right" />
    </>
  )
}

export default App
