import React from 'react'
import UserAccountComponent from '../../components/UserAccountComponent/UserAccountComponent'
import TicketsComponent from '../../components/TicketsComponent/TicketsComponent'
import './styles.css'

const AccountPage = () => {
  return (
    <div className={'account-page'}>
        <div className={'account-page__inner'}>
            <h1 className={'account-page__title'}>Мій акаунт</h1>
            <UserAccountComponent/>
            <TicketsComponent/>
        </div>
    </div>
  )
}

export default AccountPage