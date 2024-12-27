import Layout from '@/components/Layout';
import FileInput from '@/components/atoms/FileInput';
import Input from '@/components/atoms/Input';
import Header from '@/components/Layout/layout/Header';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Dropdown from '@/components/atoms/Dropdown';

const Edit = () => {
    const router = useRouter();
    const [param, setParam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRole, setSelectedRole] = useState('');
    const [previewImage, setPreviewImage] = useState('/images/pngwing.com.png');

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
        username: '',
        password: '',
        email: '',
        role: '',
        np: '',
        image: null,
    });

    const breadcrumbs = [
        { link_prev: '/', prev: 'Home' },
        { link_prev: '/users', prev: 'Users' },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const fetchData = async (search = "") => {
        setLoading(true);
        const token = getCookie('access_token');
        try {
            const response = await axios.get(`${process.env.base_url}/users/show/${param}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            const data = response.data.data;
            setFormData({
                name: data.name || '',
                username: data.username || '',
                email: data.email || '',
                role: data.role || '',
                password: data.password || '',
                image: data.image || null,
            });
            setPreviewImage(`${process.env.base_url}/users/image/${data.image}`)
            setSelectedRole(data.role)
            setData(response.data.data);
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
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('role', formData.role);
        data.append('password', formData.password);

        if (formData.image) {
            data.append('image', formData.image);
        }

        const token = getCookie('access_token');

        try {
            const response = await axios.put(`${process.env.base_url}/users/?id=${param}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
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

    const handleRoleChange = (value) => {
        setSelectedRole(value);
        setFormData((prevData) => ({
            ...prevData,
            role: value,
        }));
    };

    const handleFileChange = (file) => {
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setFormData((prevData) => ({
                ...prevData,
                image: file,
            }));
        }
    };

    const roles = [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
        { value: '6', label: '6' },
    ];

    return (
        <Layout>
            <Header breadcrumbs={breadcrumbs} active="Edit" />
            <form onSubmit={handleEdit} className="work-page">
                <div className="container">
                    <div className="flex justify-between p-4 w-full bg-gray-50 overflow-hidden rounded-t-md">
                        <h2 className="text-[#20288E] font-medium flex items-center">
                            <Link href={'/users'}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M6.325 12.85q-.225-.15-.337-.375T5.874 12t.113-.475t.337-.375l8.15-5.175q.125-.075.263-.112T15 5.825q.4 0 .7.288t.3.712v10.35q0 .425-.3.713t-.7.287q-.125 0-.262-.038t-.263-.112z" />
                                </svg>
                            </Link>
                            User - {formData.username}
                        </h2>
                    </div>
                    <hr />
                    <div className="flex gap-[8%] w-full p-4">
                        <div className="w-[50%]">
                            <Input label="Username" name="username" value={formData.username} onChange={handleInputChange} />
                            <Input label="Name" name="name" value={formData.name} onChange={handleInputChange} />
                            <Input label="Email" name="email" value={formData.email} onChange={handleInputChange} />
                            <Dropdown
                                label="Role"
                                options={roles}
                                selectedOption={selectedRole}
                                onChange={handleRoleChange}
                            />
                        </div>
                        <div className="w-[50%] align-bottom content-end">
                            <div className="rounded-full overflow-hidden w-44 h-44 m-auto mb-2">
                                <Image
                                    src={previewImage || '/images/default-profile.png'}
                                    width={176}
                                    height={176}
                                    alt="User Image"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <FileInput
                                allowedFileType="image"
                                defaultFileName={formData.image}
                                onFileChange={handleFileChange}
                            />
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
