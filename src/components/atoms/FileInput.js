import { useState, useEffect } from 'react';

const FileInput = ({ defaultFileName, onFileChange, allowedFileType = 'all' }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [displayFileName, setDisplayFileName] = useState(defaultFileName || 'No file chosen');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setDisplayFileName(getTruncatedFileName(file ? file.name : 'No file chosen'));
        if (onFileChange) {
            onFileChange(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        setSelectedFile(file);
        setDisplayFileName(getTruncatedFileName(file ? file.name : 'No file chosen'));
        if (onFileChange) {
            onFileChange(file);
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    const getTruncatedFileName = (filename) => {
        if (!filename) return 'No file chosen';
        const extension = filename.slice(filename.lastIndexOf('.'));
        const name = filename.slice(0, filename.lastIndexOf('.'));
        return name.length > 20 ? `${name.slice(0, 18)}...${extension}` : filename;
    };

    useEffect(() => {
        if (!selectedFile && defaultFileName) {
            setDisplayFileName(getTruncatedFileName(defaultFileName));
        }
    }, [defaultFileName, selectedFile]);

    const getAcceptType = () => {
        if (allowedFileType === 'image') return 'image/*'; 
        return undefined;
    };

    return (
        <div className="flex flex-col items-start">
            <div
                className="border-2 border-dashed border-gray-200 rounded-lg p-4 w-full max-w-md text-center"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <p className="text-gray-500 mb-4">
                    Drag & drop your file here, or
                </p>
                <label className="bg-gray-200 px-4 py-2 rounded cursor-pointer inline-block">
                    Choose File
                    <input
                        type="file"
                        accept={getAcceptType()} 
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
                <span className={`ml-2 ${displayFileName === 'No file chosen' ? 'text-gray-600' : 'text-[#20288E]'}`}>
                    {displayFileName}
                </span>
            </div>
        </div>
    );
};

export default FileInput;
