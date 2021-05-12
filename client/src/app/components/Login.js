import React, { Component } from 'react'

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
      visible: false
    }
  }

  setEmail = e => this.setState({ email: e.target.value })

  setPassword = e => this.setState({ password: e.target.value })

  setRemembered = e => this.setState({ remembered: e.target.checked })

  check = e => {
    if (this.state.email && (e.type === 'click' || (e.type === 'keyup' && e.keyCode === 13))) {
      this.setState({ visible: true })
      setTimeout(() => document.querySelector('.form-group-password').style.height = 39 + 'px')
    }
  }

  reset = () => {
    if (!this.state.email) {
      setTimeout(() => { if (document.querySelector('.form-group-password')) document.querySelector('.form-group-password').style.height = 0 })
      this.setState({ visible: false, password: '' })
    }
  }

  onSubmit = e => {
    e.preventDefault()
    if (this.state.email && this.state.password) console.log(this.state)
  }

  render = () => <section className="section-login">
    <form className="form-login" onSubmit={this.onSubmit}>
      <img className='logo-img' src="/logo.png" alt={process.env.REACT_APP_CLIENT_NAME + ' logo'} />
      <h1 className="h1-login">Sign in to {process.env.REACT_APP_CLIENT_NAME}</h1>
      <div className={`form-group-email ${this.state.visible ? 'rounded-top' : 'rounded'}`}>
        <input className="input-email" type="email" name="email" placeholder="Email" value={this.state.email} onInput={this.reset} onChange={this.setEmail} onKeyUp={this.check} />
        <button className="btn-input" type="button" disabled={!this.state.email} onClick={this.check}>
          <i className="material-icons">input</i>
        </button>
      </div>
      <div className="form-group-container">
        {this.state.visible && this.state.email && <div className="form-group-password">
          <input className="input-password" type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.setPassword} />
          <button className="btn-input" type="submit" disabled={!this.state.password}>
            <i className="material-icons">input</i>
          </button>
        </div>}
      </div>
      <div className="form-check">
        <input className="form-check-input input-remember-me" id="remember-me" type="checkbox" name="remember-me" value={this.state.remembered} onChange={this.setRemembered} />
        <label className="form-check-label" htmlFor="remember-me">Keep me signed in</label>
      </div>
      <a href="/find-account">Forgotten password?</a>
      <button className="btn-create-account" type="button">Create account</button>
    </form>
  </section>
}

export default Login