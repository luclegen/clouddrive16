import React, { Component } from 'react'
import helper from '../../services/helper'
import authService from '../../services/auth'
import userService from '../../services/user'

const state = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirm: '',
  day: (new Date()).getDate().toString(),
  month: (new Date()).getMonth().toString(),
  year: (new Date()).getFullYear().toString(),
  sex: '',
  available: true,
  submitted: false
}

class Register extends Component {
  constructor(props) {
    super(props)

    this.setFirstName = this.setFirstName.bind(this)
    this.setLastName = this.setLastName.bind(this)
    this.setEmail = this.setEmail.bind(this)
    this.setPassword = this.setPassword.bind(this)
    this.setConfirm = this.setConfirm.bind(this)
    this.setDay = this.setDay.bind(this)
    this.setMonth = this.setMonth.bind(this)
    this.setYear = this.setYear.bind(this)
    this.setSex = this.setSex.bind(this)

    this.state = state
  }

  setFirstName = e => this.setState({ firstName: e.target.value })

  setLastName = e => this.setState({ lastName: e.target.value })

  setEmail = e => this.setState({ email: e.target.value })

  setPassword = e => this.setState({ password: e.target.value })

  setConfirm = e => this.setState({ confirm: e.target.value })

  setDay = e => this.setState({ day: e.target.value })

  setMonth = e => this.setState({ month: e.target.value })

  setYear = e => this.setState({ year: e.target.value })

  setSex = e => this.setState({ sex: e.target.value })

  checkSex = e => { if (e.target.className === 'form-check-female' || e.target.className === 'form-check-male' || e.target.className === 'form-check-other') this.setState({ sex: Array.from(e.target.children)[1].value }) }

  enterFirstName = e => e.target.setCustomValidity(e.target.value ? helper.isFirstName(e.target.value) ? '' : 'Invalid first name.' : 'This field is required.')

  enterLastName = e => e.target.setCustomValidity(e.target.value ? helper.isLastName(e.target.value) ? '' : 'Invalid last name.' : 'This field is required.')

  enterEmail = async e => {
    const available = (await authService.available(e.target.value)).data.available
    this.setState({ available: available })
    e.target.setCustomValidity(e.target.value ? helper.isEmail(e.target.value) ? available ? 'Email is duplicate.' : '' : 'Invalid email.' : 'This field is required.')
  }

  enterPassword = e => {
    const check = helper.checkPassword(e.target.value)

    e.target.setCustomValidity(e.target.value ? check.isStrong ? '' : 'Please choose a stronger password. Try a mix of letters, numbers, and symbols (use 8 or more characters).' : 'This field is required.')
    document.querySelector('meter').value = check.level
    this.setState({ strength: check.strength })
  }

  enterConfirm = e => e.target.setCustomValidity(e.target.value ? e.target.value === this.state.password ? '' : 'The passwords do not match.' : 'This field is required.')

  chooseDateOfBirth = e => {
    document.querySelector('#dayRegister').setCustomValidity(helper.isDate(e.target.id === 'yearRegister' ? e.target.value : this.state.year, e.target.id === 'monthRegister' ? e.target.value : this.state.month, e.target.id === 'dayRegister' ? e.target.value : this.state.day) ? '' : 'Invalid date of birth.')
    document.querySelector('#yearRegister').setCustomValidity((new Date()).getFullYear() - parseInt(e.target.id === 'yearRegister' ? e.target.value : this.state.year) >= 5 ? '' : 'You must be 5 years or older')
  }

  chooseSex = () => document.querySelector('#female-register').setCustomValidity(this.state.sex ? '' : 'Please select one of these options')

  getIsValidDateOfBirth = () => (this.state.submitted || this.state.day !== (new Date()).getDate().toString() || this.state.month !== (new Date()).getMonth().toString() || this.state.year !== (new Date()).getFullYear().toString()) && (helper.isDate(this.state.year, this.state.month, this.state.day) && helper.isOldEnough(this.state.year) ? 'is-valid' : 'is-invalid')

