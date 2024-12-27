import Link from 'next/link';
import { getCookie } from 'cookies-next';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Table from '@/components/atoms/Table';
import Swal from 'sweetalert2';
import Dropdown from '../atoms/Dropdown';
import { CircularProgress } from '@mui/material';

const AssociatedDoc = ({ idParam }) => {
  const router = useRouter();
  const param = router.query.file;
  const [selectedRows, setSelectedRows] = useState([]);
  const [options, setOptions] = useState([]);
  const [optionsName, setOptionsName] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    item_type: '',
    documentsId: param ? Number(param) : null,
    assetId: null,
  });

  const token = getCookie('access_token');

  const fetchItemTypes = async () => {
    const token = getCookie('access_token');
    try {
      const response = await axios.post(`${process.env.base_url}/assets`, {
        page: 1,
        per_page: 10,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.result.data;
      const uniqueItemTypes = [...new Set(data.map(item => item.item_type))];

      const dropdownOptions = uniqueItemTypes.map(itemType => ({
        label: itemType.charAt(0).toUpperCase() + itemType.slice(1),
        value: itemType,
      }));

      setOptions(dropdownOptions);
    } catch (error) {
      console.error('Error fetching item types:', error);
    }
  };

  const fetchUnitsByItemType = async (itemType) => {
    const token = getCookie('access_token');
    try {
      const response = await axios.post(`${process.env.base_url}/assets`, {
        item_type: itemType,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.result.data;

      const unitOptions = data.map(item => ({
        label: item.name,
        value: item.id,
      }));

      setOptionsName(unitOptions);
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const handleItemTypeChange = (itemType) => {
    setFormData(prev => ({
      ...prev,
      item_type: itemType,
      unit_id: '',
    }));
    fetchUnitsByItemType(itemType);
  };

  useEffect(() => {
    fetchItemTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(formData.documentsId) || isNaN(formData.assetId)) {
      Swal.fire({
        icon: 'error',
        text: 'Both documentsId and assetId must be valid numbers.',
      });
      return;
    }

    const payload = new FormData();
    payload.append('documentsId', formData.documentsId);
    payload.append('assetId', formData.assetId);

    const token = getCookie('access_token');
    try {
      const response = await axios.post(`${process.env.base_url}/assets/documents/items/store`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      Swal.fire({
        icon: 'success',
        text: 'Document added successfully!',
      });
      setFormData({
        item_type: '',
        documentsId: param ? Number(param) : null,
        assetId: null,
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        text: 'Failed to add document.',
      });
    }
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
        <Link href={`${process.env.base_url}/${row.filepath}`} download={row.filepath} className="text-blue-600 hover:underline">
          {displayFilepath}
        </Link>
      );
    }
    if (column === 'web_link') {
      const displayLink = truncateText(value, 20);
      return (
        <Link href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {displayLink}
        </Link>
      );
    }
    return value || '-';
  };

  const headers = ['Name', 'File', 'Web link', 'Notes'];
  const displayColumns = ['name', 'filepath', 'web_link', 'notes'];

  const handleRowSelect = (selected) => {
    setSelectedRows(selected);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div className="flex justify-between p-4 w-full overflow-hidden rounded-t-md">
          <h2 className="text-[#20288E] font-medium flex items-center">
            <Link href="/documents">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path fill="currentColor" d="M6.325 12.85q-.225-.15-.337-.375T5.874 12t.113-.475t.337-.375l8.15-5.175q.125-.075.263-.112T15 5.825q.4 0 .7.288t.3.712v10.35q0 .425-.3.713t-.7.287q-.125 0-.262-.038t-.263-.112z" />
              </svg>
            </Link>
            Document - Associated Document
          </h2>
        </div>
        <hr />
        <div className="flex gap-[8%] w-full p-4">
          <div className="w-[50%]">
            <Dropdown
              label="Item Type"
              options={options}
              selectedOption={formData.item_type}
              onChange={handleItemTypeChange}
            />
            {formData.item_type && (
              <Dropdown
                label="Unit"
                options={optionsName}
                selectedOption={formData.assetId}
                onChange={(value) => {
                  const numericValue = Number(value);
                  if (!isNaN(numericValue)) {
                    setFormData((prev) => ({ ...prev, assetId: numericValue }));
                  } else {
                    Swal.fire({
                      icon: 'error',
                      text: 'Selected value for assetId is not valid.',
                    });
                  }
                }}
              />
            )}
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

export default AssociatedDoc;
