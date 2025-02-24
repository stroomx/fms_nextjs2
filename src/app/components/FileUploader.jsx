// export default function FileUploader({ name = 'fileuploader', id = 'fileuploaderid', extentions = '.pdf, .doc, .docx, .txt' }) {
//     return <>
//         <input type="file" name={name} id={id} accept={extentions} />
//     </>;
// }

import React, { useState, useEffect } from 'react';

const FileUploader = ({ value, type, name, attr1, attr2, attr3 }) => {
    const [roout, setRoout] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [key, setKey] = useState(`test_${Math.random().toString(36).substring(2)}`);
    const [file, setFile] = useState(null);

    const uploadUrl = `_customfield.php?type=uploader&key=${key}`;

    useEffect(() => {
        if (value > 0) {
            if (type === 'photo') {
                // Replace with a React-specific fetch for photo display
                setRoout(filedisplay_get(value, 'photo'));
            } else {
                setRoout(filedisplay_get(value));
            }
        }

        if (!attr2) {
            setAttr2(roout ? 'Click this box or drag to replace' : 'Click this box or drag to upload');
        }

        // Add to session (custom field uploader keys)
        recallsession_array_add('customfield_uploader_keys', key, key);

        // Log the key creation event (use appropriate logging in React)
        console.log(`Key Created | ${key} | ${username()}`);
    }, [value, type, roout, key]);

    const renderProgress = (progress) => {
        setUploadProgress(Math.floor(progress));
        setUploadStatus(`${progress}%`);
    };

    const showMessage = (msg) => {
        setUploadStatus(msg);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            renderProgress(0);
            uploadFile(selectedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Add specific class for drag over state if necessary
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files.length) {
            uploadFile(e.dataTransfer.files[0]);
        }
    };

    const uploadFile = (file) => {
        setIsUploading(true);

        if (useLargeUpload(file.size)) {
            largeUpload(file);
        } else {
            standardUpload(file);
        }
    };

    const standardUpload = (file) => {
        const formData = new FormData();
        formData.append(key, file);
        formData.append('key', key);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadUrl, true);
        xhr.onload = () => showMessage(xhr.responseText);
        xhr.send(formData);
    };

    const largeUpload = (file) => {
        const BYTES_PER_CHUNK = 1024 * 1000; // 1MB
        const size = file.size;
        const NUM_CHUNKS = Math.max(Math.ceil(size / BYTES_PER_CHUNK));
        let start = 0;
        let end = BYTES_PER_CHUNK;
        let num = 1;

        const chunkUpload = (blob) => {
            const fd = new FormData();
            fd.append('upload', blob, file.name);
            fd.append('num', num);
            fd.append('key', key);
            fd.append('num_chunks', NUM_CHUNKS);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', uploadUrl, true);
            xhr.onload = () => showMessage(xhr.responseText);
            xhr.send(fd);
        };

        while (start < size) {
            chunkUpload(file.slice(start, end));
            start = end;
            end = start + BYTES_PER_CHUNK;
            num++;
        }
    };

    const useLargeUpload = (size) => size > 1024 * 10; // 10MB

    return (
        <div id={`customfield_${name}`} className="text-center">
            <input
                type="file"
                id={`${key}_upload_${name}`}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <div
                className="border border-dashed rounded p-3 mb-3"
                style={{ minWidth: '200px', cursor: 'pointer' }}
                onClick={() => document.getElementById(`${key}_upload_${name}`).click()}
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <div>{attr2}</div>
                {roout && <div id={`${key}_display${type}`} className="mb-2">{roout}</div>}
            </div>

            <div className={`${key}_result w-100 text-center`}>
                <div className={`${key}_text`}>{uploadStatus}</div>
                {isUploading && (
                    <div className="mb-2">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
                <div className="progress mb-2" style={{ height: '20px' }}>
                    <div
                        className="progress-bar progress-bar-striped"
                        role="progressbar"
                        style={{ width: `${uploadProgress}%` }}
                        aria-valuenow={uploadProgress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    >
                        {uploadProgress}%
                    </div>
                </div>
            </div>

            <div className={`${key}_mystatus`}></div>

            <button
                className="btn btn-primary mt-3"
                onClick={() => document.getElementById(`${key}_upload_${name}`).click()}
            >
                Upload File
            </button>
        </div>
    );
};

export default FileUploader;
