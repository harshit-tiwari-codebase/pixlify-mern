import React from 'react'

import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import Feed from './features/post/Pages/Feed'
import CreatePost from './features/post/Pages/CreatePost'

const AppRoutes = () => {
  return (
    <BrowserRouter>
       <Routes>
          <Route path = "/login" element = {<Login/>} />
          <Route path = "/register" element = {<Register/>} />
          <Route path = "/" element = {<Feed/>} />
          <Route path=  "/createPost" element = {<CreatePost/>}  />
       </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes;
