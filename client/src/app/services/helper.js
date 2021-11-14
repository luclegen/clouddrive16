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

  isImage = value => /\.(gif|jpe?g|tiff?|png|webp|bmp|ico)$/i.test(value)

  getImage = (files, value) => files.find(f => f.path === (value.path + (value.path === '/' ? '' : '/') + value.name) && this.isImage(f.name))

  isImages = (files, value) => files.filter(f => f.path === (value.path + (value.path === '/' ? '' : '/') + value.name) && this.isImage(f.name)).length

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

  getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token')

  setToken = token => this.remembered() ? localStorage.setItem('token', token) : sessionStorage.setItem('token', token)

  getPayload = () => this.loggedIn() ? JSON.parse(atob(this.getToken().split('.')[1])) : null

  setId = id => this.remembered() ? localStorage.setItem('id', id) : sessionStorage.setItem('id', id)

  getId = () => this.remembered() ? localStorage.getItem('id') : sessionStorage.getItem('id')

  setType = type => this.remembered() ? localStorage.setItem('type', type) : sessionStorage.setItem('type', type)

  getType = () => this.remembered() ? localStorage.getItem('type') : sessionStorage.getItem('type')

  isExpired = () => this.loggedIn() ? this.getPayload().exp ? this.getPayload().exp * 1000 < Date.now() : false : true

  loggedIn = () => Boolean(this.getToken())

  remembered = () => localStorage.getItem('remembered') === 'true' || sessionStorage.getItem('remembered') === 'true' ? true : localStorage.getItem('remembered') === 'false' || sessionStorage.getItem('remembered') === 'false' ? false : null

  logout = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.location.reload()
  }
}

export default new Helper()