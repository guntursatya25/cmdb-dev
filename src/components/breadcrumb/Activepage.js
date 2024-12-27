import React from 'react'

const ActivePage = ({ active }) => {
    return (
        <span className='active_page text-black'>{active}</span>
    )
}

export default ActivePage