import Layout from '@/components/Layout';
import Input from '@/components/atoms/Input';
import Header from '@/components/Layout/layout/Header';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import TextArea from '@/components/atoms/Textarea';
import Dropdown from '@/components/atoms/Dropdown';

const Edit = () => {
    const router = useRouter();
    const [param, setParam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (router.isReady && router.query.edit) {
            setParam(router.query.edit);
            localStorage.setItem('currentEdit', router.query.edit);
        } else if (!param) {
            const savedParam = localStorage.getItem('currentEdit');
            if (savedParam) {
                setParam(savedParam);
            }
        }
    }, [router.isReady, router.query.edit]);

    const [formData, setFormData] = useState({
        name: '',
        item_type: '',
        description: '',
        parent_id: null
    });

    const breadcrumbs = [
        { link_prev: '/', prev: 'Home' },
        { link_prev: '/setup/item-type', prev: 'Item Type' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const fetchData = async () => {
        setLoading(true);
        const token = getCookie('access_token');
        try {
            const response = await axios.get(`${process.env.base_url}/masterdatas/item-types/show/${param}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            const responsePost = await axios.post(
                `${process.env.base_url}/masterdatas/item-types`, formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = response.data.data;
            setFormData({
                name: data.name || '',
                item_type: data.item_type || '',
                parent_id: data.parent_id || null,
                description: data.description || '',
            });
            setTitle(data.name)
            const responseData = responsePost.data.result.data || [];
            const formattedOptions = responseData.map((item) => ({
                label: item.name,
                value: parseInt(item.id, 10),
            }));
            setData(formattedOptions);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (param) {
            fetchData(searchTerm);
        }
    }, [param, searchTerm, currentPage]);

    const handleEdit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('item_type', formData.item_type);
        data.append('description', formData.description);

        const token = getCookie('access_token');

        try {
            const response = await axios.put(`${process.env.base_url}/masterdatas/item-types?id=${param}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': "application/json"
                },
            });

            const updatedData = response.data.data;
            setFormData({
                name: updatedData.name,
                item_type: updatedData.item_type,
                description: updatedData.description,
            });

            Swal.fire({
                icon: "success",
                text: "The data has been successfully updated!",
            });
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: "error",
                text: "There was an issue saving the changes. Please try again later.",
            });
        }
    };

    const options = [
        { value: 'licenses_type', label: 'Licenses Type' },
        { value: 'document_type', label: 'Document Type' },
        { value: 'computer_type', label: 'Computer Type' },
        { value: 'licenses_publisher', label: 'Licenses Publisher' },
    ];

    return (
        <Layout>
            <Header breadcrumbs={breadcrumbs} active="Edit" />
            <form onSubmit={handleEdit} className="work-page">
                <div className="container">
                    <div className="flex justify-between p-4 w-full bg-gray-50 overflow-hidden rounded-t-md">
                        <h2 className="text-[#20288E] font-medium flex items-center">
                            <Link href={'/setup/item-type'}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M6.325 12.85q-.225-.15-.337-.375T5.874 12t.113-.475t.337-.375l8.15-5.175q.125-.075.263-.112T15 5.825q.4 0 .7.288t.3.712v10.35q0 .425-.3.713t-.7.287q-.125 0-.262-.038t-.263-.112z" />
                                </svg>
                            </Link>
                            Item Type - {title}
                        </h2>
                    </div>
                    <hr />
                    <div className="flex gap-[8%] w-full p-4">
                        <div className="w-[50%]">
                            <Input label="Name" name="name" value={formData.name} onChange={handleInputChange} />
                            <Dropdown
                                label="Item Type"
                                options={options}
                                selectedOption={formData.item_type}
                                onChange={(value) =>
                                    setFormData((prev) => ({ ...prev, item_type: value }))
                                }
                            />
                            <Dropdown
                                label="Parent"
                                options={data}
                                selectedOption={formData.parent_id}
                                onChange={(value) => {
                                    const intValue = parseInt(value, 10);
                                    setFormData((prev) => ({ ...prev, parent_id: isNaN(intValue) ? null : intValue }));
                                }}
                            />
                        </div>
                        <div className="w-[50%] align-bottom content-end">
                            <TextArea label="Description" name="description" rows={4} value={formData.description} onChange={handleInputChange} />
                        </div>
                    </div>
                    <hr />
                    <div className="w-full flex justify-end p-4">
                        <button type="submit" className="bg-[#20288E] text-white px-3 py-2 rounded-md hover:bg-[#4952da]">
                            Save Changes
                        </button>
                    </div>
                </div>
            </form>
        </Layout>
    );
};

export default Edit;
