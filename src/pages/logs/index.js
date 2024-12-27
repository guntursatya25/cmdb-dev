import Layout from '@/components/Layout'
import SearchInput from '@/components/atoms/SearchInput';
import Table from '@/components/atoms/Table';
import React, { useEffect, useState } from 'react';
import Dialog from '@/components/Dialog';
import Header from '@/components/Layout/layout/Header';
import { useRouter } from 'next/router';
import axios from "axios";
import { getCookie } from 'cookies-next';
import Pagination from '@/components/atoms/Pagination';
import Swal from 'sweetalert2';
import { CircularProgress } from "@mui/material";
import Link from 'next/link';
import FormatDateTime from '@/utils/FormatDateTime';

const Index = () => {
    const router = useRouter();
    const [nav, setNav] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleNav = () => {
        setNav(!nav);
    };

    const navItems = [
        { id: 5, text: 'Login', href: '/login' },
    ];

    const fetchData = async (search = "") => {
        setLoading(true);
        const token = getCookie('access_token');
        try {
            const response = await axios.post(`${process.env.base_url}/problems`, {
                page: currentPage,
                per_page: 10,
                search,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setData(response.data.result.data);
            setTotalPages(response.data.result.totalPages)
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(searchTerm);
    }, [searchTerm, currentPage]);

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
    const handleFileDownload = async (filepath, filename) => {
        const token = getCookie('access_token');
        try {
            const response = await axios.get(`${process.env.base_url}/assets/documents/download/${filepath}`, {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading file:", error);
            Swal.fire({
                icon: 'error',
                text: 'Failed to download file.',
            });
        }
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
            const filename = row.filename;
            const filepath = value;

            return (
                <button
                    onClick={() => handleFileDownload(filepath, filename)}
                    className="text-blue-600 hover:underline"
                >
                    {truncateFilePath(filename || '', 15)}
                </button>
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
        if (column === 'updated_at') {
            return (
                <p>{FormatDateTime(value)}</p>
            )
        }
        if (column === 'created_at') {
            return (
                <p>{FormatDateTime(value)}</p>
            )
        }
        return value || '-';
    };

    const headers = ['Title', 'Status', 'Last Update', 'Opening Date', 'Time to resolve'];
    const displayColumns = ['title', 'status', 'updated_at', 'created_at', 'resolvedDate'];

    const handleRowSelect = (selected) => {
        setSelectedRows(selected);
    };

    const handleOpenForm = () => {
        router.push("/documents/form");
    };

    const handleDeleteSelected = () => {
        if (selectedRows.length === 0) return;

        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete the selected items?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const token = getCookie('access_token');
                const deleteRequests = selectedRows.map(rowId => {
                    const rowData = data[rowId];
                    return axios.delete(`${process.env.base_url}/assets/documents?id=${rowData.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                });

                Promise.all(deleteRequests)
                    .then(() => {
                        Swal.fire(
                            'Deleted!',
                            'Your selected items have been deleted.',
                            'success'
                        );
                        setData(prevData => prevData.filter((_, index) => !selectedRows.includes(index)));
                        setSelectedRows([]);
                    })
                    .catch(error => {
                        console.error("Error deleting data:", error);
                        Swal.fire(
                            'Error!',
                            'There was an error deleting the selected items.',
                            'error'
                        );
                    });
            }
        });
    };

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const breadcrumbs = [
        { link_prev: '/', prev: 'Home' },
    ];
    console.log("Data", data)
    return (
        <Layout>
            <Header
                breadcrumbs={breadcrumbs}
                active="Documents"
            />
            <div className='work-page'>
                <div className='container items-center p-4 flex'>
                    <button onClick={handleOpenForm} className='px-4 py-1 items-center flex border-spacing-2 bg-gray-500 text-white rounded-md'>+</button>
                    <SearchInput
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                
                <div className='container flex p-4'>
                    {loading ? (
                        <div className="flex justify-center w-full">
                            <CircularProgress />
                        </div>
                    ) : (
                        <Table
                            headers={headers}
                            data={data || []}
                            displayColumns={displayColumns}
                            renderCell={renderCell}
                            onRowSelect={handleRowSelect}
                            showCheckbox={false}
                        />
                    )}
                </div>
                {totalPages > 1 ?(   <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />):<></> }
             
            </div>
        </Layout>
    )
}

export default Index;