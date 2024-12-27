import React from 'react';
import ContentLoader from 'react-content-loader';

const SkeletonTable = () => {
    return (
        <ContentLoader
            speed={2}
            width="100%"
            height={160}
            viewBox="0 0 100% 160"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
        >
            <rect x="0" y="10" rx="4" ry="4" width="100%" height="20" />
            <rect x="0" y="40" rx="4" ry="4" width="100%" height="20" />
            <rect x="0" y="70" rx="4" ry="4" width="100%" height="20" />
            <rect x="0" y="100" rx="4" ry="4" width="100%" height="20" />
        </ContentLoader>
    );
};
export default SkeletonTable