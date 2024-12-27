import React from 'react'
import Link from 'next/link';

const PrevPage = ({ link_prev, prev }) => {
    return (
        <span className='prev_page'>
            <Link href={link_prev}>
                <span className='link text-black'>{prev}</span>
            </Link>
            <span>&#160; &gt; &#160;</span>
        </span>
    )
}

export default PrevPage