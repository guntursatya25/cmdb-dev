import Layout from '@/components/Layout';
import Table from '@/components/atoms/Table';
import React, { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Layout/layout/Header';
import { useRouter } from 'next/router';
import axios from "axios";
import { getCookie } from 'cookies-next';
import Pagination from '@/components/atoms/Pagination';
import Swal from 'sweetalert2';
import { CircularProgress, Tooltip } from "@mui/material";
import Link from 'next/link';
import Toolbar from '@/components/Layout/layout/Toolbar';
import debounce from 'lodash/debounce';

const Index = () => {
    const router = useRouter();
    const [selectedRows, setSelectedRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [searchInput, setSearchInput] = useState("");
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
            const response = await axios.post(
                `${process.env.base_url}/masterdatas/item-types`,
                {
                    search: searchTerm,
                    page: currentPage,
                    per_page: 8,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const responseData = response.data.result.data || [];
            setTotalPages(response.data.result.total_pages);
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

    const debouncedSearch = useCallback(
        debounce((value) => {
            setSearchTerm(value);
        }, 500),
        []
    );

    useEffect(() => {
        fetchData();
    }, [searchTerm, currentPage]);

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
        debouncedSearch(event.target.value);
    };

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    const renderCell = (column, value, row) => {
        if (column === 'name') {
            const displayName = truncateText(value || '', 25);
            return (
                <Link href={`/setup/item-type/${row.id || '#'}`}>
                    {displayName}
                </Link>
            );
        }
        if (column === 'id') {
            return (
                <Link href={`/setup/item-type/${row.id || '#'}`}>
                    <Tooltip title="Edit" placement="top-end">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h8.386l-1 1H5.616q-.231 0-.424.192T5 5.616v12.769q0 .23.192.423t.423.192h12.77q.23 0 .423-.192t.192-.423v-7.489l1-1v8.489q0 .69-.462 1.153T18.384 20zM10 14v-2.615l8.944-8.944q.166-.166.348-.23t.385-.063q.189 0 .368.064t.326.21L21.483 3.5q.16.166.242.365t.083.4t-.061.382q-.06.18-.226.345L12.52 14zm10.814-9.715l-1.112-1.17zM11 13h1.092l6.666-6.666l-.546-.546l-.61-.584L11 11.806zm7.212-7.211l-.61-.585zl.546.546z" /></svg>
                    </Tooltip>
                </Link>
            );
        }
        return value || '-';
    };

    const headers = ['Name', 'Type', 'Description', 'Action'];
    const displayColumns = ['name', 'item_type', 'description', 'id'];

    const handleRowSelect = (selected) => {
        setSelectedRows(selected);
    };

    const handleOpenForm = () => {
        router.push(`/setup/item-type/create`);
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
                        `${process.env.base_url}/masterdatas/item-types?id=${rowData.id}`,
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
        { link_prev: '/setup', prev: 'Setup' },
    ];
    return (
        <Layout>
            <Header
                breadcrumbs={breadcrumbs}
                active="Item Types"
            />
            <div className='work-page'>
                <Toolbar
                    onChange={handleSearchChange}
                    deleteClick={handleDeleteSelected}
                    addClick={handleOpenForm}
                    valueSearch={searchInput}
                />
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
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </Layout>
    );
};

export default Index;
