import Layout from '@/components/Layout'
import SearchInput from '@/components/atoms/SearchInput';
import Table from '@/components/atoms/Table';
import React, { useState,useEffect } from 'react';
import Dialog from '@/components/Dialog';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from "axios";
import { getCookie } from 'cookies-next';

const Coba = () => {
  const [nav, setNav] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const handleNav = () => {
    setNav(!nav);
  };
  const navItems = [
    { id: 5, text: 'Login', href: '/login' },
  ];

  // const headers = ['No', 'Name', 'Age', 'Address'];
  const headers = ['Name', 'File', 'Web link', 'Notes'];
  const displayColumns = ['name', 'filepath', 'web_link', 'notes'];

  const data = [
    { no: 1, name: 'Ana', age: 25, address: 'Jalan jalan' },
    { no: 2, name: 'Budi', age: 30, address: 'Jalan jalan' },
    { no: 3, name: 'Ani', age: 22, address: 'Jalan jalan' },
    { no: 4, name: 'Anto', age: 28, address: 'Jalan jalan' },
  ];

  const handleRowSelect = (selected) => {
    setSelectedRows(selected);
  };
  const fetchData = async (search = "") => {
    setLoading(true);
    const token = getCookie('access_token');
    try {
        const response = await axios.post(`${process.env.base_url}/assets/documents`, {
            page: currentPage,
            per_page: 10,
            search,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setData(response.data.result.data);
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchData(searchTerm);
}, [searchTerm]);

const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
};

const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};


const truncateFilePath = (filename, maxLength) => {
    const extension = filename.substring(filename.lastIndexOf('.'));
    const nameWithoutExtension = filename.substring(0, filename.lastIndexOf('.'));
    if (nameWithoutExtension.length <= maxLength) return filename;
    return nameWithoutExtension.slice(0, maxLength) + '...' + extension;
};

const renderCell = (column, value, row) => {
    if (column === 'name') {
        const displayName = truncateText(value || '', 25);
        return (
            <Link href={`/documents/${row.id || '#'}`}>
                {displayName}
            </Link>
        );
    }
    if (column === 'filepath') {
        const downloadUrl = value
            ? `${process.env.base_url}/assets/documents/download/${value}`
            : '#';

        const displayFilepath = truncateFilePath(value || '', 15);
        return (
            <a
                href={downloadUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
            >
                {displayFilepath}
            </a>
        );
    }
    if (column === 'web_link') {
        const displayLink = truncateText(value || '', 20);
        return (
            <Link
                href={value || '#'}
                target={value ? "_blank" : undefined}
                rel={value ? "noopener noreferrer" : undefined}
                className="text-blue-600 hover:underline"
            >
                {displayLink}
            </Link>
        );
    }
    return value || '-';
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

  return (
    <Layout>
      <div className='bg-white shadow-md flex justify-between items-center h-16 w-full mx-auto px-4 text-white'>
        <p className='text-black'>Home / Documents</p>
        <ul className='hidden md:flex text-black'>
        </ul>
      </div>
      <div className='work-page'>
        <div className='container flex items-center p-4'>
          <button onClick={handleOpenDialog} className='px-4 py-1 items-center flex border-spacing-2 bg-gray-500 text-white rounded-md'>+</button>
          <Dialog open={isDialogOpen} onClose={handleCloseDialog} title="My Dialog" className='h-[300px] w-[300px]'>
            <p>This is the content of the dialog.</p>
          </Dialog>
          <SearchInput />
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#a51515" d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zm5-7.1l1.9 1.9q.275.275.7.275t.7-.275t.275-.7t-.275-.7l-1.9-1.9l1.9-1.9q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275L12 11.1l-1.9-1.9q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7l1.9 1.9l-1.9 1.9q-.275.275-.275.7t.275.7t.7.275t.7-.275z" /></svg>               
          </div>
        <div className='container flex p-4'>
          <Table
            headers={headers}
            data={data}
            displayColumns={displayColumns}
            renderCell={renderCell}
            onRowSelect={handleRowSelect}
            showCheckbox={true}
          />   </div>
      </div>
    </Layout>
  )
}

export default Coba