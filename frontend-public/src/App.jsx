import { RouterProvider } from 'react-router'
import './App.css'
import Router from './Router.jsx'

function App() {
  return (
    <>
      <RouterProvider router={Router}/>
    </>
  )
}

export default App
