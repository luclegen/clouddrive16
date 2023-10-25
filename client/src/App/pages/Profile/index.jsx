import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NotFound from '../NotFound'
import { setWidth } from '../../components/Header/slice'
import Information from '../../components/Information'
import Email from '../../components/Email';
import Password from '../../components/Password';

export default function Profile(props) {
  const dispatch = useDispatch()
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    window.onresize = () => {
      dispatch(setWidth())
    }
  }, [])

  return <main>
    <nav className="left-nav col-2" id="leftNav">
      <ul className="list-group">
        <NavLink to="/profile/information">
          <li
            className={`list-group-item${location.pathname === '/profile/information' ? ' active' : ''}`}
          >
            &nbsp;{t('Information')}
          </li>
        </NavLink>
        <NavLink to="/profile/email">
          <li
            className={`list-group-item${location.pathname === '/profile/email' ? ' active' : ''}`}
          >
            &nbsp;Email
          </li>
        </NavLink>
        <NavLink to="/profile/password">
          <li
            className={`list-group-item${location.pathname === '/profile/password' ? ' active' : ''}`}
          >
            &nbsp;{t('Password')}
          </li>
        </NavLink>
      </ul>
    </nav>
    <Routes>
      <Route path="/information" element={<Information />} />
      <Route path="/email" element={<Email />} />
      <Route path="/password" element={<Password />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </main>
}