  onSubmit = e => {
    e.preventDefault()
    this.setState({ submitted: true })

    if (this.state.password === this.state.confirm &&
      this.state.firstName &&
      this.state.lastName &&
      this.state.email &&
      this.state.password &&
      this.state.confirm &&
      this.state.day &&
      this.state.month &&
      this.state.year
    ) {
      document.querySelector('#female-register').setCustomValidity(this.state.sex ? '' : 'Please select one of these options')
      document.querySelector('#yearRegister').setCustomValidity(helper.isOldEnough(this.state.year) ? '' : 'You must be 5 years or older')

      userService.create(this.state)
        .then(res => {
          alert(res.data.msg)
          document.querySelector('.form-register').reset()
          document.querySelector('meter').value = 0
          this.setState(state)
        })
    }
  }

  componentDidUpdate = () => window.onbeforeunload = () => this.state.firstName || this.state.lastName || this.state.email || this.state.password || this.state.day || this.state.month || this.state.year || this.state.sex ? true : undefined

  render = () => {
    const sex = Object.freeze({
      FEMALE: 'female',
      MALE: 'male',
      OTHER: 'other'
    })

    return <section className="section-register">
      <form className="form-register" onSubmit={this.onSubmit}>
        <button className="close" type="reset" onClick={this.props.close}>
          <i className="material-icons">close</i>
        </button>
        <h1 className="h1-register">Sign Up</h1>
        <div className="form-row">
          <div className={`form-floating col-md-6 ${this.state.firstName && 'float'}`}>
            <input className={`form-control ${this.state.firstName && (helper.isFirstName(this.state.firstName) ? 'is-valid' : 'is-invalid')}`} id="firstNameRegister" type="text" pattern={helper.firstNamePattern} onInput={this.enterFirstName} onInvalid={this.enterFirstName} onChange={this.setFirstName} required />
            <label htmlFor="firstNameRegister">First name</label>
          </div>
          <div className={`form-floating col-md-6 ${this.state.lastName && 'float'}`}>
            <input className={`form-control ${this.state.lastName && (helper.isLastName(this.state.lastName) ? 'is-valid' : 'is-invalid')}`} id="lastNameRegister" type="text" pattern={helper.lastNamePattern} onInput={this.enterLastName} onInvalid={this.enterLastName} onChange={this.setLastName} required />
            <label htmlFor="lastNameRegister">Last name</label>
          </div>
        </div>
        <div className={`form-floating ${this.state.email && 'float'}`}>
          <input className={`form-control ${this.state.email && (helper.isEmail(this.state.email) && !this.state.available ? 'is-valid' : 'is-invalid')}`} id="addressRegister" type="email" pattern={helper.emailPattern} onInput={this.enterEmail} onInvalid={this.enterEmail} onChange={this.setEmail} required />
          <label htmlFor="addressRegister">Email</label>
        </div>
        <div className="form-row">
          <div className={`form-floating col-md-6 ${this.state.password && 'float'} form-floating-password`}>
            <input className={`form-control ${this.state.password && (helper.checkPassword(this.state.password).isStrong ? 'is-valid' : 'is-invalid')}`} id="passwordRegister" type="password" minLength="8" onInput={this.enterPassword} onChange={this.setPassword} required />
            <label htmlFor="passwordRegister">Password</label>
          </div>
          <div className={`form-floating col-md-6 ${this.state.confirm && 'float'} form-floating-confirm`}>
            <input className={`form-control ${this.state.confirm && (this.state.confirm === this.state.password ? 'is-valid' : 'is-invalid')}`} id="confirmRegister" type="password" onInput={this.enterConfirm} onInvalid={this.enterConfirm} onChange={this.setConfirm} required />
            <label htmlFor="confirmRegister">Confirm</label>
          </div>
        </div>
        <meter id="passwordStrengthRegister" title="Use 8 or more characters with a mix of letters, numbers & symbols" max="4" value="0"></meter>
        <div className="form-group-password-strength">
          {this.state.strength && <label className="password-strength" htmlFor="passwordStrengthRegister">{helper.checkPassword(this.state.password).strength}</label>}
        </div>
        <label className={`label-group ${this.getIsValidDateOfBirth()}`} htmlFor="dateOfBirthRegister">Date of birth</label>
        <div className="form-row" id="dateOfBirthRegister">
          <div className={`form-floating col-md-4 ${this.state.day && 'float'}`}>
            <select className={`form-control-day ${this.getIsValidDateOfBirth()}`} id="dayRegister" required value={this.state.day} onInput={this.chooseDateOfBirth} onChange={this.setDay} >
              {'0'.repeat(31).split('').map((v, i) => <option key={i} value={i + 1} >{i + 1}</option>)}
            </select>
            <label htmlFor="dayRegister">Day</label>
          </div>
          <div className={`form-floating col-md-4 ${this.state.month && 'float'}`}>
            <select className={`form-control-month ${this.getIsValidDateOfBirth()}`} id="monthRegister" required value={this.state.month} onInput={this.chooseDateOfBirth} onChange={this.setMonth} >
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((v, i) => <option key={i} value={i} >{v}</option>)}
            </select>
            <label htmlFor="monthRegister">Month</label>
          </div>
          <div className={`form-floating col-md-4 ${this.state.year && 'float'}`}>
            <select className={`form-control-year ${this.getIsValidDateOfBirth()}`} id="yearRegister" required aria-describedby="validationDateOfBirth" onInput={this.chooseDateOfBirth} onChange={this.setYear} >
              {'0'.repeat(200).split('').map((v, i) => <option key={i} value={(new Date()).getFullYear() - i} >{(new Date()).getFullYear() - i}</option>)}
            </select>
            <label htmlFor="yearRegister">Year</label>
          </div>
        </div>
        <label className={`label-group ${this.state.sex ? 'is-valid' : this.state.submitted && !this.state.sex && 'is-invalid'}`} htmlFor="genderRegister">Gender</label>
        <div className="form-row" id="genderRegister">
          <div className="form-group col-md-4">
            <div className={`form-check-female ${this.state.sex ? 'is-valid' : this.state.submitted && !this.state.sex && 'is-invalid'}`} onClick={this.checkSex}>
              <label className="form-check-label flex-fill" htmlFor="female-register">Female</label>
              <input className="form-check-input is-valid" id="female-register" type="radio" name="sex" value={sex.FEMALE} checked={this.state.sex === sex.FEMALE} onInput={this.chooseSex} onChange={this.setSex} />
            </div>
          </div>
          <div className="form-group col-md-4">
            <div className={`form-check-male ${this.state.sex ? 'is-valid' : this.state.submitted && !this.state.sex && 'is-invalid'}`} onClick={this.checkSex}>
              <label className="form-check-label flex-fill" htmlFor="male-register">Male</label>
              <input className="form-check-input" id="male-register" type="radio" name="sex" value={sex.MALE} checked={this.state.sex === sex.MALE} onInput={this.chooseSex} onChange={this.setSex} />
            </div>
          </div>
          <div className="form-group col-md-4">
            <div className={`form-check-other ${this.state.sex ? 'is-valid' : this.state.submitted && !this.state.sex && 'is-invalid'}`} onClick={this.checkSex}>
              <label className="form-check-label flex-fill" htmlFor="other-register">Other</label>
              <input className="form-check-input" id="other-register" type="radio" name="sex" value={sex.OTHER} checked={this.state.sex === sex.OTHER} onInput={this.chooseSex} onChange={this.setSex} />
            </div>
          </div>
        </div>
        <div className="form-row-sign-up">
          <button className="btn-sign-up" type="submit">Sign up</button>
        </div>
      </form>
    </section >
  }
}

export default Register