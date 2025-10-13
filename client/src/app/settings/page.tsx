import Header from '@/components/Header'
import React from 'react'

const Settings = () => {
    const userSettings = {
        username: "Qusai",
        email: "qusaii.abdullah@gmail.com",
        teamname: "Development Team",
        roleName: "Developer"
    }

    const labelStyles = "block text-sm font-medium dark:text-white"
    const textStyles = "mt-1 block w-full border border-gray-300 rounded-md shodow-sm p-2 dark:text-white"

    return (
        <div className='p-8'>
            <Header name='إعدادات الحساب' />
            <div className='space-y-4'>
                <div>
                    <label className={labelStyles}>اسم المستخدم</label>
                    <div className={textStyles}>{userSettings.username}</div>
                </div>
                <div>
                    <label className={labelStyles}>البريد الالكتروني</label>
                    <div className={textStyles}>{userSettings.email}</div>
                </div>
                <div>
                    <label className={labelStyles}>فريق المستخدم</label>
                    <div className={textStyles}>{userSettings.teamname}</div>
                </div>
                <div>
                    <label className={labelStyles}>منصب المستخدم</label>
                    <div className={textStyles}>{userSettings.username}</div>
                </div>
            </div>
        </div>
    )
}

export default Settings
