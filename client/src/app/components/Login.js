import React, { Component } from 'react'

class Login extends Component {
  constructor(props) {
    super(props)

    this.setEmail = this.setEmail.bind(this)
    this.setPassword = this.setPassword.bind(this)
    this.onChangeRemember = this.onChangeRemember.bind(this)

    this.state = {
      email: '',
      password: '',
      remembered: false
    }
  }

  setEmail = e => this.setState({ email: e.target.value })

  setPassword = e => this.setState({ password: e.target.value })

  onChangeRemember = e => this.setState({ remembered: e.target.value })

  test = () => console.log('email')

  onSubmit = e => {
    e.preventDefault()
    console.log(this.state)
  }

  render = () => <section className="section-login">
    <form className="form-login" onSubmit={this.onSubmit}>
      <img className='logo-img' src="/logo.png" alt={process.env.REACT_APP_CLIENT_NAME + ' logo'} />
      <h1 className="h1-login">Sign in to {process.env.REACT_APP_CLIENT_NAME}</h1>
      <div className="form-group-email">
        <input className="input-email" type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.setEmail} />
        <button className="btn-input" type="button" onClick={this.test}>
          <i className="material-icons">input</i>
        </button>
      </div>
      <div className="form-group-password">
        <input className="input-password" type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.setPassword} />
        <button className="btn-input" type="submit">
          <i className="material-icons">input</i>
        </button>
      </div>
      <div className="form-check">
        <input className="form-check-input input-remember-me" id="remember-me" type="checkbox" name="remember-me" value={this.state.remembered} onChange={this.onChangeRemember} />
        <label className="form-check-label" htmlFor="remember-me">Keep me signed in</label>
      </div>
      <a href="/find-account">Forgotten password?</a>
      <button className="btn-create-account" type="button">Create account</button>
    </form>
  </section>
}

export default Login