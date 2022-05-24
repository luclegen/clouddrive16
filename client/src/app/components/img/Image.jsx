import React, { Component } from 'react'

export default class Image extends Component {
  constructor(props) {
    super(props);

    this.state = {
      factor: 0
    }
  }

  componentDidMount = () => {
    const image = document.querySelector('.image')
    const bgImage = document.querySelector('.bg-image')

    image.clientWidth / image.clientHeight > bgImage.clientWidth / bgImage.clientHeight
      ? image.style.width = '100%'
      : image.style.height = 'calc(100vh - 53px)'
  }

  refresh = () => {
    const image = document.querySelector('.image')
    const bgImage = document.querySelector('.bg-image')

    image.style.height = 'auto'
    image.style.width = 'auto'
    image.style.transform = 'rotate(' + (this.state.factor * 90) + 'deg)'

    this.state.factor % 2
      ? image.clientWidth / image.clientHeight > bgImage.clientWidth / bgImage.clientHeight
        ? image.style.width = 'calc(100vh - 53px)'
        : image.style.height = '100%'
      : image.clientWidth / image.clientHeight > bgImage.clientWidth / bgImage.clientHeight
        ? image.style.width = '100%'
        : image.style.height = 'calc(100vh - 53px)'
  }

  rotateLeft = () => this.setState({ factor: this.state.factor + 1 }) || setTimeout(() => this.refresh())

  rotateRight = () => this.setState({ factor: this.state.factor - 1 }) || setTimeout(() => this.refresh())

  render = () => <section className="section-floating">
    <span className="command-bar">
      <button className="btn-download" type="button" onClick={this.props.download}><i className="material-icons">download</i>Download</button>
      <button className="btn-close" type="button" onClick={this.rotateLeft}><i className="material-icons">rotate_90_degrees_ccw</i></button>
      <button className="btn-close" type="button" onClick={this.rotateRight}><i className="material-icons">rotate_90_degrees_cw</i></button>
      <span className="span-space"></span>
      <button className="btn-close" type="button" onClick={this.props.close}><i className="material-icons">close</i></button>
    </span>
    <span className="bg-image">
      <img className="image" src={this.props.src} alt={this.props.alt} />
    </span>
  </section>
}
