import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Login from './Components/ui/Login.jsx'
import Register from './Components/ui/Register.jsx'
import Header from './Components/ui/Header.jsx'
import UserProfile from './Components/UserProfile.jsx'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import AdminFileUpload from './Components/AdminFileUpload.jsx'
import Result from './Components/Result.jsx'
const router= createBrowserRouter([
  {
    path:"/",
     element:<Header/>
  },
  {
    path:"/login",
    element:<Login/>
  },
  {
    path:"/register",
    element:<Register/>
  },
  // {
  //   path:"/home",
  //   element:<Layout/>,
  //   children:[
  //     {}
  //   ]
  // },
   {
    path:"/profile",
    element:<UserProfile/>
   },
   {
    path:"/admin/upload",
    element:<AdminFileUpload/>
   },
   {
    path:"/result",
    element:<Result/>
   }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Provider  store={store}>
    <RouterProvider router={router} />
    </Provider>
    </LocalizationProvider>
  </React.StrictMode>,
)
