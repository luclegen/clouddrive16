import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Sex from '../../models/Sex'
import helper from '../../services/helper'
import { close } from '../Login/slice'
import { check, selectAvailable } from '../Home/slice'
import { create } from './slice'

export default function Register() {
  const dispatch = useDispatch()

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

  useEffect(() => window.onbeforeunload = () =>
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
      : undefined)

  const enterFirstName = e => e.target.setCustomValidity(e.target.value ? helper.isFirstName(e.target.value) ? '' : 'Invalid first name.' : 'This field is required.')

  const enterLastName = e => e.target.setCustomValidity(e.target.value ? helper.isLastName(e.target.value) ? '' : 'Invalid last name.' : 'This field is required.')

  const enterEmail = e => e.target.value
    && dispatch(check(e.target.value))
      .then(action => e.target.setCustomValidity(e.target.value
        ? helper.isEmail(e.target.value)
          ? action.payload
            ? ''
            : 'Email is duplicate.'
          : 'Invalid email.'
        : 'This field is required.'))

  const enterPassword = e => {
    const check = helper.checkPassword(e.target.value)

    e.target.setCustomValidity(e.target.value ? check.isStrong ? '' : 'Please choose a stronger password. Try a mix of letters, numbers, and symbols (use 8 or more characters).' : 'This field is required.')
    document.querySelector('meter').value = check.level
    setStrength(check.strength)
  }

  const enterConfirm = e => e.target.setCustomValidity(e.target.value ? e.target.value === password ? '' : 'The passwords do not match.' : 'This field is required.')

  const isValidDob = () => (submitted || day !== (new Date()).getDate().toString() || month !== ((new Date()).getMonth()).toString() || year !== (new Date()).getFullYear().toString()) && (helper.isDate(year, month, day) ? helper.isOldEnough(year) ? 'is-valid' : 'is-invalid' : 'is-invalid')

  const chooseDob = e =>
    document
      .querySelector('#dayRegister')
      .setCustomValidity(helper.isDate(
        e.target.id === 'yearRegister'
          ? e.target.value
          : year,
        e.target.id === 'monthRegister'
          ? e.target.value
          : month,
        e.target.id === 'dayRegister'
          ? e.target.value
          : day)
        ? '' : 'Invalid date of birth.')
    || document
      .querySelector('#yearRegister')
      .setCustomValidity(
        (new Date()).getFullYear() - parseInt(e.target.id === 'yearRegister'
          ? e.target.value
          : year) >= 5
          ? ''
          : 'You must be 5 years or older')

  const checkSex = e =>
    (/form-check-female/.test(e.target.className)
      || /form-check-male/.test(e.target.className)
      || /form-check-other/.test(e.target.className))
    && setSex(Array.from(e.target.children)[1].value)

  const chooseSex = () =>
    document
      .querySelector('#femaleRegister')
      .setCustomValidity(sex
        ? ''
        : 'Please select one of these options')

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
    }))
      .then(action =>
        action.type === 'register/create/fulfilled'
        && (setFirstName('')
          || setLastName('')
          || setEmail('')
          || setPassword('')
          || setConfirm('')
          || setDay((new Date()).getDate().toString())
          || setMonth((new Date()).getMonth().toString())
          || setYear((new Date()).getFullYear().toString())
          || setSex('')
          || setSubmitted(false)
          || (document.querySelector('meter').value = 0)
          || e.target.reset())
      );

  return <section className="section-floating-center">
    <form className="form-register" onSubmit={submit}>
      <div className="row">
        <div className="col-md-close">
          <button className="btn-close" type="reset" onClick={() => dispatch(close())}></button>
        </div>
      </div>
      <h1 className="h1-register">Sign Up</h1>
      <div className="row-name">
        <div className="col-md">
          <div className="form-floating">
            <input className={`form-control ${first_name && (helper.isFirstName(first_name) ? 'is-valid' : 'is-invalid')}`} id="firstNameRegister" name="first_name" type="text" placeholder="First name" pattern={helper.firstNamePattern} onInput={enterFirstName} onInvalid={enterFirstName} onChange={e => setFirstName(e.target.value)} required />
            <label htmlFor="firstNameRegister">First name</label>
          </div>
        </div>
        <div className="col-md">
          <div className="form-floating">
            <input className={`form-control ${last_name && (helper.isLastName(last_name) ? 'is-valid' : 'is-invalid')}`} id="lastNameRegister" name="last_name" type="text" placeholder="Last name" pattern={helper.lastNamePattern} onInput={enterLastName} onInvalid={enterLastName} onChange={e => setLastName(e.target.value)} required />
            <label htmlFor="lastNameRegister">Last name</label>
          </div>
        </div>
      </div>
      <div className="form-floating-email">
        <input className={`form-control ${email && (helper.isEmail(email) && available ? 'is-valid' : 'is-invalid')}`} id="addressRegister" name="email" type="email" placeholder="Email" pattern={helper.emailPattern} onInput={enterEmail} onInvalid={enterEmail} onChange={e => setEmail(e.target.value)} required />
        <label htmlFor="addressRegister">Email</label>
      </div>
      <div className="row-password">
        <div className="col-md">
          <div className="form-floating form-floating-password">
            <input className={`form-control ${password && (helper.checkPassword(password).isStrong ? 'is-valid' : 'is-invalid')}`} id="passwordRegister" name="password" type="password" placeholder="Password" minLength="8" onInput={enterPassword} onChange={e => setPassword(e.target.value)} required />
            <label htmlFor="passwordRegister">Password</label>
          </div>
        </div>
        <div className="col-md">
          <div className="form-floating form-floating-confirm">
            <input className={`form-control ${confirm && (confirm === password ? 'is-valid' : 'is-invalid')}`} id="confirmRegister" name="confirm" type="password" placeholder="Confirm" onInput={enterConfirm} onInvalid={enterConfirm} onChange={e => setConfirm(e.target.value)} required />
            <label htmlFor="confirmRegister">Confirm</label>
          </div>
        </div>
      </div>
      <meter id="passwordStrengthRegister" title="Use 8 or more characters with a mix of letters, numbers & symbols" max="4" value="0"></meter>
      <div className="form-group-password-strength">
        {strength && <label className="password-strength" htmlFor="passwordStrengthRegister">{helper.checkPassword(password).strength}</label>}
      </div>
      <label className={`label-group ${isValidDob()}`} htmlFor="dobRegister">Date of birth</label>
      <div className="row-dob" id="dobRegister">
        <div className="col-md">
          <div className="form-floating">
            <select className={`form-control-day ${isValidDob()}`} id="dayRegister" name="day" value={day} placeholder="Day" onInput={chooseDob} onChange={e => setDay(e.target.value)} required>
              {'0'.repeat(31).split('').map((v, i) => <option key={i} value={i + 1} >{i + 1}</option>)}
            </select>
            <label htmlFor="dayRegister">Day</label>
          </div>
        </div>
        <div className="col-md">
          <div className="form-floating">
            <select className={`form-control-month ${isValidDob()}`} id="monthRegister" name="month" value={month} placeholder="Month" onInput={chooseDob} onChange={e => setMonth(e.target.value)} required>
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((v, i) => <option key={i} value={i} >{v}</option>)}
            </select>
            <label htmlFor="monthRegister">Month</label>
          </div>
        </div>
        <div className="col-md">
          <div className="form-floating">
            <select className={`form-control-year ${isValidDob()}`} id="yearRegister" name="year" placeholder="Year" aria-describedby="validationDateOfBirth" onInput={chooseDob} onChange={e => setYear(e.target.value)} required>
              {'0'.repeat(200).split('').map((v, i) => <option key={i} value={(new Date()).getFullYear() - i} >{(new Date()).getFullYear() - i}</option>)}
            </select>
            <label htmlFor="yearRegister">Year</label>
          </div>
        </div>
      </div>
      <label className={`label-group ${sex ? 'is-valid' : submitted && !sex && 'is-invalid'}`} htmlFor="genderRegister">Gender</label>
      <div className="row-gender" id="genderRegister">
        <div className="col-md">
          <div className={`form-check-female ${sex ? 'is-valid' : submitted && !sex && 'is-invalid'}`} onClick={checkSex}>
            <label className="label-female" htmlFor="femaleRegister">Female</label>
            <input className="input-female" id="femaleRegister" type="radio" name="sex" value={Sex.FEMALE} checked={sex === Sex.FEMALE} onInput={chooseSex} onChange={e => setSex(e.target.value)} required />
          </div>
        </div>
        <div className="col-md">
          <div className={`form-check-male ${sex ? 'is-valid' : submitted && !sex && 'is-invalid'}`} onClick={checkSex}>
            <label className="label-male" htmlFor="maleRegister">Male</label>
            <input className="input-male" id="maleRegister" type="radio" name="sex" value={Sex.MALE} checked={sex === Sex.MALE} onInput={chooseSex} onChange={e => setSex(e.target.value)} required />
          </div>
        </div>
        <div className="col-md">
          <div className={`form-check-other ${sex ? 'is-valid' : submitted && !sex && 'is-invalid'}`} onClick={checkSex}>
            <label className="label-other" htmlFor="otherRegister">Other</label>
            <input className="input-other" id="otherRegister" type="radio" name="sex" value={Sex.OTHER} checked={sex === Sex.OTHER} onInput={chooseSex} onChange={e => setSex(e.target.value)} required />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-sign-up">
          <button className="btn-sign-up" type="submit">Sign up</button>
        </div>
      </div>
    </form>
  </section>
}
