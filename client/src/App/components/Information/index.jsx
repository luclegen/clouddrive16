import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EditIcon from '@mui/icons-material/Edit'
import CancelIcon from '@mui/icons-material/Cancel'
import SaveIcon from '@mui/icons-material/Save'
import AvatarCropper from '../../components/AvatarCropper'
import Lang from '../../models/Lang'
import Sex from '../../models/Sex'
import helper from '../../services/helper'
import {
  readUser,
  selectEdit,
  updateUser,
  setEdit
} from './slice'
import { setWidth } from '../Header/slice'
import { selectPreview } from '../AvatarCropper/slice'
import { selectLang, setLang } from '../../slice'

export default function Information() {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const edit = useSelector(selectEdit)
  const lang = useSelector(selectLang)
  const preview = useSelector(selectPreview)

  const [avatar, setAvatar] = useState(helper.getCookie('avatar'))
  const [first_name, setFirstName] = useState(helper.getCookie('first_name'))
  const [middle_name, setMiddleName] = useState(helper.getCookie('middle_name'))
  const [last_name, setLastName] = useState(helper.getCookie('last_name'))
  const [full_name, setFullName] = useState(lang === Lang.VI ? `${helper.getCookie('last_name')} ${helper.getCookie('middle_name')} ${helper.getCookie('first_name')}` : `${helper.getCookie('first_name')} ${helper.getCookie('middle_name')} ${helper.getCookie('last_name')}`)
  const [language, setLanguage] = useState(helper.getCookie('lang'))
  const [birthday, setBirthday] = useState(new Date().toLocaleDateString())
  const [sex, setSex] = useState(Sex.MALE)

  useEffect(() => {
    window.onresize = () => {
      setSectionRight()
      dispatch(setWidth())
    }
    setSectionRight()
    refresh()
  }, [])

  const refresh = () => dispatch(readUser(helper.getCookie('id')))
    .then(action => {
      if (action.type === 'information/readUser/fulfilled') {
        setAvatar(action.payload.avatar)
        setFirstName(action.payload.name.first || '')
        setMiddleName(action.payload.name.middle || '')
        setLastName(action.payload.name.last || '')
        setFullName(action.payload.full_name || '')
        setLanguage(action.payload.lang)
        setBirthday(new Date(action.payload.birthday).toLocaleDateString())
        setSex(action.payload.sex)
      }
    })

  const setSectionRight = () => {
    const sectionRight = document.querySelector('.section-right')

    sectionRight.style.marginLeft = `${document
      .querySelector('.left-nav')
      .clientWidth}px`
  }

  const enterFirstName = e => {
    setFullName(`${lang === Lang.VI ? `${last_name} ${middle_name} ${e.target.value}` : `${e.target.value} ${middle_name} ${last_name}`}`)
  }

  const enterMiddleName = e => {
    setFullName(`${lang === Lang.VI ? `${last_name} ${e.target.value} ${first_name}` : `${first_name} ${e.target.value} ${last_name}`}`)
  }

  const enterLastName = e => {
    setFullName(`${lang === Lang.VI ? `${e.target.value} ${middle_name} ${first_name}` : `${first_name} ${middle_name} ${e.target.value}`}`)
  }

  const submit = () => {
    fetch(preview)
      .then(res => res.blob())
      .then(blob => {
        const formData = new FormData()

        if (preview) formData.append('avatar', blob, 'avatar.png')
        formData.append('first_name', first_name)
        formData.append('middle_name', middle_name)
        formData.append('last_name', last_name)
        formData.append('lang', language)
        formData.append('full_name', full_name)
        formData.append('birthday', birthday)
        formData.append('sex', sex)

        dispatch(updateUser(formData))
          .then(action => {
            if (action.type === 'information/updateUser/fulfilled') {
              refresh()
                .then(() => {
                  dispatch(setLang(helper.getCookie('lang')))
                  dispatch(setEdit(false))
                })
            }
          })
      })
  }

  return <section className="section-only section-right">
    <div className="table-only table-responsive">
      <form onSubmit={submit}>
        <table className="table table-primary">
          <thead>
            <tr>
              <th className="th-center" colSpan={2} scope="col">
                {edit && <AvatarCropper />}
                {!edit && (helper.getCookie('avatar') ? <img src={helper.getAvatar(avatar)} alt="Avatar" /> : <AccountCircleIcon className="avatar" />)}
              </th>
            </tr>
            <tr>
              <th scope="col">{t('Property')}</th>
              <th scope="col">{t('Value')}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="tr-first-name">
              <td scope="row"><label htmlFor="firstName">{t('First name')}</label></td>
              <td>{edit ? <input type="text" name="First name" id="firstName" value={first_name} onInput={enterFirstName} onChange={e => setFirstName(e.target.value)} /> : first_name}</td>
            </tr>
            <tr className="tr-middle-name">
              <td scope="row"><label htmlFor="middleName">{t('Middle name')}</label></td>
              <td>{edit ? <input type="text" name="Middle name" id="middleName" value={middle_name} onInput={enterMiddleName} onChange={e => setMiddleName(e.target.value)} /> : middle_name}</td>
            </tr>
            <tr className="tr-last-name">
              <td scope="row"><label htmlFor="lastName">{t('Last name')}</label></td>
              <td>{edit ? <input type="text" name="Last name" id="lastName" value={last_name} onInput={enterLastName} onChange={e => setLastName(e.target.value)} /> : last_name}</td>
            </tr>
            <tr className="tr-full-name">
              <td scope="row"><label htmlFor="fullName">{t('Full name')}</label></td>
              <td>{edit ? <input type="text" name="Full name" id="fullName" value={full_name} onChange={e => setFullName(e.target.value)} /> : full_name}</td>
            </tr>
            <tr className="tr-lang">
              <td scope="row"><label htmlFor="lang">{t('Language')}</label></td>
              <td>{edit
                ? <select name="Language" id="lang" value={language} onChange={e => setLanguage(e.target.value)}>
                  <option value={Lang.EN}>English (Unit States)</option>
                  <option value={Lang.VI}>Vietnamese (Tiếng Việt)</option>
                </select>
                : language === Lang.VI ? 'Việt Nam' : 'English'}</td>
            </tr>
            <tr className="tr-birthday">
              <td scope="row"><label htmlFor="birthday">{t('Birthday')}</label></td>
              <td>{edit
                ? <input type="date" name="Birthday" id="birthday" value={birthday} onChange={e => setBirthday(e.target.value)} />
                : new Date(birthday).toDateString()}</td>
            </tr>
            <tr className="tr-sex">
              <td scope="row"><label htmlFor="lang">{t('Gender')}</label></td>
              <td>{edit
                ? <select name="Gender" id="sex" value={sex} onChange={e => setSex(e.target.value)}>
                  <option value={Sex.FEMALE}>{t('Female')}</option>
                  <option value={Sex.MALE}>{t('Male')}</option>
                  <option value={Sex.OTHER}>{t('Other')}</option>
                </select>
                : sex}
              </td>
            </tr>
            <tr className="tr-action">
              <td colSpan={2}>
                <span className="action-bar">
                  <button className={edit ? 'btn-save' : 'btn-edit'} type={edit ? 'button' : 'submit'} onClick={() => edit ? submit() : dispatch(setEdit(true))}>{edit ? <SaveIcon /> : <EditIcon />}&nbsp;{edit ? 'Save' : 'Edit'}</button>
                  {edit && <button className="btn-cancel" type="button" onClick={() => dispatch(setEdit(false))}><CancelIcon />&nbsp;Cancel</button>}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  </section >
}
