import React from 'react'
import { useSelector } from 'react-redux'
import { selectLoggedIn } from './slice'
import { selectIsActivate } from '../Activate/slice'
import Login from '../Login'
import Files from '../Files'
import Activate from '../Activate'

export default function Home() {
  const loggedIn = useSelector(selectLoggedIn)
  const is_activate = useSelector(selectIsActivate)

  return <main>
    {loggedIn ? is_activate ? <Files /> : <Activate /> : <Login />}
  </main>
}
