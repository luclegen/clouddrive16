import React, { Component } from 'react'

class SignIn extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  test = () => console.log('email')

  onSubmit = e => {
    e.preventDefault()
    console.log(document.querySelector('body').clientHeight)
    console.log('submit')
  }

  render = () => <section className="sign-in-section">
    <form className="sign-in-form" onSubmit={this.onSubmit}>
      <h1>Sign in</h1>
      <div className="email-form-group">
        <input className="email-in" type="email" name="email" id="email-in" placeholder="Email" />
        <button className="in-btn" type="button" onClick={this.test}>
          <i className="material-icons">input</i>
        </button>
      </div>
      <div className="password-form-group">
        <input className="password-in" type="password" name="password" id="password-in" placeholder="Password" />
        <button className="in-btn" type="submit">
          <i className="material-icons">input</i>
        </button>
      </div>
    </form>
  </section>
}

export default SignIn