import React from 'react'

export const Button = ({ name }) => {
    return (
        <div className="w-full flex justify-end p-4">
            <button type="submit" className="bg-[#20288E] text-white px-3 py-2 rounded-md hover:bg-[#4952da]">
                {name}
            </button>
        </div>
    )
}
