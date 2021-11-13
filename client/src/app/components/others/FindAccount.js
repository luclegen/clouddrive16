import React, { Component } from 'react'
import helper from '../../services/helper'

const state = {
  email: '',
}

class FindAccount extends Component {
  constructor(props) {
    super(props)

    this.state = state
  }

  onSubmit = e => {
    e.preventDefault()
  }

  render = () => <main>
    <section className="section-only">
      <form className="form-only" onSubmit={this.onSubmit}>
        <img className='logo-img' src="/logo.png" alt={process.env.REACT_APP_NAME + ' logo'} />
        <h1 className="h1-only">Find my account</h1>
        <div className="form-group-email">
          <input className="input-email" type="email" name="email" placeholder="Email" value={this.state.email} pattern={helper.emailPattern} onInput={this.enterEmail} onInvalid={this.enterEmail} onChange={this.setEmail} title="Please fill out this field." required />
          <button className="btn-input" type="submit" disabled={!this.state.email} hidden={true}>
            <i className="material-icons">input</i>
          </button>
        </div>
      </form>
    </section>
  </main>
}

export default FindAccount