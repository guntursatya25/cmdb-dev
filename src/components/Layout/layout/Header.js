import ActivePage from '@/components/breadcrumb/Activepage'
import PrevPage from '@/components/breadcrumb/Prevpage'
import React from 'react'

const Header = ({ breadcrumbs, active }) => {
    return (
        <div className="header shadow-md flex items-center h-16 px-4 text-white bg-blue-500 sticky">
        {breadcrumbs.map((breadcrumb, index) => (
          <div className="breadcrumb-item flex text-black bg-white" key={index}>
            <PrevPage link_prev={breadcrumb.link_prev} prev={breadcrumb.prev} />
          </div>
        ))}
        <ActivePage active={active} />
      </div>
      
    )
}

export default Header
