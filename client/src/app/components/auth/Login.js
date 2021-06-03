import React, { Component } from 'react'
import helper from '../../services/helper'
import Register from '../user/Register'
import authService from '../../services/auth'
import codeService from '../../services/code'

const state = {
  email: '',
  password: '',
  remembered: false,
  available: false,
  visible: false,
  opened: false
}

class Login extends Component {
  constructor(props) {
    super(props)

    this.setEmail = this.setEmail.bind(this)
    this.setPassword = this.setPassword.bind(this)
    this.setRemembered = this.setRemembered.bind(this)

    this.state = state
  }

  setEmail = e => this.setState({ email: e.target.value })

  setPassword = e => this.setState({ password: e.target.value })

  setRemembered = e => this.setState({ remembered: e.target.checked })

  enterEmail = async e => {
    const available = (await authService.available(e.target.value)).data.available
    e.target.setCustomValidity(helper.isEmail(e.target.value) ? available ? '' : 'Email not registered' : 'Invalid email!')
    this.setState({ available: available, visible: false, password: '' })
    setTimeout(() => {
      if (document.querySelector('.form-group-password')) document.querySelector('.form-group-password').style.height = 0
      document.querySelector('.input-email').style.width = 260 + 'px'
    })
  }

  open = () => this.setState({ opened: true })
  close = () => this.setState({ opened: false })

  onSubmit = e => {
    e.preventDefault()

    if (this.state.email) {
      this.setState({ visible: true })
      setTimeout(() => {
        document.querySelector('.form-group-password').style.height = 39 + 'px'
        document.querySelector('.input-email').style.width = 310 + 'px'
        document.querySelector('.input-password').focus()

        if (this.state.password)
          authService.authenticate(this.state)
            .then(res => {
              localStorage.setItem('token', res.data.token)
              localStorage.setItem('remembered', this.state.remembered)
              this.setState(state)
              if (!helper.getPayload().activated) {
                alert('Your session exists for 5 minutes.')
                codeService.create()
                  .catch(err => alert(err.response.data.msg))
              }
              window.location.reload()
            })
            .catch(err => alert(err.response.data.msg))
      })
    }
  }

  componentDidUpdate = () => window.onbeforeunload = () => this.state.email || this.password ? true : undefined

  render = () => <section className="section-only">
    <form className="form-only" onSubmit={this.onSubmit}>
      <img className='logo-img' src="/logo.png" alt={process.env.REACT_APP_CLIENT_NAME + ' logo'} />
      <h1 className="h1-only">Sign in to {process.env.REACT_APP_CLIENT_NAME}</h1>
      <div className={`form-group-email ${this.state.visible ? 'rounded-top' : 'rounded'}`}>
        <input className="input-email" type="email" name="email" placeholder="Email" value={this.state.email} pattern={helper.emailPattern} onInput={this.enterEmail} onInvalid={this.enterEmail} onChange={this.setEmail} title="Please fill out this field." required />
        {!this.state.visible && <button className="btn-input" type="submit" disabled={!this.state.email} hidden={true}>
          <i className="material-icons">input</i>
        </button>}
      </div>
      <div className="form-group-container">
        {this.state.visible && this.state.email && <div className="form-group-password">
          <input className="input-password" type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.setPassword} required />
          <button className="btn-input" type="submit" disabled={!this.state.password}>
            <i className="material-icons">input</i>
          </button>
        </div>}
      </div>
      <div className="form-check-remember">
        <input className="remember-me-input" id="remember-me" type="checkbox" name="remember-me" value={this.state.remembered} onChange={this.setRemembered} />
        <label className="remember-me-label" htmlFor="remember-me">Keep me signed in</label>
      </div>
      <a href="/find-account" target="_blank" rel="noopener noreferrer">Forgotten password? <i className="fas fa-external-link-alt"></i></a>
      <button className="btn-create-account" type="button" onClick={this.open}>Create New Account</button>
    </form>
    {this.state.opened && <Register close={this.close}></Register>}
  </section>
}

export default Login