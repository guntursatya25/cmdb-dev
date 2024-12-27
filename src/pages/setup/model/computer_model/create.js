import Layout from '@/components/Layout';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/Textarea';
import Header from '@/components/Layout/layout/Header';
import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getCookie } from 'cookies-next';

const FormItemType = () => {
  const [formData, setFormData] = useState({
    name: '',
    item_type: '',
    description: '',
  });

  const breadcrumbs = [
    { link_prev: '/', prev: 'Home' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new URLSearchParams();
    data.append('name', formData.name);
    data.append('item_type', formData.item_type);
    data.append('description', formData.description);
    if (formData.parent_id) {
      data.append('parent_id', formData.parent_id);
    }

    const token = getCookie('access_token');

    try {
      const response = await axios.post(
        `${process.env.base_url}/masterdatas/item-types/store`,
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      Swal.fire({
        icon: "success",
        text: "Item type added successfully!",
      });
      setFormData({
        name: '',
        item_type: '',
        description: '',
      });
    } catch (error) {
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || "Failed to add item type.";
      Swal.fire({
        icon: "error",
        text: errorMessage,
      });
    }
  };

  return (
    <Layout>
      <Header breadcrumbs={breadcrumbs} active="Item Type Form" />
      <form onSubmit={handleSubmit} className="work-page">
        <div className="container">
          <div className="flex justify-between p-4 w-full bg-gray-50 overflow-hidden rounded-t-md">
            <h2 className="text-[#20288E] font-medium flex items-center">
              <Link href={'/documents'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M6.325 12.85q-.225-.15-.337-.375T5.874 12t.113-.475t.337-.375l8.15-5.175q.125-.075.263-.112T15 5.825q.4 0 .7.288t.3.712v10.35q0 .425-.3.713t-.7.287q-.125 0-.262-.038t-.263-.112z" />
                </svg>
              </Link>
              New Item - Type
            </h2>
          </div>
          <hr />
          <div className="flex gap-[8%] w-full p-4">
            <div className="w-[50%]">
              <Input label="Name" name="name" value={formData.name} onChange={handleInputChange} />
              <Input label="Item type" name="item_type" value={formData.item_type} onChange={handleInputChange} />
            </div>
            <div className="w-[50%] align-bottom content-end">
              <TextArea label="Description" name="description" rows={4} value={formData.description} onChange={handleInputChange} />
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

export default FormItemType;