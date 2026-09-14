import { RouterProvider } from 'react-router'
import './App.css'
import Router from './Router.jsx'
import Header from "./components/Header.jsx"

function App() {
  return (
    <>
      <Header />
      <RouterProvider router={Router}/>
    </>
  )
}

export default App
