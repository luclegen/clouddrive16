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

  getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token')

  setToken = token => this.remembered() ? localStorage.setItem('token', token) : sessionStorage.setItem('token', token)

  getPayload = () => this.loggedIn() ? JSON.parse(atob(this.getToken().split('.')[1])) : null

  isExpired = () => this.loggedIn() ? this.getPayload().exp ? this.getPayload().exp * 1000 < Date.now() : false : true

  loggedIn = () => Boolean(this.getToken())

  remembered = () => localStorage.getItem('remembered') === 'true' || sessionStorage.getItem('remembered') === 'true' ? true : localStorage.getItem('remembered') === 'false' || sessionStorage.getItem('remembered') === 'false' ? false : null
}

export default new Helper()