import mime from 'mime-types'

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

  isImage = value => /\.(apng|avif|gif|jpe?g|jpe|jf?if|pjp(eg)?|png|webp|bmp|ico|cur)$/i.test(value)

  isVideo = value => /\.(mp4|3gp|ogg|wmv|webm|flv|avi*|wav|vob*)$/i.test(value)

  isAudio = value => /\.(?:wav|mp3)$/i.test(value)

  getImage = (files, value) => files.find(f => f.path === (value.path + (value.path === '/' ? '' : '/') + value.name) && this.isImage(f.name))

  isImages = (files, value) => files.filter(f => f.path === (value.path + (value.path === '/' ? '' : '/') + value.name) && this.isImage(f.name)).length

  isEmpty = (folders, files, value) => !folders.filter(f => f.path === (value.path + (value.path === '/' ? '' : '/') + value.name)).length && !files.filter(f => f.path === (value.path + (value.path === '/' ? '' : '/') + value.name)).length

  checkPassword = value => {
    let count = 0
    const strength = Object.freeze({
      0: 'Worst',
      1: 'Bad',
      2: 'Weak',
      3: 'Good',
      4: 'Strong'
    })

    if (value.length >= 8) count++
    if (/[a-z]/ig.test(value)) count++
    if (/\d/g.test(value)) count++
    if (/[.@#$%^&*(),.?":{}|<>]/g.test(value)) count++

    return {
      isStrong: count === 4,
      level: count,
      strength: strength[count]
    }
  }

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(new Blob([blob], { type: `${mime.lookup(filename)}` }));
    const a = document.createElement('a');

    a.href = url;
    a.download = filename || 'download';

    a.click();
  }

  getQuery = name => (new URLSearchParams(window.location.search)).get(name)

  setQuery = (name, value) => {
    const params = new URLSearchParams(window.location.search)
    params.set(name, value)
    window.history.replaceState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`))
  }

  deleteQuery = name => {
    const params = new URLSearchParams(window.location.search)
    params.delete(name)
    window.history.replaceState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`))
  }

  getCookie(name) {
    var nameEQ = name + "="
    var ca = document.cookie.split(';')
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  setCookies = (cookies, expires = 0) => Object.entries(cookies).map(c => document.cookie = c[0] + '=' + c[1] + (expires ? '; Max-Age=' + expires : ''))

  setCookie(name, value, ms = 0) {
    var expires = ""
    if (ms) {
      var date = new Date()
      date.setTime(date.getTime() + ms)
      expires = "; expires=" + date.toUTCString()
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/"
  }

  deleteCookie = key => document.cookie = key + '= Max-Age=0'

  clearCookies = () => document.cookie.split(' ').map(c => c.split('=')).forEach(c => document.cookie = c[0] + '=; Max-Age=0')

  getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token')

  setToken = token => this.remembered() ? localStorage.setItem('token', token) : sessionStorage.setItem('token', token)

  getPayload = () => this.isLogin() ? JSON.parse(atob(this.getToken().split('.')[1])) : null

  isExpired = () => this.isLogin() ? this.getPayload().exp ? this.getPayload().exp * 1000 < Date.now() : false : true

  isLogin = () => !!this.getCookie('id')

  remembered = () => localStorage.getItem('remembered') === 'true' || sessionStorage.getItem('remembered') === 'true' ? true : localStorage.getItem('remembered') === 'false' || sessionStorage.getItem('remembered') === 'false' ? false : null

  logout = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.location.reload()
  }
}

export default new Helper()