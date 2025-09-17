import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Books from './pages/books.tsx'
import Add from './pages/add.tsx'
import Update from './pages/update.tsx'
import Test1 from './pages/test1.tsx'
import NotFoundPage from './pages/notFound.tsx'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './App.css'

const router = createBrowserRouter([
  {path:"/",element: <Navigate to="/books" replace />},
  {path:"/test1",element: <Test1 />},
  {path:"/books",element: <Books />},
  {path:"/add",element: <Add />},
  {path:"/update/:id",element: <Update />},
  {path:"*", element: <NotFoundPage />}
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)