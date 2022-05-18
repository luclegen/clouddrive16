import React, { Component } from 'react'
import helper from '../../services/helper'
import Register from '../user/Register'
import authService from '../../services/auth'

const state = {
  email: '',
  password: '',
  remember: false,
  available: false,
  visible: false,
  isOpen: false
}

export default class Login extends Component {
  constructor(props) {
    super(props)

    this.state = state
  }

  setValue = e => this.setState({ [e.target.getAttribute('name')]: e.target.value })

  setChecked = e => this.setState({ [e.target.getAttribute('name')]: e.target.checked })

  enterEmail = async e => {
    if (e.target.value) {
      const available = (await authService.available(e.target.value)).status === 200
      e.target.setCustomValidity(helper.isEmail(e.target.value)
        ? available
          ? 'Email not registered'
          : ''
        : 'Invalid email!')
      this.setState({ available: available, visible: false, password: '' })
      setTimeout(() => {
        if (document.querySelector('.form-group-password'))
          document.querySelector('.form-group-password').style.height = 0
        document.querySelector('.input-email').style.width = 260 + 'px'
      })
    }
  }

  open = () => this.setState({ isOpen: true })

  close = () => this.setState({ isOpen: false })

  onSubmit = e => {
    e.preventDefault()

    if (this.state.email) {
      this.setState({ visible: true })
      setTimeout(() => {
        document.querySelector('.form-group-password').style.height = 39 + 'px'
        document.querySelector('.input-email').style.width = 315 + 'px'
        document.querySelector('.input-password').focus()

        this.state.password && authService
          .login(this.state)
          .then(res => {
            helper.setCookies(res.data, this.state.remember ? 365 * 24 * 60 * 60 : 0)
            this.setState(state)
            helper.getCookie('is_activate') === 'false'
              && alert('Your session exists for 5 minutes.')
            window.location.reload()
          })
      })
    }
  }

  componentDidUpdate = () => window.onbeforeunload = () => this.state.email || this.state.password ? true : undefined

  render = () => <section className="section-only">
    <form className="form-only" onSubmit={this.onSubmit}>
      <img className='logo-img' src="/logo.png" alt={process.env.REACT_APP_NAME + ' logo'} />
      <h1 className="h1-only">Sign in to {process.env.REACT_APP_NAME}</h1>
      <div className={`form-group-email ${this.state.visible ? 'rounded-top' : 'rounded'}`}>
        <input className="input-email" type="email" name="email" placeholder="Email" value={this.state.email} pattern={helper.emailPattern} onInput={this.enterEmail} onInvalid={this.enterEmail} onChange={this.setValue} title="Please fill out this field." required />
        {!this.state.visible && <button className="btn-input" type="submit" disabled={!this.state.email} hidden={true}>
          <i className="material-icons">input</i>
        </button>}
      </div>
      <div className="form-group-container">
        {this.state.visible && this.state.email && <div className="form-group-password">
          <input className="input-password" type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.setValue} required />
          <button className="btn-input" type="submit" disabled={!this.state.password}>
            <i className="material-icons">input</i>
          </button>
        </div>}
      </div>
      <div className="form-check-remember">
        <input className="remember-me-input" id="rememberLogin" type="checkbox" name="remember" value={this.state.remember} onChange={this.setChecked} />
        <label className="remember-me-label" htmlFor="rememberLogin">Keep me signed in</label>
      </div>
      <a href="/find-account" target="_blank" rel="noopener noreferrer">Forgotten password? <i className="fas fa-external-link-alt"></i></a>
      <button className="btn-create-account" type="button" onClick={this.open}>Create New Account</button>
    </form>
    {this.state.isOpen && <Register close={this.close}></Register>}
  </section>
}