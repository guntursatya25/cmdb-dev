import Layout from '@/components/Layout';
import Input from '@/components/atoms/Input';
import Header from '@/components/Layout/layout/Header';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getCookie } from 'cookies-next';
import Dropdown from '@/components/atoms/Dropdown';
import { useRouter } from 'next/router';

const Form = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    item_status: '',
    parent_id: null
  });

  const breadcrumbs = [
    { link_prev: '/', prev: 'Home' },
    { link_prev: '/setup', prev: 'Setup' },
    { link_prev: '/setup/status', prev: 'Item Status' },
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
      const response = await axios.post(
        `${process.env.base_url}/masterdatas/status-items`, data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = response.data.result.data || [];
      const formattedOptions = responseData.map((item) => ({
        label: item.name,
        value: parseInt(item.id, 10),
      }));
      setData(formattedOptions);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getCookie('access_token');

    try {
      const response = await axios.post(
        `${process.env.base_url}/masterdatas/status-items/store`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      Swal.fire({
        icon: "success",
        text: "Item status added successfully!",
      });
      setFormData({
        name: '',
        item_status: '',
        parent_id: null
      });
    } catch (error) {
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || "Failed to add item.";
      Swal.fire({
        icon: "error",
        text: errorMessage,
      });
    }
  };

  const options = [
    { value: 'licenses_status', label: 'Licenses status' },
    { value: 'computer_status', label: 'Computer status' },
  ];

  return (
    <Layout>
      <Header breadcrumbs={breadcrumbs} active="Item Status Form" />
      <form onSubmit={handleSubmit} className="work-page">
        <div className="container">
          <div className="flex justify-between p-4 w-full bg-gray-50 overflow-hidden rounded-t-md">
            <h2 className="text-[#20288E] font-medium flex items-center">
              <Link href={'/setup/status'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M6.325 12.85q-.225-.15-.337-.375T5.874 12t.113-.475t.337-.375l8.15-5.175q.125-.075.263-.112T15 5.825q.4 0 .7.288t.3.712v10.35q0 .425-.3.713t-.7.287q-.125 0-.262-.038t-.263-.112z" />
                </svg>
              </Link>
              New Item - Status
            </h2>
          </div>
          <hr />
          <div className="flex gap-[8%] w-full p-4">
            <div className="w-[50%]">
              <Input label="Name" name="name" value={formData.name} onChange={handleInputChange} />
              <Dropdown
                label="Item Status"
                options={options}
                selectedOption={formData.item_status}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, item_status: value }))
                }
              />
            </div>
            <div className="w-[50%] align-bottom content-start">
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