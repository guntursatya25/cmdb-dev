import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import Layout from '@/components/Layout';
import Header from '@/components/Layout/layout/Header';
import Table from '@/components/atoms/Table';
import { getCookie } from 'cookies-next';
import Input from '@/components/atoms/Input';
import Swal from 'sweetalert2';
import FormatDateTime from '@/utils/FormatDateTime';
import Dialog from '@/components/Dialog';
import SearchInput from '@/components/atoms/SearchInput';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const Index = () => {
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [create, setCreate] = useState({
        title: '',
        content: value,
        status: "1",
    });

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline'],
            ['link', 'image', 'video'],
            [{ 'align': [] }],
            ['clean']
        ],
    };

    const handleChange = (content, delta, source, editor) => {
        const html = editor.getHTML();
        setValue(html);
        setCreate(prevCreate => ({
            ...prevCreate,
            content: html,
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCreate((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const imageUrl = response.data.url;

            const editor = document.querySelector('.ql-editor');
            editor.innerHTML += `<img src="${imageUrl}" />`;
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        const token = getCookie('access_token');
        try {
            const response = await axios.post(`${process.env.base_url}/announcement`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const responseData = response.data.data?.data || [];
            setData(responseData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);


    const handleSubmit = async () => {
        const token = getCookie('access_token');
        try {
            const response = await axios.post(`${process.env.base_url}/announcement/store`, create, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            Swal.fire({
                icon: "success",
                text: "Announcement submitted successfully!",
            });
            console.log('Submit Response:', response.data);
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Failed to submit announcement.",
            });
            console.error('Error submitting announcement:', error);
        }
    };

    // const handleChange = (content, delta, source, editor) => {
    //     const html = editor.getHTML();
    //     setValue(html);
    // };

    const handleRowSelect = (selected) => {
        setSelectedRows(selected);
    };
    const breadcrumbs = [
        { link_prev: '/', prev: 'Home' },
    ];
    const renderCell = (column, value, row) => {
        // if (column === 'content') {
        //     // const displayName = truncateText(value || '', 25);
        //     return (
        //         <pre 
        //         className='dangerously_set_inner_HTML'
        //         dangerouslySetInnerHTML={{ __html: value }}
        //       ></pre>
        //         // <Link href={`/documents/${row.id || '#'}`}>
        //         //     {displayName}
        //         // </Link>
        //     );
        // }
        // if (column === 'filepath') {
        //     const filename = row.filename; 
        //     const filepath = value; 

        //     return (
        //         <button
        //             onClick={() => handleFileDownload(filepath, filename)}
        //             className="text-blue-600 hover:underline"
        //         >
        //             {truncateFilePath(filename || '', 15)}
        //         </button>
        //     );
        // }
        // if (column === 'web_link') {
        //     const displayLink = truncateText(value || '', 20);
        //     return (
        //         <Link
        //             href={value || '#'}
        //             target={value ? "_blank" : undefined}
        //             rel={value ? "noopener noreferrer" : undefined}
        //             className="text-blue-600 hover:underline"
        //         >
        //             {displayLink}
        //         </Link>
        //     );
        // }
        if (column === 'created_at') {
            return (
                <p>{FormatDateTime(value)}</p>
            )
        }
        return value || '-';
    };

    const headers = ['Title', 'Date'];
    const displayColumns = ['title', 'created_at'];
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);
    return (
        <Layout>
            <Header breadcrumbs={breadcrumbs} active="Announcements" />
            <div className="work-page pl-5">
               
                <div className='container flex items-center p-4'>
          <button onClick={handleOpenDialog} className='px-4 py-1 items-center flex border-spacing-2 bg-gray-500 text-white rounded-md'>+</button>
          <Dialog open={isDialogOpen} onClose={handleCloseDialog} title="My Dialog" className='h-[300px] w-[300px]'>
            <p>This is the content of the dialog.</p>
            <h1 className="text-xl font-bold mb-4">Announcement Editor</h1>
                <Input label="Title" name="title" value={create.title} onChange={handleInputChange} />
                <ReactQuill
                    theme="snow"
                    className='bg-white h-[250px]'
                    value={value}
                    onChange={handleChange}
                    modules={modules}
                    formats={['header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'link', 'image', 'align', 'clean']}
                />
                <button
                    onClick={handleSubmit}
                    className="mt-7 bottom-0 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Submit
                </button>
          </Dialog>
          <SearchInput />
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#a51515" d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zm5-7.1l1.9 1.9q.275.275.7.275t.7-.275t.275-.7t-.275-.7l-1.9-1.9l1.9-1.9q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275L12 11.1l-1.9-1.9q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7l1.9 1.9l-1.9 1.9q-.275.275-.275.7t.275.7t.7.275t.7-.275z" /></svg>               
          </div>
                <div className='container p-3 my-4'>
                    <Table
                        headers={headers}
                        data={data || []}
                        displayColumns={displayColumns}
                        renderCell={renderCell}
                        onRowSelect={handleRowSelect}
                        showCheckbox={true}
                    />
                </div>


                {/* <p className="mt-4">Editor Content:</p>
      <div className="border p-4 bg-gray-100 rounded-md">
        {value}
      </div> */}
            </div>
        </Layout>
    );
};

export default Index;
