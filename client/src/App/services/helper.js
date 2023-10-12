import FileType from '../models/FileType'

class Helper {
  constructor() {
    this.firstNamePattern = '^[A-Z]{1}[a-z]*$'
    this.lastNamePattern = '^[A-Z]{1}[a-z]*(?: [A-Z]{1}[a-z]*)*(?: [A-Z]{1}[a-z]*)?$'
    this.emailPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
  }

  isFirstName = value => RegExp(this.firstNamePattern).test(value)

  isLastName = value => RegExp(this.lastNamePattern).test(value)

  isEmail = value => RegExp(this.emailPattern).test(value)

  isDate = (y, m, d, date = new Date(parseInt(m) + 1 + '/' + d + '/' + y)) => date.getFullYear() === parseInt(y) && date.getMonth() === parseInt(m) && date.getDate() === parseInt(d)

  isOldEnough = year => (new Date()).getFullYear() - parseInt(year) >= 5

  isDigit = value => /^\d{1}$/.test(value)

  isDigits = v => /^\d+$/.test(v)

  toPath = value => value?.path + value?.name + '/'

  isImage = value => /\.(apng|avif|gif|jpe?g|jpe|jf?if|pjp(eg)?|png|webp|bmp|ico|cur)$/i.test(value)

  getImage = (files, value) => files.find(f => f.path === this.toPath(value) && this.isImage(f.name))

  isVideo = value => /\.(3gp|mp4|m4v|m4p|ogv|ogg|mov|webm)$/i.test(value)

  isVideos = (files, value) => files.filter(f => f.path === this.toPath(value) && this.isVideo(f.name)).length

  getVideo = (files, value) => files.find(f => f.path === this.toPath(value) && this.isVideo(f.name))

  isAudio = value => /\.(aac|flac|mp3|m4a|oga|wav)$/i.test(value)

  isMedia = value => this.isImage(value) || this.isVideo(value) || this.isAudio(value)

  getMedia = v => `${process.env.NODE_ENV === 'production' ? window.location.origin + '/api' : process.env.REACT_APP_API}/media/?path=${this.getCookie('id')}/files${v?.path}${v?.name}`

  isPlaintext = value => /\.(txt)$/i.test(value)

  isPDF = value => /\.pdf$/i.test(value)

  isImages = (files, value) => files.filter(f => f.path === this.toPath(value) && this.isImage(f.name)).length

  isEmpty = (folders, files, value) => !folders.filter(f => f.path === this.toPath(value)).length && !files.filter(f => f.path === this.toPath(value)).length

  getFileType = media =>
    this.isPDF(media)
      ? FileType.PDF
      : this.isPlaintext(media)
        ? FileType.TXT
        : this.isImage(media)
          ? FileType.IMAGE
          : this.isVideo(media)
            ? FileType.VIDEO
            : this.isAudio(media)
              ? FileType.AUDIO
              : FileType.NONE

  checkPassword = value => {
    let count = 0
    const strength = Object.freeze({
      0: '',
      1: 'Worst',
      2: 'Bad',
      3: 'Weak',
      4: 'Good',
      5: 'Strong'
    })

    if (value.length >= 8) count++
    if (/[A-Z]/g.test(value)) count++
    if (/[a-z]/g.test(value)) count++
    if (/\d/g.test(value)) count++
    if (/[.@#$%^&*(),.?":{}|<>]/g.test(value)) count++

    return {
      isStrong: count === 5,
      level: count,
      strength: strength[count]
    }
  }

  getQuery = name => (new URLSearchParams(window.location.search)).get(name)

  setQuery = (name, value) => {
    const params = new URLSearchParams(window.location.search)
    params.set(name, value)
    window.history.replaceState({}, '', decodeURIComponent(`${window.location.pathname}?${params}`))
  }

  deleteQuery = name => {
    const params = new URLSearchParams(window.location.search)
    params.delete(name)
    window.history.replaceState({}, '', decodeURIComponent(`${window.location.pathname}?${params}`))
  }

  getCookie(name) {
    const nameEQ = name + '='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  setCookies = (cookies, expires = 0) => Object.entries(cookies).map(c => document.cookie = c[0] + '=' + c[1] + (expires ? '; Max-Age=' + expires : ''))

  setCookie(name, value, ms = 0) {
    let expires = ''
    if (ms) {
      const date = new Date()
      date.setTime(date.getTime() + ms)
      expires = '; expires=' + date.toUTCString()
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/'
  }

  deleteCookie = key => document.cookie = key + '= Max-Age=0'

  clearCookies = () => document.cookie.split(' ').map(c => c.split('=')).forEach(c => document.cookie = c[0] + '=; Max-Age=0')

  getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token')

  setToken = token => this.remembered() ? localStorage.setItem('token', token) : sessionStorage.setItem('token', token)

  getPayload = () => this.isLogin() ? JSON.parse(atob(this.getToken().split('.')[1])) : null

  isExpired = () => this.isLogin() ? this.getPayload().exp ? this.getPayload().exp * 1000 < Date.now() : false : true

  loggedIn = () => !!this.getCookie('id')

  remembered = () => localStorage.getItem('remembered') === 'true' || sessionStorage.getItem('remembered') === 'true' ? true : localStorage.getItem('remembered') === 'false' || sessionStorage.getItem('remembered') === 'false' ? false : null
}

export default new Helper()