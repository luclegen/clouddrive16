import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import CloseIcon from '@mui/icons-material/Close'
import Sex from '../../models/Sex'
import helper from '../../services/helper'
import { close } from '../Login/slice'
import {
  check,
  selectAvailable,
  selectLang,
  setLoggedIn
} from '../../slice'
import { create } from './slice'
import Lang from '../../models/Lang'

export default function Registration() {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const lang = useSelector(selectLang)
  const available = useSelector(selectAvailable)

  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [strength, setStrength] = useState('')
  const [day, setDay] = useState((new Date()).getDate().toString())
  const [month, setMonth] = useState((new Date()).getMonth().toString())
  const [year, setYear] = useState((new Date()).getFullYear().toString())
  const [sex, setSex] = useState('')
  const [submitted, setSubmitted] = useState('')

  useEffect(() => {
    document
      .querySelector('#femaleRegistration')
      .setCustomValidity(t('Please select one of these options.'))
    document
      .querySelector('#yearRegistration')
      .setCustomValidity(t('You must be 5 years or older.'))

    window.onbeforeunload = () =>
      first_name
        || last_name
        || email
        || password
        || confirm
        || day !== (new Date()).getDate().toString()
        || month !== (new Date()).getMonth().toString()
        || year !== (new Date()).getFullYear().toString()
        || sex
        ? true
        : undefined
  })

  const enterEmail = e => e.target.value
    ? dispatch(check(e.target.value))
      .then(action => e.target.setCustomValidity(e.target.value
        ? helper.isEmail(e.target.value)
          ? action.payload
            ? ''
            : t('Email is duplicate.')
          : t('Invalid email.')
        : t('This field is required.')))
    : e.target.setCustomValidity(t('This field is required.'))

  const enterPassword = e => {
    const check = helper.checkPassword(e.target.value)

    e.target.setCustomValidity(e.target.value
      ? check.isStrong
        ? ''
        : t('Please choose a stronger password. Try a mix of letters, numbers, and symbols (use 8 or more characters).')
      : t('This field is required.'))
    document.querySelector('meter').value = check.level
    setStrength(check.strength)
  }

  const enterConfirm = e => e.target.setCustomValidity(e.target.value ? e.target.value === password ? '' : t('The passwords do not match.') : t('This field is required.'))

  const enterFirstName = e => e.target.setCustomValidity(e.target.value ? '' : t('This field is required.'))

  const enterLastName = e => e.target.setCustomValidity(e.target.value ? '' : t('This field is required.'))

  const isValidDob = () => (submitted || day !== (new Date()).getDate().toString() || month !== ((new Date()).getMonth()).toString() || year !== (new Date()).getFullYear().toString()) && (helper.isDate(year, month, day) ? helper.isOldEnough(year) ? 'is-valid' : 'is-invalid' : 'is-invalid')

  const chooseDob = e => {
    document
      .querySelector('#dayRegistration')
      .setCustomValidity(helper.isDate(
        e.target.id === 'yearRegistration'
          ? e.target.value
          : year,
        e.target.id === 'monthRegistration'
          ? e.target.value
          : month,
        e.target.id === 'dayRegistration'
          ? e.target.value
          : day)
        ? '' : t('Invalid date of birth.'))
    document
      .querySelector('#yearRegistration')
      .setCustomValidity(
        (new Date()).getFullYear() - parseInt(e.target.id === 'yearRegistration'
          ? e.target.value
          : year) >= 5
          ? ''
          : t('You must be 5 years or older.'))
  }

  const checkSex = e =>
    (/form-check-female/.test(e.target.className)
      || /form-check-male/.test(e.target.className)
      || /form-check-other/.test(e.target.className))
    && setSex(Array.from(e.target.children)[1].value)

  const chooseSex = () =>
    document
      .querySelector('#femaleRegistration')
      .setCustomValidity(sex
        ? ''
        : t('Please select one of these options.'))

  const submit = e => e.preventDefault()
    || setSubmitted(true)
    || dispatch(create({
      first_name,
      last_name,
      email,
      password,
      day,
      month,
      year,
      sex,
      lang
    }))
      .then(action => {
        if (action.type === 'registration/create/fulfilled') {
          setFirstName('')
          setLastName('')
          setEmail('')
          setPassword('')
          setConfirm('')
          setDay((new Date()).getDate().toString())
          setMonth((new Date()).getMonth().toString())
          setYear((new Date()).getFullYear().toString())
          setSex('')
          setSubmitted(false)
          document.querySelector('meter').value = 0
          e.target.reset()

          dispatch(close())

          dispatch(setLoggedIn(true))
        }
      });

  return <section className="section-floating-center">
    <form className="form-registration" onSubmit={submit}>
      <div className="row">
        <div className="col-md-close">
          <button className="btn-close" type="reset" onClick={() => dispatch(close())}><CloseIcon /></button>
        </div>
      </div>
      <h1 className="h1-registration">{t('Sign Up')}</h1>
      <div className={`row-name${lang === Lang.VI ? ' flex-md-row-reverse' : ''}`}>
        <div className="col-md">
          <div className="form-floating">
            <input className="form-control" id="firstNameRegistration" name="first_name" type="text" placeholder={t('First name')} onInput={enterFirstName} onInvalid={enterFirstName} onChange={e => setFirstName(e.target.value)} required />
            <label htmlFor="firstNameRegistration">{t('First name')}</label>
          </div>
        </div>
        <div className="col-md">
          <div className="form-floating">
            <input className="form-control" id="lastNameRegistration" name="last_name" type="text" placeholder={t('Last name')} onInput={enterLastName} onInvalid={enterLastName} onChange={e => setLastName(e.target.value)} required />
            <label htmlFor="lastNameRegistration">{t('Last name')}</label>
          </div>
        </div>
      </div>
      <div className="form-floating-email">
        <input className={`form-control ${email && (helper.isEmail(email) && available ? 'is-valid' : 'is-invalid')}`} id="addressRegistration" name="email" type="email" placeholder="Email" pattern={helper.emailPattern} onInput={enterEmail} onInvalid={enterEmail} onChange={e => setEmail(e.target.value)} required />
        <label htmlFor="addressRegistration">Email</label>
      </div>
      <div className="row-password">
        <div className="col-md">
          <div className="form-floating form-floating-password">
            <input className={`form-control ${password && (helper.checkPassword(password).isStrong ? 'is-valid' : 'is-invalid')}`} id="passwordRegistration" name="password" type="password" placeholder={t('Password')} minLength="8" onInput={enterPassword} onInvalid={enterPassword} onChange={e => setPassword(e.target.value)} required />
            <label htmlFor="passwordRegistration">{t('Password')}</label>
          </div>
        </div>
        <div className="col-md">
          <div className="form-floating form-floating-confirm">
            <input className={`form-control ${confirm && (confirm === password ? 'is-valid' : 'is-invalid')}`} id="confirmRegistration" name="confirm" type="password" placeholder={t('Confirm')} onInput={enterConfirm} onInvalid={enterConfirm} onChange={e => setConfirm(e.target.value)} required />
            <label htmlFor="confirmRegistration">{t('Confirm')}</label>
          </div>
        </div>
      </div>
      <meter id="passwordStrengthRegistration" title="Use 8 or more characters with a mix of letters, numbers & symbols" max="4" value="0"></meter>
      <div className="input-group-password-strength">
        {strength && <label className="password-strength" htmlFor="passwordStrengthRegistration">{t(helper.checkPassword(password).strength)}</label>}
      </div>
      <label className={`label-group ${isValidDob()}`} htmlFor="dobRegistration">{t('Date of birth')}</label>
      <div className="row-dob" id="dobRegistration">
        <div className="col-md">
          <div className="form-floating">
            <select className={`form-control-day ${isValidDob()}`} id="dayRegistration" name="day" value={day} placeholder={t('Day')} onInput={chooseDob} onInvalid={chooseDob} onChange={e => setDay(e.target.value)} required>
              {'0'.repeat(31).split('').map((v, i) => <option key={i} value={i + 1} >{i + 1}</option>)}
            </select>
            <label htmlFor="dayRegistration">{t('Day')}</label>
          </div>
        </div>
        <div className="col-md">
          <div className="form-floating">
            <select className={`form-control-month ${isValidDob()}`} id="monthRegistration" name="month" value={month} placeholder={t('Month')} onInput={chooseDob} onInvalid={chooseDob} onChange={e => setMonth(e.target.value)} required>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((v, i) => <option key={i} value={i} >{v}</option>)}
            </select>
            <label htmlFor="monthRegistration">{t('Month')}</label>
          </div>
        </div>
        <div className="col-md">
          <div className="form-floating">
            <select className={`form-control-year ${isValidDob()}`} id="yearRegistration" name="year" placeholder={t('Year')} aria-describedby="validationDateOfBirth" onInput={chooseDob} onInvalid={chooseDob} onChange={e => setYear(e.target.value)} required>
              {'0'.repeat(200).split('').map((v, i) => <option key={i} value={(new Date()).getFullYear() - i} >{(new Date()).getFullYear() - i}</option>)}
            </select>
            <label htmlFor="yearRegistration">{t('Year')}</label>
          </div>
        </div>
      </div>
      <label className={`label-group ${sex ? 'is-valid' : submitted && !sex && 'is-invalid'}`} htmlFor="genderRegistration">{t('Gender')}</label>
      <div className="row-gender" id="genderRegistration">
        <div className="col-md">
          <div className={`form-check-female ${sex ? 'is-valid' : submitted && !sex && 'is-invalid'}`} onClick={checkSex}>
            <label className="label-female" htmlFor="femaleRegistration">{t('Female')}</label>
            <input className="input-female" id="femaleRegistration" type="radio" name="sex" value={Sex.FEMALE} checked={sex === Sex.FEMALE} onInput={chooseSex} onInvalid={chooseSex} onChange={e => setSex(e.target.value)} required />
          </div>
        </div>
        <div className="col-md">
          <div className={`form-check-male ${sex ? 'is-valid' : submitted && !sex && 'is-invalid'}`} onClick={checkSex}>
            <label className="label-male" htmlFor="maleRegistration">{t('Male')}</label>
            <input className="input-male" id="maleRegistration" type="radio" name="sex" value={Sex.MALE} checked={sex === Sex.MALE} onInput={chooseSex} onInvalid={chooseSex} onChange={e => setSex(e.target.value)} required />
          </div>
        </div>
        <div className="col-md">
          <div className={`form-check-other ${sex ? 'is-valid' : submitted && !sex && 'is-invalid'}`} onClick={checkSex}>
            <label className="label-other" htmlFor="otherRegistration">{t('Other')}</label>
            <input className="input-other" id="otherRegistration" type="radio" name="sex" value={Sex.OTHER} checked={sex === Sex.OTHER} onInput={chooseSex} onInvalid={chooseSex} onChange={e => setSex(e.target.value)} required />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-sign-up">
          <button className="btn-sign-up" type="submit">{t('Sign up')}</button>
        </div>
      </div>
    </form>
  </section>
}
