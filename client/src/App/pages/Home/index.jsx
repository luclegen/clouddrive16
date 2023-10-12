import React from 'react';
import { useSelector } from 'react-redux';
import { selectLoggedIn, selectIsActivate } from '../../slice';
import Login from '../../components/Login';
import Files from '../../components/Files';
import Activate from '../../components/Activate';

export default function Home() {
  const loggedIn = useSelector(selectLoggedIn);
  const is_activate = useSelector(selectIsActivate);

  return (
    <main>{loggedIn ? is_activate ? <Files /> : <Activate /> : <Login />}</main>
  );
}
