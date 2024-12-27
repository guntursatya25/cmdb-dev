import Layout from '@/components/Layout'
import Table from '@/components/atoms/Table';
import React, { useEffect, useState } from 'react';
import Header from '@/components/Layout/layout/Header';
import { useRouter } from 'next/router';
import axios from "axios";
import { getCookie } from 'cookies-next';
import Pagination from '@/components/atoms/Pagination';
import Swal from 'sweetalert2';
import { CircularProgress, Tooltip } from "@mui/material";
import Link from 'next/link';
import Toolbar from '@/components/Layout/layout/Toolbar';

const Index = () => {
    const router = useRouter();
    const [selectedRows, setSelectedRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchData = async () => {
        setLoading(true);
        const token = getCookie('access_token');
        try {
            const response = await axios.post(`${process.env.base_url}/masterdatas/manufacturers`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const responseData = response.data.result.data || [];
            setTotalPages(response.data.result.total_pages)
            setData(responseData);
        } catch (error) {
            console.error("Error fetching data:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                Swal.fire({
                    icon: 'error',
                    text: 'Session expired. Please log in again.',
                });
                router.push('/login');
            }
            setData([]);
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

    const renderCell = (column, value, row) => {
        if (column === 'name') {
            const displayName = truncateText(value || '', 25);
            return (
                <Link href={`/setup/manufacturer/${row.id || '#'}`}>
                    {displayName}
                </Link>
            );
        }
        if (column === 'id') {
            return (
                <Link href={`/setup/manufacturer/${row.id || '#'}`}>
                    <Tooltip title="Edit" placement="top-end">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h7.178q.25 0 .375.159q.125.158.125.341t-.128.341T12.79 5H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192h12.77q.23 0 .423-.192t.192-.423V11.11q0-.25.159-.375q.158-.125.341-.125t.341.125t.159.375v7.275q0 .69-.462 1.153T18.384 20zM10 13.192v-1.136q0-.323.13-.628q.132-.305.349-.522l8.465-8.465q.166-.166.348-.23t.385-.063q.189 0 .368.064t.326.21L21.483 3.5q.16.166.242.365t.083.4t-.061.382q-.06.18-.226.345l-8.523 8.524q-.217.217-.522.35q-.305.134-.628.134h-1.04q-.349 0-.578-.23t-.23-.578m10.814-8.907l-1.112-1.17zM11 13h1.092l6.666-6.666l-.546-.546l-.61-.584L11 11.806zm7.212-7.211l-.61-.585zl.546.546z" /></svg>
                    </Tooltip>
                </Link>
            );
        }
        return value || '-';
    };

    const headers = ['Name', 'Manufacturer', 'Register ID', 'Type Register ID', 'Action'];
    const displayColumns = ['name', 'item_manufacturer','registered_IDs', 'type_registeredIDs', 'id'];

    const handleRowSelect = (selected) => {
        setSelectedRows(selected);
    };

    const handleOpenForm = () => {
        router.push("/setup/manufacturer/create");
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
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                const token = getCookie('access_token');
                const deleteRequests = selectedRows.map((rowId) => {
                    const rowData = data[rowId];
                    return axios.delete(
                        `${process.env.base_url}/masterdatas/manufacturers?id=${rowData.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'X-HTTP-Method-Override': 'DELETE',
                            },
                            data: { id: rowData.id },
                        }
                    );
                });

                Promise.all(deleteRequests)
                    .then(() => {
                        Swal.fire('Deleted!', 'Your selected items have been deleted.', 'success');
                        setData((prevData) => prevData.filter((_, index) => !selectedRows.includes(index)));
                        setSelectedRows([]);
                    })
                    .catch((error) => {
                        console.error('Error deleting data:', error);
                        Swal.fire('Error!', 'There was an error deleting the selected items.', 'error');
                    });
            }
        });
    };

    const breadcrumbs = [
        { link_prev: '/', prev: 'Home' },
    ];
    return (
        <Layout>
            <Header
                breadcrumbs={breadcrumbs}
                active="Users"
            />
            <div className='work-page'>
                <Toolbar onChange={handleSearchChange} deleteClick={handleDeleteSelected} addClick={handleOpenForm} valueSearch={searchTerm} />
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
                            showCheckbox={true}
                        />
                    )}
                </div>
                {totalPages > 1 ? (<Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />) : <></>}
            </div>
        </Layout>
    )
}

export default Index;