import React, { Component } from 'react'
import helper from '../services/helper'

class Login extends Component {
  constructor(props) {
    super(props)

    this.setEmail = this.setEmail.bind(this)
    this.setPassword = this.setPassword.bind(this)
    this.setRemembered = this.setRemembered.bind(this)

    this.state = {
      email: '',
      password: '',
      remembered: false,
      visible: false,
    }
  }

  setEmail = e => this.setState({ email: e.target.value })

  setPassword = e => this.setState({ password: e.target.value })

  setRemembered = e => this.setState({ remembered: e.target.checked })

  enterEmail = e => {
    e.target.setCustomValidity(RegExp(helper.emailRegex).test(e.target.value) ? '' : 'Invalid email!')
    this.setState({ visible: false, password: '' })
    setTimeout(() => {
      if (document.querySelector('.form-group-password')) document.querySelector('.form-group-password').style.height = 0
      document.querySelector('.input-email').style.width = 260 + 'px'
    })
  }

  onSubmit = e => {
    e.preventDefault()

    if (this.state.email) {
      this.setState({ visible: true })
      setTimeout(() => {
        document.querySelector('.form-group-password').style.height = 39 + 'px'
        document.querySelector('.input-email').style.width = 310 + 'px'
        document.querySelector('.input-password').focus()

        if (this.state.password) console.log(this.state)
      })
    }
  }

  render = () => <section className="section-login">
    <form className="form-login" onSubmit={this.onSubmit}>
      <img className='logo-img' src="/logo.png" alt={process.env.REACT_APP_CLIENT_NAME + ' logo'} />
      <h1 className="h1-login">Sign in to {process.env.REACT_APP_CLIENT_NAME}</h1>
      <div className={`form-group-email ${this.state.visible ? 'rounded-top' : 'rounded'}`}>
        <input className="input-email" type="email" name="email" placeholder="Email" value={this.state.email} pattern={helper.emailRegex} onInput={this.enterEmail} onInvalid={this.enterEmail} onChange={this.setEmail} title="Please fill out this field." required />
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
      <button className="btn-create-account" type="button">Create New Account</button>
    </form>
  </section>
}

export default Login