import React, { Component } from 'react'
import { Progress } from 'reactstrap'

export default class Video extends Component {
  render = () => <section className="section-floating">
    <span className="command-bar">
      <button className="btn-download" type="button" onClick={this.props.download}><i className="material-icons">download</i>Download</button>
      <span className="span-space"></span>
      <button className="btn-close" type="button" onClick={this.props.close}><i className="material-icons">close</i></button>
    </span>
    {!!this.props.percent && <Progress value={this.props.percent} />}
    <span className="bg-video">
      <video className="video" src={this.props.src} controls></video>
    </span>
  </section>
}
