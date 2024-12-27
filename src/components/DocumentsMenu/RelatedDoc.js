import FileInput from '@/components/atoms/FileInput';
import Input from '@/components/atoms/Input';
import Link from 'next/link';
import { getCookie } from 'cookies-next';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Table from '@/components/atoms/Table';
import Swal from 'sweetalert2';
import { CircularProgress } from '@mui/material';
import TextArea from '../atoms/Textarea';

const RelatedDoc = ({ idParam }) => {
  const router = useRouter();
  const param = router.query.file;
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    document_parent: param,
    web_link: '',
    notes: '',
    document: null,
  });

  const fetchData = async (search = "") => {
    setLoading(true);
    const token = getCookie('access_token');
    try {
      const response = await axios.get(
        `${process.env.base_url}/assets/documents/show/${param}`,
        { headers: { Authorization: `Bearer ${token}` } }
      ); const childs = response.data.data.document.document_childs.map((child) => child.detail);
      setData(childs);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const truncateText = (text, maxLength) => {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const truncateFilePath = (filename, maxLength) => {
    const extension = filename.substring(filename.lastIndexOf('.'));
    const nameWithoutExtension = filename.substring(0, filename.lastIndexOf('.'));
    if (nameWithoutExtension.length <= maxLength) return filename;
    return nameWithoutExtension.slice(0, maxLength) + '...' + extension;
  };

  const renderCell = (column, value, row) => {
    if (column === 'name') {
      const displayName = truncateText(row.name, 25);
      return (
        <Link href={`/documents/${row.id}`}>
          {displayName}
        </Link>
      );
    }
    if (column === 'filepath') {
      const displayFilepath = truncateFilePath(row.filepath, 15);
      return (
        <Link href={row.filepath ? `${process.env.base_url}/${row.filepath}` : '#'} download={row.filepath} className="text-blue-600 hover:underline">
          {displayFilepath}
        </Link>
      );
    }
    if (column === 'web_link') {
      const displayLink = truncateText(value, 20);
      return (
        value ? (
          <Link href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {displayLink}
          </Link>
        ) : (
          <span>-</span>  
        )
      );
    }
    if (column === 'filepath') {
      const displayFilepath = truncateFilePath(row.filepath, 15);
      return (
        <Link href={row.filepath ? `${process.env.base_url}/${row.filepath}` : '#'} download={row.filepath} className="text-blue-600 hover:underline">
          {displayFilepath}
        </Link>
      );
    }
    return value || '-';
  };

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) return;

    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete the selected items?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const token = getCookie('access_token');
        const deleteRequests = selectedRows.map(rowId => {
          const rowData = data[rowId];
          return axios.delete(`${process.env.base_url}/assets/documents?id=${rowData.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        });

        Promise.all(deleteRequests)
          .then(() => {
            Swal.fire(
              'Deleted!',
              'Your selected items have been deleted.',
              'success'
            );
            setData(prevData => prevData.filter((_, index) => !selectedRows.includes(index)));
            setSelectedRows([]);
          })
          .catch(error => {
            console.error("Error deleting data:", error);
            Swal.fire(
              'Error!',
              'There was an error deleting the selected items.',
              'error'
            );
          });
      }
    });
  };
  const headers = ['Name', 'File', 'Web link', 'Notes'];
  const displayColumns = ['name', 'filepath', 'web_link', 'notes'];

  const handleRowSelect = (selected) => {
    setSelectedRows(selected);
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
    data.append('document_parent', formData.document_parent);

    if (formData.document) {
      data.append('document', formData.document);
    } else {
      Swal.fire({
        icon: "error",
        text: "Please select a document.",
      });
      return;
    }

    const token = getCookie('access_token');
    try {
      const response = await axios.post(`${process.env.base_url}/assets/documents/related/store`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      Swal.fire({
        icon: "success",
        text: "Document added successfully!",
      });
      fetchData()
      setFormData({
        name: '',
        document_parent: param,
        web_link: '',
        notes: '',
        document: null,
        filename:''
      })
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: "error",
        text: "Failed to add document.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div className="flex justify-between p-4 w-full overflow-hidden rounded-t-md">
          <h2 className="text-[#20288E] font-medium flex items-center">
            <Link href={'/documents'}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path fill="currentColor" d="M6.325 12.85q-.225-.15-.337-.375T5.874 12t.113-.475t.337-.375l8.15-5.175q.125-.075.263-.112T15 5.825q.4 0 .7.288t.3.712v10.35q0 .425-.3.713t-.7.287q-.125 0-.262-.038t-.263-.112z" />
              </svg>
            </Link>
            Document - Related Document
          </h2>
        </div>
        <hr />
        <div className="flex gap-[8%] w-full p-4">
          <div className="w-[50%]">
            <Input label="Name" name="name" value={formData.name} onChange={handleInputChange} />
            <Input label="Web link" name="web_link" value={formData.web_link} onChange={handleInputChange} />
            <TextArea label="Notes" name="notes" rows={4} value={formData.notes} onChange={handleInputChange} />
          </div>
          <div className="w-[50%] flex items-start ">

            <FileInput
              defaultFileName={formData.filename}
              onFileChange={(file) => {
                setFormData((prevData) => ({
                  ...prevData,
                  document: file,
                }));
              }}
            />
          </div>

        </div>
        <div className="w-full flex justify-end p-4">
          <button type="submit" className="bg-[#20288E] text-white px-3 py-2 rounded-md hover:bg-[#4952da]">
            + Add
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center w-full">
            <CircularProgress />
          </div>
        ) : (
          <Table
            headers={headers}
            data={data}
            displayColumns={displayColumns}
            renderCell={renderCell}
            onRowSelect={handleRowSelect}
            showCheckbox={true}
          />
        )}
      </div>
    </form>
  );
};

export default RelatedDoc;
