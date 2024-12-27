import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Layout/layout/Navbar';
import { GrAnnounce } from 'react-icons/gr';
import FormatDate from '@/utils/FormatDate';
import { CircularProgress } from '@mui/material';

const Index = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.post(`${process.env.base_url}/announcement`, {
          page: 1,
          per_page: 5,
        });
        const fetchedAnnouncements = Array.isArray(response.data.data) ? response.data.data : [];
        setAnnouncements(fetchedAnnouncements);
        console.log(fetchAnnouncements,"log");
        
      } catch (error) {
        console.error('Error fetching announcements:', error);
        setAnnouncements([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className='h-screen w-full'>
      <Navbar />
      <div>
        {loading ? (
          <p className='flex justify-center m-auto h-full w-full text-center'>
            <CircularProgress />
          </p>
        ) : announcements.length === 0 ? (
          <p className='flex justify-center m-auto h-full w-full'>
            No announcements available.
          </p>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className='p-3 md:p-5 grid md:grid-cols-2 gap-[1%]'>
              <div className='border border-spacing-1 rounded-lg flex gap-5 p-3'>
                <GrAnnounce size={30} color='blue' />
                <div>
                  <p className='font-bold text-sm'>{announcement.title}</p>
                  <p>
                    <small className='text-xs pt-0 text-gray-600'>
                      {FormatDate(announcement.created_at)}
                    </small>
                  </p>
                  <div
                    className='pt-2 text-sm text-gray-800'
                    dangerouslySetInnerHTML={{ __html: announcement.content }}
                  ></div>
                  {announcement.docs_related && announcement.docs_related.length > 0 && (
                    <div className='pt-4'>
                      <p className='font-semibold text-sm'>Related Documents:</p>
                      {announcement.docs_related.map((doc) => (
                        <div key={doc.id} className='mt-2'>
                          <p className='text-sm text-gray-600'>
                            <a href={doc.detail.web_link} target='_blank' rel='noopener noreferrer'>
                              {doc.detail.filename}
                            </a>
                          </p>
                          {/* Tampilkan nama dan link ke dokumen */}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Index;
