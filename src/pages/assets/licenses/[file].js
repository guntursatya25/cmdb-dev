import Layout from '@/components/Layout';
import SearchInput from '@/components/atoms/SearchInput';
import Table from '@/components/atoms/Table';
import React, { useEffect, useState } from 'react';
import Dialog from '@/components/Dialog';
import Header from '@/components/Layout/layout/Header';
import { useRouter } from 'next/router';
import MenuComponent from '@/components/Layout/layout/Menu';
import DocumentsContent from '@/components/DocumentsMenu/DocumentsContent';
import LicenseContent from '@/components/LicenseMenu/LicenseContente';

const Index = () => {
    const router = useRouter();
    const [param, setParam] = useState(null);

    useEffect(() => {
        if (router.query.file) {
            setParam(router.query.file);
            localStorage.setItem('currentLicense', router.query.file);
        } else {
            const savedParam = localStorage.getItem('currentLicense');
            if (savedParam) {
                setParam(savedParam);
            }
        }
    }, [router.query.file]);
    
    const [nav, setNav] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const handleNav = () => {
        setNav(!nav);
    };

    const navItems = [
        { id: 5, text: 'Login', href: '/login' },
    ];

    const headers = ['No', 'Name', 'Age', 'Address'];

    const data = [
        { no: 1, name: 'Ana', age: 25, address: 'Jalan jalan' },
        { no: 2, name: 'Budi', age: 30, address: 'Jalan jalan' },
        { no: 3, name: 'Ani', age: 22, address: 'Jalan jalan' },
        { no: 4, name: 'Anto', age: 28, address: 'Jalan jalan' },
    ];

    const handleRowSelect = (selected) => {
        setSelectedRows(selected);
    };

    const handleOpenForm = () => {
        router.push("/licenses/form"); 
    };

    const handleDeleteSelected = () => {
        setTableData((prevData) =>
            prevData.filter((_, index) => !selectedRows.includes(index))
        );
        setSelectedRows([]);
    };

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);

    const breadcrumbs = [
        { link_prev: '/', prev: 'Home' },
    ];

    const AssociatedItemsContent = () => <div>Associated Items Content</div>;
    const NotesContent = () => <div>Notes Content</div>;
    const HistoricalContent = () => <div>Historical Content</div>;
    const AllContent = () => <div>All Content</div>;

    const dynamicTabs = [
        { name: 'License', content: <LicenseContent  idParam={param}/> },
        { name: 'Associated items', content: <AssociatedItemsContent /> },
        { name: 'Notes', content: <NotesContent /> },
        { name: 'Historical', content: <HistoricalContent /> },
        { name: 'All', content: <AllContent /> }
    ];

    return (
        <Layout>
            <Header
                breadcrumbs={breadcrumbs}
                active="Licenses"
            />
          <div className='work-page'>
         <div className='flex items-center'>
         <h2>hai</h2>
         </div>
          <MenuComponent tabs={dynamicTabs}/>
          </div>
        </Layout>
    );
};

export default Index;
