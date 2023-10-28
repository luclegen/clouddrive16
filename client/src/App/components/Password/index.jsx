import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box, TextField } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import helper from '../../services/helper'
import { setWidth } from '../Header/slice'
import { changePassword } from '../../slice'

export default function Password() {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [password, setPassword] = useState('')
  const [strength, setStrength] = useState('')
  const [new_password, setNewPassword] = useState('')
  const [confirm_password, setConfirmPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    window.onresize = () => {
      setSectionRight()
      dispatch(setWidth())
    }
    setSectionRight()
    // refresh()
  }, [])

  const setSectionRight = () => {
    const sectionRight = document.querySelector('.section-right')

    sectionRight.style.marginLeft = `${document
      .querySelector('.left-nav')
      .clientWidth}px`
  }

  const enterNewPassword = e => {
    const check = helper.checkPassword(e.target.value)

    e.target.setCustomValidity(e.target.value
      ? check.isStrong
        ? ''
        : t('Please choose a stronger password. Try a mix of letters, numbers, and symbols (use 8 or more characters).')
      : t('This field is required.'))
    document.querySelector('meter').value = check.level
    setStrength(check.strength)
  }

  const enterPassword = e => {
    e.target.setCustomValidity(e.target.value
      ? ''
      : t('This field is required.'))
  }

  const enterConfirmPassword = e => {
    e.target.setCustomValidity(e.target.value
      ? e.target.value === new_password
        ? ''
        : t('The passwords do not match.')
      : t('This field is required.'))
  }

  const submit = e => {
    e.preventDefault()

    setSubmitted(true)

    if (new_password !== confirm_password) alert(t('The passwords do not match. '))
    else {
      dispatch(changePassword({ password, new_password }))
        .then(action => {
          if (action.type === 'app/changePassword/fulfilled') alert(action.payload)
        })
    }
  }

  return <section className="section-only section-right">
    <Box
      className='form-only'
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' }
      }}
      autoComplete="off"
      onSubmit={submit}
    >
      <h1>{t('Change password')}</h1>
      <div>
        <TextField
          id="password"
          label={t('Password')}
          type="password"
          autoComplete="current-password"
          variant="filled"
          value={password}
          error={submitted && !password}
          required
          onInput={enterPassword}
          onInvalid={enterPassword}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <meter id="passwordStrengthPassword" title="Use 8 or more characters with a mix of letters, numbers & symbols" max="4" value="0"></meter>
      <div>
        <div className="input-group-password-strength">
          {strength && <label className="password-strength" htmlFor="passwordStrengthRegistration">{t(helper.checkPassword(new_password).strength)}</label>}
        </div>
      </div>
      <div>
        <TextField
          id="newPassword"
          label={t('New Password')}
          type="password"
          autoComplete="current-password"
          variant="filled"
          value={new_password}
          error={submitted && !helper.checkPassword(new_password).isStrong}
          required
          onInput={enterNewPassword}
          onInvalid={enterNewPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id="confirmPassword"
          label={t('Confirm Password')}
          type="password"
          autoComplete="current-password"
          variant="filled"
          value={confirm_password}
          error={submitted && new_password !== confirm_password}
          required
          onInput={enterConfirmPassword}
          onInvalid={enterConfirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
      </div>
      <div>
        <button className="btn-save"><SaveIcon />&nbsp;{t('Save')}</button>
      </div>
    </Box>
  </section>
}
