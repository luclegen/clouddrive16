import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { create, verify, selectSent } from './slice'
import helper from '../../services/helper'

export default function Activate() {
  const dispatch = useDispatch()
  const sent = useSelector(selectSent)

  const getIndex = target => Array.from(document.querySelector('.row-code').children).findIndex(i => i === target)

  const getInput = () => document.querySelectorAll('.form-control-digit')

  const enterNumber = e => {
    const [i, input] = [getIndex(e.target.closest('.col-md-digit')), getInput()]

    if (e.target.value.length > 1) return input[i].value = e.target.value[0]
    if (i < 5 && helper.isDigit(input[i].value) && input[i].value.length === 1) input[i + 1].focus()

    if (isSubmit()) submit(e)
  }

  const clearNumber = e => {
    const [i, input] = [getIndex(e.target.closest('.col-md-digit')), getInput()]

    if (e.keyCode === 8 && i > 0 && e.target.value === '') input[i - 1].focus()
  }

  const pasteNumber = e => {
    const [i, input] = [getIndex(e.target.closest('.col-md-digit')), getInput()]

    const txt = (e.clipboardData || window.clipboardData).getData('text')
    const max = txt.length > 6 - i ? 6 - i : txt.length
    const f = max + i > 5 ? 5 : max + i

    setTimeout(() => {
      input[i].value = helper.isDigit(txt[0]) ? txt[0] : null
      if (helper.isDigits(txt)) input[f].focus()
    })

    for (let j = i, k = 0; k < max; j++, k++) input[j].value = helper.isDigit(txt[k]) ? txt[k] : null

    if (isSubmit()) submit(e)
  }

  const send = e => e.preventDefault() || dispatch(create())

  const isSubmit = () => '0'.repeat(6).split('').map((v, i) => v = document.querySelectorAll('.form-control-digit')[i].value).filter(v => helper.isDigit(v)).length === 6

  const submit = e => dispatch(verify({ code: Array.from(document.querySelectorAll('.form-control-digit')).map(e => e.value).join('') }))

  return <section className="section-only">
    <form className="form-only" onSubmit={submit}>
      <img className='logo-img' src="/logo.svg" alt={process.env.REACT_APP_NAME + ' logo'} />
      <h1 className="h1-only">Activate your account</h1>
      <p>We sent a code to your email. Please enter the verification code.</p>
      <div className="row-code">
        {'0'.repeat(6).split('').map((v, i) => <div className="col-md-digit" key={i}>
          <div className="input-group" key={i}>
            <input className="form-control-digit" type="number" maxLength="1" onClick={e => e.target.select()} onInput={enterNumber} onDrop={enterNumber} onKeyUp={clearNumber} onKeyDown={clearNumber} onPaste={pasteNumber} required />
          </div>
        </div>)}
      </div>
      <a href="/" onClick={send}>{`${sent ? 'Resend' : 'Send'} Code`}</a>
    </form>
  </section>
}
