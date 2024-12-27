import Layout from '@/components/Layout';
import FileInput from '@/components/atoms/FileInput';
import Input from '@/components/atoms/Input';
import Header from '@/components/Layout/layout/Header';
import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getCookie } from 'cookies-next';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import Image from 'next/image';
import Dropdown from '@/components/atoms/Dropdown';

const Form = () => {
    const [visible, setVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
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

    const [previewImage, setPreviewImage] = useState('/images/pngwing.com.png');

    const handleFileChange = (file) => {
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setFormData((prevData) => ({
                ...prevData,
                image: file,
            }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('username', formData.username);
        data.append('password', formData.password);
        data.append('email', formData.email);
        data.append('role', formData.role);
        data.append('np', formData.np);

        if (formData.image) {
            data.append('image', formData.image);
        }
        const token = getCookie('access_token');

        try {
            const response = await axios.post(`${process.env.base_url}/users/store`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            Swal.fire({
                icon: "success",
                text: "Account added successfully!",
            });
            setFormData({
                name: '',
                username: '',
                password: '',
                email: '',
                role: '',
                np: '',
                image: null,
            });
            setSelectedRole('');
            setPreviewImage('/images/pngwing.com.png');
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: "error",
                text: "Failed to add account.",
            });
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

    const handleRoleChange = (value) => {
        setSelectedRole(value);
        setFormData((prevData) => ({
            ...prevData,
            role: value,
        }));
    };

    return (
        <Layout>
            <Header breadcrumbs={breadcrumbs} active="Form" />
            <form onSubmit={handleSubmit} className="work-page">
                <div className="container">
                    <div className="flex justify-between p-4 w-full bg-gray-50 overflow-hidden rounded-t-md">
                        <h2 className="text-[#20288E] font-medium flex items-center">
                            <Link href={'/users'}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M6.325 12.85q-.225-.15-.337-.375T5.874 12t.113-.475t.337-.375l8.15-5.175q.125-.075.263-.112T15 5.825q.4 0 .7.288t.3.712v10.35q0 .425-.3.713t-.7.287q-.125 0-.262-.038t-.263-.112z" />
                                </svg>
                            </Link>
                            New Item - User
                        </h2>
                    </div>
                    <hr />
                    <div className="flex gap-[8%] w-full p-4">
                        <div className="w-[50%]">
                            <Input label="Name" name="name" value={formData.name} onChange={handleInputChange} />
                            <Input label="Username" name="username" value={formData.username} onChange={handleInputChange} />
                            <Input label="Email" name="email" value={formData.email} onChange={handleInputChange} />
                            <Dropdown
                                label="Role"
                                options={roles}
                                selectedOption={selectedRole}
                                onChange={handleRoleChange}
                            />
                            <Input label="NP" name="np" value={formData.np} onChange={handleInputChange} />
                            <div className="list_login_form flex items-center justify-between w-full gap-[10%]">
                                <label htmlFor="w-2/6 Password">
                                    Password
                                </label>
                                <div className="flex items-center border border- rounded-md p-1 w-4/6 focus-within:border-black focus-within:border-2 bg-white"> {/* focus-within class added */}
                                    <input
                                        type={!visible ? "password" : "text"}
                                        id="Password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Input password.."
                                        className="outline-none w-full py-1"
                                    />
                                    <div className="icon cursor-pointer ml-2" onClick={() => setVisible(!visible)}>
                                        {!visible ? (
                                            <FaEye className="text-gray-500" />
                                        ) : (
                                            <FaEyeSlash className="text-gray-500" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-[50%] align-bottom content-end">
                            <div className="rounded-full overflow-hidden w-44 h-44 m-auto mb-3">
                                <Image src={previewImage} alt='preview image' width={176} height={176} className="object-cover w-full h-full" />
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
                            + Add
                        </button>
                    </div>
                </div>
            </form>
        </Layout>
    );
};

export default Form;