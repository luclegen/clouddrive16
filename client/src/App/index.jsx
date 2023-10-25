import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Loader from './pages/Loader'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import './App.sass';

const Home = lazy(() => import('./pages/Home'))

export default function App() {
  return <BrowserRouter>
    <Header />
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/profile/*" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
}

