import Layout from '@/components/Layout';
import FileInput from '@/components/atoms/FileInput';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/Textarea';
import Toggle from '@/components/atoms/Toogle';
import Header from '@/components/Layout/layout/Header';
import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';
import Dropdown from '@/components/atoms/Dropdown';

const Form = () => {
  const [isPublic, setIsPublic] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    webLink: '',
    notes: '',
    document: null,
  });

  const breadcrumbs = [
    { link_prev: '/', prev: 'Home' },
    { link_prev: '/licenses', prev: 'Licenses' },
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
    data.append('web_link', formData.webLink);
    data.append('notes', formData.notes);
    data.append('isPublic', isPublic ? 1 : 0);
    if (formData.document) {
      data.append('document', formData.document);
    }

    try {
      const response = await axios.post('/your-api-endpoint', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Response:', response.data);
      alert('Document added successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to add document.');
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
              New Item - License
            </h2>
          </div>
          <hr />
          <div className="flex gap-[8%] w-full p-4">
            <div className="w-[50%]">
              <Input label="Name" name="name" value={formData.name} onChange={handleInputChange} />
              <Input label="Serial Number" type='number' name="serialnumber"  />
              <Input type='date' label='Expiration'/>
              <Dropdown label="Status"
        // options={options}
        // selectedOption={formData.dropdownValue}
        // onChange={handleDropdownChange}
        />
              <TextArea label="Descriptions" name="notes" rows={4} value={formData.notes} onChange={handleInputChange} />
            </div>
            <div className="w-[50%] align-bottom content-end">
               
              <FileInput onFileChange={handleFileChange} />
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