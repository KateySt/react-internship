import React from 'react'
import { useAppDispatch, useAppSelector } from 'Store/hooks'
import { selectTheme, toggleTheme } from 'Store/features/ui/uiSlice'

const AboutPage = () => {
    const theme = useAppSelector(selectTheme)
    const dispatch = useAppDispatch()
    const handelValueChange = () => {
        dispatch(toggleTheme());
    };
    return <div onClick={handelValueChange}>{theme}</div>
}

export default AboutPage
