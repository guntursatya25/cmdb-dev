import axios from 'axios';
import Layout from '@/components/Layout'
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import Dropdown from '@/components/atoms/Dropdown';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/Textarea';
import Header from '@/components/Layout/layout/Header'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { getCookie } from 'cookies-next';
import Swal from 'sweetalert2';
import { Button } from '@/components/atoms/Button';
import Link from 'next/link';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const ticket = () => {
    const router = useRouter();
    const [param, setParam] = useState(null);
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [category, setCategory] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        priority: '',
        impact: '',
        urgency: '',
        assigneeId: null,
        resolvedDate: '',
        causes: '',
        impacts: '',
        description: '',
        categoryId: null
    });

    const fetchData = async () => {
        setLoading(true);
        const token = getCookie('access_token');
        try {
            const responseUser = await axios.post(
                `${process.env.base_url}/users`, data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const responseCategory = await axios.post(
                `${process.env.base_url}/masterdatas/categories`, { item_category: 'ticket_category' },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const responseData = responseUser.data.data.data || [];
            const formattedOptions = responseData
                .filter((item) => item.role > 4)
                .map((item) => ({
                    label: `[${item.np}] - ${item.username}`,
                    value: parseInt(item.id, 10),
                }));
            setData(formattedOptions);

            const responseCategories = responseCategory.data.result.data || [];
            const categoryOptions = responseCategories
                .map((item) => ({
                    label: `>> ${item.name}`,
                    value: parseInt(item.id, 10),
                }));
            setCategory(categoryOptions);
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
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === "resolvedDate") {
            const date = new Date(value);
            formattedValue = date.toISOString().slice(0, 16);
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: formattedValue,
        }));
    };

    const handleQuillChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            description: value,
        }));
    };

    const handleImageUpload = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64 = reader.result;
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection();
                    quill.insertEmbed(range.index, 'image', base64);
                };
                reader.readAsDataURL(file);
            }
        };
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = getCookie('access_token');

        const resolvedDate = formData.resolvedDate ? new Date(formData.resolvedDate).toISOString() : new Date().toISOString();

        const payload = {
            ...formData,
            resolvedDate: resolvedDate,
        };

        try {
            const response = await axios.post(
                `${process.env.base_url}/incidents/store`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            Swal.fire({
                icon: "success",
                text: "Your ticket was added successfully!",
            });
            setFormData({
                title: '',
                priority: '',
                impact: '',
                urgency: '',
                assigneeId: null,
                resolvedDate: '',
                causes: '',
                impacts: '',
                description: '',
                categoryId: null
            });
        } catch (error) {
            console.error('Error response:', error.response?.data);
            const errorMessage = error.response?.data?.message || "Failed to add.";
            Swal.fire({
                icon: "error",
                text: errorMessage,
            });
        }
    };

    const breadcrumbs = [
        { link_prev: '/', prev: 'Home' },
    ];

    const options = [
        { value: 'LOW', label: 'LOW' },
        { value: 'MEDIUM', label: 'MEDIUM' },
        { value: 'HIGH', label: 'HIGH' },
    ];

    const modules = {
        toolbar: {
            container: [
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['bold', 'italic', 'underline'],
                ['link', 'image', 'video'],
                [{ 'align': [] }],
                ['clean']
            ],
            handlers: {
                image: handleImageUpload,
            },
        },
    };


    return (
        <Layout>
            <Header breadcrumbs={breadcrumbs} active="Ticket" />
            <form className='work-page' onSubmit={handleSubmit}>
                <div className='container'>
                    <div className="flex justify-between p-4 w-full bg-gray-50 overflow-hidden rounded-t-md">
                        <h2 className="text-[#20288E] font-medium flex items-center">
                            <Link href={'/incidents'}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M6.325 12.85q-.225-.15-.337-.375T5.874 12t.113-.475t.337-.375l8.15-5.175q.125-.075.263-.112T15 5.825q.4 0 .7.288t.3.712v10.35q0 .425-.3.713t-.7.287q-.125 0-.262-.038t-.263-.112z" />
                                </svg>
                            </Link>
                            Create Ticket - Incident
                        </h2>
                    </div>
                    <hr />
                    <div className='w-full flex gap-[10%] p-4'>
                        <div className='w-[60%]'>
                            <Input label="Title" name="title" value={formData.title} required={true} onChange={handleInputChange} />
                            <TextArea label="Description" name="description" rows={7} value={formData.description} required={true} onChange={handleInputChange} />
                            {/* <ReactQuill
                                theme="snow"
                                className="bg-white h-[250px]"
                                value={formData.description}
                                onChange={handleQuillChange}
                                modules={modules}
                                formats={[
                                    'header',
                                    'font',
                                    'list',
                                    'bullet',
                                    'bold',
                                    'italic',
                                    'underline',
                                    'link',
                                    'image',
                                    'align',
                                    'clean',
                                ]}
                            /> */}


                        </div>
                        <div className='w-[40%]'>
                            <Input
                                label="Resolved date"
                                name="resolvedDate"
                                type="datetime-local"
                                value={formData.resolvedDate}
                                required={true}
                                onChange={handleInputChange}
                            />
                            <Dropdown
                                label="Impact"
                                options={options}
                                selectedOption={formData.impact}
                                onChange={(value) =>
                                    setFormData((prev) => ({ ...prev, impact: value }))
                                }
                            />
                            <Dropdown
                                label="Priority"
                                options={options}
                                selectedOption={formData.priority}
                                onChange={(value) =>
                                    setFormData((prev) => ({ ...prev, priority: value }))
                                }
                            />
                            <Dropdown
                                label="Assigned to"
                                options={data}
                                required={true}
                                selectedOption={formData.assigneeId}
                                onChange={(value) =>
                                    setFormData((prev) => ({ ...prev, assigneeId: value }))
                                }
                            />
                            <Dropdown
                                label="Urgency"
                                options={options}
                                selectedOption={formData.urgency}
                                onChange={(value) =>
                                    setFormData((prev) => ({ ...prev, urgency: value }))
                                }
                            />
                            <Dropdown
                                label="Category"
                                options={category}
                                selectedOption={formData.categoryId}
                                onChange={(value) =>
                                    setFormData((prev) => ({ ...prev, categoryId: value }))
                                }
                            />
                            <TextArea label="Causes" name="causes" rows={3} value={formData.causes} onChange={handleInputChange} />
                            <TextArea label="Impacts" name="impacts" rows={3} value={formData.impacts} onChange={handleInputChange} />
                        </div>
                    </div>
                    <hr />
                    <Button name='+ Add' />
                </div>

            </form>
        </Layout>
    )
}

export default ticket