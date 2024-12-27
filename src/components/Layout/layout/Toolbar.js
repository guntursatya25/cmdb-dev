import React from 'react'
import SearchInput from '../../atoms/SearchInput'
import { Tooltip } from '@mui/material'

const Toolbar = ({ addClick, valueSearch, onChange, deleteClick }) => {
    return (
        <div className='container items-center p-4 flex'>
            <Tooltip title="Add" placement="top-end">
            <button onClick={addClick} className='px-4 py-1 items-center flex border-spacing-2 bg-gray-500 text-white rounded-md'>+</button>
            </Tooltip>
            <SearchInput
                value={valueSearch}
                onChange={onChange}
            />
            <button onClick={deleteClick} className='rounded text-red-600 hover:text-red-100'>
                {/* <Tooltip title="Delete" placement="top-end">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#b50303" d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z" /></svg>
                </Tooltip> */}
            </button>
        </div>
    )
}

export default Toolbar