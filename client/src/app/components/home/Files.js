import { Component } from 'react'
import helper from '../../services/helper'
import userService from '../../services/user'

export default class Files extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fullName: '',
      location: ''
    }
  }

  getURLSearchParams = () => new URLSearchParams(window.location.search)

  setQueryStringParameter = (name, value) => {
    const params = new URLSearchParams(window.location.search)
    params.set(name, value)
    window.history.replaceState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`))
  }

  deleteQueryStringParameter = name => {
    const params = new URLSearchParams(window.location.search)
    params.delete(name)
    window.history.replaceState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`))
  }

  setFiles = () => {
    this.deleteQueryStringParameter('location')
    this.setState({ location: '' })
  }

  setTrash = () => {
    this.setQueryStringParameter('location', 'trash')
    this.setState({ location: 'trash' })
  }

  componentDidMount = () => {
    if (helper.loggedIn())
      userService.read()
        .then(res => this.setState(res.data.user))
    if (!window.location.search) window.location.search = 'id=root'
  }

  render = () => <section className="section-files d-flex">
    <nav className="left-nav col-2" id="leftNav">
      <div className="top-left-nav">
        <label htmlFor="leftNav"><strong>{this.state.fullName}</strong></label>
      </div>
      <ul className="list-group">
        <li className={`list-group-item list-group-item-action ${!this.state.location && 'active'}`} onClick={this.setFiles}><i className="material-icons">folder</i> My files</li>
        <li className={`list-group-item list-group-item-action ${this.state.location === 'trash' && 'active'}`} onClick={this.setTrash}><i className="material-icons">delete</i> Trash</li>
      </ul>
    </nav>
    <div className="right-content col-10">
      <div className="command-bar"></div>
      <div className="content"></div>
    </div>
  </section>
}