import FileInput from '@/components/atoms/FileInput';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/Textarea';
import Toggle from '@/components/atoms/Toogle';
import Link from 'next/link';
import { getCookie } from 'cookies-next';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const LicenseContent = ({ idParam }) => {
  const [formData, setFormData] = useState({
   name: "",
        serial_number: null,
        description: null,
        expiration: null,
        number: null,
        status_id: null,
        asset_id: null,
        md_publisher: null,
        md_type_license: null,
  });

  const [savedName, setSavedName] = useState('');
  const documentId = idParam;
  const token = getCookie('access_token');

  useEffect(() => {
    if (documentId) {
      getData();
    }
  }, [documentId]);

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

  const handleEdit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('web_link', formData.web_link);
    data.append('notes', formData.notes);
    data.append('isPublic', formData.isPublic ? 1 : 0);

    if (formData.document) {
      data.append('filename', formData.filename);
      data.append('filepath', formData.filepath);
    }

    try {
      const response = await axios.put(
        `${process.env.base_url}/assets/documents?id=${documentId}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Response:', response.data);
      Swal.fire({
        icon: "success",
        text: "Document updated Successfully.",
      });
      setSavedName(formData.name);
      getData();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: "success",
        text: "Failed to updated Successfully.",
      });
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get(
        `${process.env.base_url}/assets/licenses/show/${documentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data.data;
      setFormData({
        name: data.name || '',
        serial_number: data.serial_number || '',
        description: data.name || '',
        expiration: data.name || '',
        number: data.name || '',
        status_id: data.name || '',
        asset_id: data.name || '',
        md_publisher: data.name || '',
        md_type_license: data.name || '',
      });

      setSavedName(data.document.name || '');
    } catch (err) {
      console.error('Error fetching document data:', err);
      if (err.response) {
        console.error('Response Data:', err.response.data);
      }
    }
  };
  console.log(formData,"data");
  
  return (
    <form onSubmit={handleEdit}>
      <div>
        <div className="flex justify-between p-4 w-full overflow-hidden rounded-t-md">
          <h2 className="text-[#20288E] font-medium flex items-center">
            <Link href={'/documents'}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M6.325 12.85q-.225-.15-.337-.375T5.874 12t.113-.475t.337-.375l8.15-5.175q.125-.075.263-.112T15 5.825q.4 0 .7.288t.3.712v10.35q0 .425-.3.713t-.7.287q-.125 0-.262-.038t-.263-.112z"
                />
              </svg>
            </Link>
            Document - {savedName}
          </h2>
       
        </div>
        <hr />
        <div className="flex gap-[8%] w-full p-4">
          <div className="w-[50%]">
            <Input label="Name" name="name" value={formData.name} onChange={handleInputChange} />
            <Input label="Web link" name="web_link" value={formData.web_link} onChange={handleInputChange} />
            <TextArea label="Notes" name="notes" rows={4} value={formData.notes} onChange={handleInputChange} />
          </div>
          <div className="w-[50%] align-bottom content-end">
            <FileInput defaultFileName={formData.filename} onFileChange={handleFileChange} />
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
  );
};

export default LicenseContent;