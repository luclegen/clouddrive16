import React, { Component } from 'react'
import { Progress } from 'reactstrap'

export default class Media extends Component {
  constructor(props) {
    super(props);

    this.state = {
      factor: 0
    }
  }

  init = () => {
    if (this.props.type === 'image' || this.props.type === 'video') {
      const image = document.querySelector(`.${this.props.type}`)
      const bgMedia = document.querySelector('.bg-media')

      image.clientWidth / image.clientHeight > bgMedia.clientWidth / bgMedia.clientHeight
        ? image.style.width = '100vw'
        : image.style.height = 'calc(100vh - 53px)'
    }
  }

  componentDidMount = () => this.init()

  componentDidUpdate = () => this.init()

  refresh = () => {
    if (this.props.type === 'image') {
      const image = document.querySelector('.image')
      const bgMedia = document.querySelector('.bg-media')

      image.style.height = 'auto'
      image.style.width = 'auto'
      image.style.transform = 'rotate(' + (this.state.factor * 90) + 'deg)'

      this.state.factor % 2
        ? image.clientHeight / image.clientWidth > bgMedia.clientWidth / bgMedia.clientHeight
          ? image.style.height = '100vw'
          : image.style.width = 'calc(100vh - 53px)'
        : image.clientWidth / image.clientHeight > bgMedia.clientWidth / bgMedia.clientHeight
          ? image.style.width = '100vw'
          : image.style.height = 'calc(100vh - 53px)'
    }
  }

  rotateLeft = () => this.setState({ factor: this.state.factor + 1 }) || setTimeout(() => this.refresh())

  rotateRight = () => this.setState({ factor: this.state.factor - 1 }) || setTimeout(() => this.refresh())

  render = () => <section className="section-floating">
    <span className="command-bar">
      <span className="primary-command">
        <button className="btn-download" type="button" onClick={this.props.download}><i className="material-icons">download</i>Download</button>
        {this.props.type === 'image' && <button className="btn-rotate-left" type="button" onClick={this.rotateLeft}><i className="material-icons">rotate_90_degrees_ccw</i>Rotate left 90°</button>}
        {this.props.type === 'image' && <button className="btn-rotate-right" type="button" onClick={this.rotateRight}><i className="material-icons">rotate_90_degrees_cw</i>Rotate right 90°</button>}
        {this.props.type !== 'image' && <span className="left-space" style={{ width: '56px' }}></span>}
      </span>
      <span className="middle-command">
        <i className="material-icons">{this.props.type === 'image' ? 'image' : this.props.type === 'video' ? 'video_file' : this.props.type === 'audio' ? 'audio_file' : 'none'}</i>
        <strong>&nbsp;{this.props.src.split('/')[this.props.src.split('/').length - 1]}</strong>
      </span>
      <span className="secondary-command">
        {this.props.type === 'image' && <span className="right-space" style={{ width: '270px' }}></span>}
        <button className="btn-prev" type="button" disabled={this.props.index === 1} onClick={this.props.prev}><i className="material-icons">skip_previous</i></button>
        <span className="span-index">&nbsp;&nbsp;{this.props.index + '/' + this.props.count}&nbsp;&nbsp;</span>
        <button className="btn-next" type="button" disabled={this.props.index === this.props.count} onClick={this.props.next}><i className="material-icons">skip_next</i></button>
        <button className="btn-close" type="button" onClick={this.props.close}><i className="material-icons">close</i></button>
      </span>
    </span>
    {!!this.props.percent && <Progress value={this.props.percent} />}
    <span className="bg-media">
      {this.props.type === 'image'
        ? <img className="image" src={this.props.src} alt="Image0" />
        : this.props.type === 'video'
          ? < video className="video" src={this.props.src} autoPlay controls />
          : this.props.type === 'audio'
            ? <audio className="audio" src={this.props.src} autoPlay controls></audio>
            : <span></span>}
    </span>
  </section>
}
