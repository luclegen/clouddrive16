import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import './App.sass'
import Header from './components/Header'
import Loader from './components/Loader'

const Home = lazy(() => import('./components/Home'))

export default function App() {
  return <BrowserRouter>
    <Header />
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route exact path="/" element={<Home />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
}
