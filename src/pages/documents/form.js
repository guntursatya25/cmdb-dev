import Layout from '@/components/Layout';
import FileInput from '@/components/atoms/FileInput';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/Textarea';
import Toggle from '@/components/atoms/Toogle';
import Header from '@/components/Layout/layout/Header';
import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getCookie } from 'cookies-next';

const Form = () => {
  const [isPublic, setIsPublic] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    web_link: '',
    notes: '',
    document: null,
  });

  const breadcrumbs = [
    { link_prev: '/', prev: 'Home' },
    { link_prev: '/documents', prev: 'Documents' },
  ];

  const handleToggle = (value) => {
    setIsPublic(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (file) => {
    setFormData((prevData) => ({
      ...prevData,
      document: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('web_link', formData.web_link);
    data.append('notes', formData.notes);
    data.append('isPublic', isPublic ? 1 : 0);
    
    if (formData.document) {
      data.append('document', formData.document);
    }
    const token = getCookie('access_token');
    console.log(token)
    
    try {
      const response = await axios.post(`${process.env.base_url}/assets/documents/store`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Response:', response.data);
      Swal.fire({
        icon: "success",
        text: "Document added successfully!",
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: "error",
        text: "Failed to add document.",
      });
    }
  };
  

  return (
    <Layout>
      <Header breadcrumbs={breadcrumbs} active="Form" />
      <form onSubmit={handleSubmit} className="work-page">
        <div className="container">
          <div className="flex justify-between p-4 w-full bg-gray-50 overflow-hidden rounded-t-md">
            <h2 className="text-[#20288E] font-medium flex items-center">
              <Link href={'/documents'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M6.325 12.85q-.225-.15-.337-.375T5.874 12t.113-.475t.337-.375l8.15-5.175q.125-.075.263-.112T15 5.825q.4 0 .7.288t.3.712v10.35q0 .425-.3.713t-.7.287q-.125 0-.262-.038t-.263-.112z"/>
                </svg>
              </Link>
              New Item - Document
            </h2>
            <Toggle label="Public" value={isPublic} onToggle={handleToggle} />
          </div>
          <hr />
          <div className="flex gap-[8%] w-full p-4">
            <div className="w-[50%]">
              <Input label="Name" name="name" value={formData.name} onChange={handleInputChange} />
              <Input label="Web link" name="web_link" value={formData.web_link} onChange={handleInputChange} />
              <TextArea label="Notes" name="notes" rows={4} value={formData.notes} onChange={handleInputChange} />
            </div>
            <div className="w-[50%] align-bottom content-end">
            <FileInput
    defaultFileName={formData.filename}
    onFileChange={(file) => {
        console.log("Selected file:", file);
        setFormData((prevData) => ({
            ...prevData,
            document: file,
        }));
    }}
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