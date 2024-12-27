import Layout from '@/components/Layout';
import Header from '@/components/Layout/layout/Header';
import MenuComponent from '@/components/Layout/layout/Menu';
import DocumentsContent from '@/components/DocumentsMenu/DocumentsContent';
import RelatedDoc from '@/components/DocumentsMenu/RelatedDoc';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AssociatedDoc from '@/components/DocumentsMenu/AssociatedDoc';

const Index = () => {
    const router = useRouter();
    const [param, setParam] = useState(null);

    useEffect(() => {
        if (router.query.file) {
            setParam(router.query.file);
            localStorage.setItem('currentFile', router.query.file);
        } else {
            const savedParam = localStorage.getItem('currentFile');
            if (savedParam) {
                setParam(savedParam);
            }
        }
    }, [router.query.file]);

    const breadcrumbs = [{ link_prev: '/', prev: 'Home' },
        { link_prev: '/documents', prev: 'Documents' },
    ];
    const dynamicTabs = [
        { name: 'Documents', content: <DocumentsContent idParam={param} /> },
        { name: 'Associated items', content: <AssociatedDoc idParam={param} /> },
        { name: 'Related Documents', content: <RelatedDoc idParam={param} /> },
        { name: 'Historical', content: <div>Historical Content</div> },
    ];

    return (
        <Layout>
            <Header breadcrumbs={breadcrumbs} active="Detail" />
            <div className="work-page">
                <MenuComponent tabs={dynamicTabs} />
            </div>
        </Layout>
    );
};

export default Index;
