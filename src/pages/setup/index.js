import DropdownMenu from '@/components/DropdownMenu';
import Layout from '@/components/Layout'
import Header from '@/components/Layout/layout/Header'
import React from 'react'

const index = () => {
    const breadcrumbs = [
        { link_prev: '/', prev: 'Home' },
      ];
    //   const menus = [
    //     {
    //       title: "Common",
    //       items: ["Locations", "Statuses of items", "Manufacturer", "Blacklists", "Blacklisted Mail Content"],
    //     },
    //     {
    //       title: "Virtual machines",
    //       items: [],
    //     },
    //     {
    //       title: "Assistance",
    //       items: ["Types", "Models", "Calendars"],
    //     },
    //     {
    //       title: "Management",
    //       items: ["Tools", "Cable management", "Internet"],
    //     },
    //     {
    //       title: "User",
    //       items: ["Authorizations assignment rules", "Fields Uniqueness", "Cameras"],
    //     },
    //     {
    //       title: "Power management",
    //       items: ["Appliances"],
    //     },
    //   ];
    const menus = [
        {
            title: "Manufacturer",
            items: [
                { label: "Computer Manufacturer", href: "/computer-manufacturer" },
                // { label: "Electronics", href: "/electronics" },
                // { label: "Accessories", href: undefined }, 
            ],
        },
    ];
    
    const menus1 = [
        {
            title: "Manufacturer",
            items: [
                { label: "Computer Manufacturer", href: "/computer-manufacturer" },
                { label: "Electronics", href: "/electronics" },
                { label: "Accessories", href: undefined }, 
            ],
        },
    ];
    
    
    const menus2 = [
        {
            title: "Manufacturer",
            items: [
                { label: "Computer Manufacturer", href: "/computer-manufacturer" },
                { label: "Electronics", href: "/electronics" },
                { label: "Accessories", href: undefined }, 
            ],
        },
    ];
    
    const menus3 = [
        {
            title: "Manufacturer",
            items: [
                { label: "Computer Manufacturer", href: "/computer-manufacturer" },
                { label: "Electronics", href: "/electronics" },
                { label: "Accessories", href: undefined }, 
            ],
        },
    ];
    
    const menus4 = [
        {
            title: "Manufacturer",
            items: [
                { label: "Computer Manufacturer", href: "/computer-manufacturer" },
                { label: "Electronics", href: "/electronics" },
                { label: "Accessories", href: undefined }, 
            ],
        },
    ];
    
  return (
    <Layout>
    <Header breadcrumbs={breadcrumbs} active="Setup" />
    <div className='work-page'>
        <div className="flex gap-6 p-4">
            <div className='flex  flex-col w-1/3 gap-y-3'>
            <DropdownMenu menus={menus}/><DropdownMenu menus={menus3}/>
            </div>
            <div className='w-1/3'><DropdownMenu menus={menus1}/></div>
            <div className='w-1/3'><DropdownMenu menus={menus2}/><DropdownMenu menus={menus4}/></div>
        </div>
    </div>
    </Layout>
  )
}

export default index