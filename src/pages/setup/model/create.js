import Layout from '@/components/Layout';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/Textarea';
import Header from '@/components/Layout/layout/Header';
import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getCookie } from 'cookies-next';
import Dropdown from '@/components/atoms/Dropdown';

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    product_number: '',
    item_model: '',
    weight: null,
    depth: null,
    power_consumption: null,
    power_connection: null,
    description: '',
  });

  const breadcrumbs = [
    { link_prev: '/', prev: 'Home' },
    { link_prev: '/setup', prev: 'Setup' },
    { link_prev: '/setup/model', prev: 'Models' },
  ];

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'number' ? (value === '' ? null : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getCookie('access_token');

    try {
      const response = await axios.post(
        `${process.env.base_url}/masterdatas/models/store`, formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      Swal.fire({
        icon: "success",
        text: "Item model added successfully!",
      });
      setFormData({
        name: '',
        product_number: '',
        item_model: '',
        weight: null,
        depth: null,
        power_consumption: null,
        power_connection: null,
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

  const options = [
    { value: 'computer_model', label: 'Computer' },
  ];
  return (
    <Layout>
      <Header breadcrumbs={breadcrumbs} active="Item Model Form" />
      <form onSubmit={handleSubmit} className="work-page">
        <div className="container">
          <div className="flex justify-between p-4 w-full bg-gray-50 overflow-hidden rounded-t-md">
            <h2 className="text-[#20288E] font-medium flex items-center">
              <Link href={'/setup/model'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M6.325 12.85q-.225-.15-.337-.375T5.874 12t.113-.475t.337-.375l8.15-5.175q.125-.075.263-.112T15 5.825q.4 0 .7.288t.3.712v10.35q0 .425-.3.713t-.7.287q-.125 0-.262-.038t-.263-.112z" />
                </svg>
              </Link>
              New Item - Model
            </h2>
          </div>
          <hr />
          <div className="flex gap-[8%] w-full p-4">
            <div className="w-[50%]">
              <Input label="Name" name="name" value={formData.name} onChange={handleInputChange} />
              <Input label="Product Number" name="product_number" value={formData.product_number} onChange={handleInputChange} />
              <Dropdown
                label="Model"
                options={options}
                selectedOption={formData.item_model}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, item_model: value }))
                }
              />
              <Input label="Weight" name="weight" type="number" value={formData.weight || ''} onChange={handleInputChange} />
              <Input label="Depth" name="depth" type="number" value={formData.depth || ''} onChange={handleInputChange} />
            </div>
            <div className="w-[50%]">
              <Input label="Power Consumption" name="power_consumption" type="number" value={formData.power_consumption || ''} onChange={handleInputChange} />
              <Input label="Power Connection" name="power_connection" type="number" value={formData.power_connection || ''} onChange={handleInputChange} />
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

export default Form;