import React, { useState, useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { MdUpload, MdCheckCircle, MdError, MdClose, MdAutoAwesome } from 'react-icons/md';
import axios from 'axios';
import config from '../../../conf/configuration';
import { AuthContext } from '../../../main';
import fire from '../../../conf/fire';

/**
 * ResumeUploader
 * Uploads a PDF resume to the backend, gets Gemini-parsed data,
 * and calls updateResumeData() to pre-fill the entire resume form.
 */
const ResumeUploader = ({ updateResumeData, onClose }) => {
    const { t } = useTranslation('common');
    const user = useContext(AuthContext);

    const [dragOver, setDragOver] = useState(false);
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle | uploading | parsing | success | error
    const [errorMessage, setErrorMessage] = useState('');
    const [parsedFields, setParsedFields] = useState(null);
    const fileInputRef = useRef(null);

    const handleFile = (selectedFile) => {
        if (!selectedFile) return;
        if (selectedFile.type !== 'application/pdf') {
            setErrorMessage('Only PDF files are supported. Please upload a .pdf file.');
            setStatus('error');
            return;
        }
        if (selectedFile.size > 10 * 1024 * 1024) {
            setErrorMessage('File is too large. Maximum size is 10MB.');
            setStatus('error');
            return;
        }
        setFile(selectedFile);
        setStatus('idle');
        setErrorMessage('');
        setParsedFields(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        handleFile(droppedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => setDragOver(false);

    const handleFileInputChange = (e) => {
        handleFile(e.target.files[0]);
    };

    const handleUploadAndParse = async () => {
        if (!file) return;

        setStatus('uploading');
        setErrorMessage('');

        try {
            const formData = new FormData();
            formData.append('resume', file);

            // Pass userId so backend can save to Firebase Storage
            if (user?.uid) {
                formData.append('userId', user.uid);
            }

            setStatus('parsing');

            const response = await axios.post(
                `${config.provider}://${config.backendUrl}/api/parse-resume`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 60000, // 60s — Gemini can take a moment
                }
            );

            if (response.data?.success && response.data?.data) {
                const parsed = response.data.data;

                // Count how many meaningful fields were populated
                const filledFields = [];
                if (parsed.firstname || parsed.lastname) filledFields.push('Personal info');
                if (parsed.occupation) filledFields.push('Occupation');
                if (parsed.email) filledFields.push('Email');
                if (parsed.employments?.length) filledFields.push(`${parsed.employments.length} work experience(s)`);
                if (parsed.educations?.length) filledFields.push(`${parsed.educations.length} education(s)`);
                if (parsed.skills?.length) filledFields.push(`${parsed.skills.length} skill(s)`);
                if (parsed.summary) filledFields.push('Summary');

                setParsedFields(filledFields);
                setStatus('success');

                // Pre-fill the form — merge all parsed data into resumeData
                updateResumeData({
                    ...parsed,
                    // Reset completedSteps so user reviews each section
                    completedSteps: [],
                    // Preserve the uploaded resume URL in the resume data
                    ...(parsed.uploadedResumeUrl && {
                        uploadedResumeUrl: parsed.uploadedResumeUrl,
                        uploadedResumeFileName: parsed.uploadedResumeFileName,
                    }),
                });
            } else {
                throw new Error('Unexpected response from server');
            }
        } catch (err) {
            console.error('Resume upload/parse error:', err);
            const msg =
                err.response?.data?.error ||
                (err.code === 'ECONNABORTED' ? 'Request timed out. Please try again.' : 'Something went wrong. Please try again.');
            setErrorMessage(msg);
            setStatus('error');
        }
    };

    const handleReset = () => {
        setFile(null);
        setStatus('idle');
        setErrorMessage('');
        setParsedFields(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="bg-white border border-blue-200 rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
                <div className="flex items-center space-x-2">
                    <MdAutoAwesome className="text-blue-600 text-lg" />
                    <div>
                        <p className="text-sm font-semibold text-slate-800">Upload Existing Resume</p>
                        <p className="text-xs text-slate-500">AI will extract your info and pre-fill all form fields</p>
                    </div>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors">
                        <MdClose className="text-lg" />
                    </button>
                )}
            </div>

            <div className="p-4">
                {/* Success state */}
                {status === 'success' && parsedFields && (
                    <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <MdCheckCircle className="text-green-500 text-xl mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-green-800">Resume imported successfully!</p>
                                <p className="text-xs text-green-700 mt-1">The following fields have been pre-filled:</p>
                                <ul className="mt-2 space-y-0.5">
                                    {parsedFields.map((field, i) => (
                                        <li key={i} className="text-xs text-green-700 flex items-center space-x-1">
                                            <span className="text-green-500">✓</span>
                                            <span>{field}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-xs text-green-600 mt-2 italic">Please review each section and make any corrections needed.</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleReset}
                                className="flex-1 text-xs border border-slate-300 text-slate-600 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                                Upload a different file
                            </button>
                            {onClose && (
                                <button
                                    onClick={onClose}
                                    className="flex-1 text-xs bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                                    Review my info →
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Error state */}
                {status === 'error' && (
                    <div className="space-y-3">
                        <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <MdError className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-red-800">Upload failed</p>
                                <p className="text-xs text-red-700 mt-1">{errorMessage}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleReset}
                            className="w-full text-xs border border-slate-300 text-slate-600 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                            Try again
                        </button>
                    </div>
                )}

                {/* Uploading / Parsing state */}
                {(status === 'uploading' || status === 'parsing') && (
                    <div className="flex flex-col items-center py-6 space-y-3">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                            <MdAutoAwesome className="absolute inset-0 m-auto text-blue-600 text-lg" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-slate-700">
                                {status === 'uploading' ? 'Uploading...' : 'AI is reading your resume...'}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                {status === 'parsing' ? 'This may take up to 30 seconds' : ''}
                            </p>
                        </div>
                    </div>
                )}

                {/* Idle / file selected state */}
                {(status === 'idle') && (
                    <div className="space-y-3">
                        {/* Drop zone */}
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all duration-200 ${
                                dragOver
                                    ? 'border-blue-400 bg-blue-50'
                                    : file
                                    ? 'border-green-400 bg-green-50'
                                    : 'border-slate-300 bg-slate-50 hover:border-blue-300 hover:bg-blue-50'
                            }`}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,application/pdf"
                                className="hidden"
                                onChange={handleFileInputChange}
                            />

                            {file ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <span className="text-2xl">📄</span>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-green-700 truncate max-w-48">{file.name}</p>
                                        <p className="text-xs text-green-600">{(file.size / 1024).toFixed(0)} KB · PDF ready</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <MdUpload className="text-slate-400 text-3xl mx-auto" />
                                    <p className="text-sm font-medium text-slate-600">
                                        Drop your resume here or <span className="text-blue-600 underline">browse</span>
                                    </p>
                                    <p className="text-xs text-slate-400">PDF only · Max 10MB</p>
                                </div>
                            )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex space-x-2">
                            {file && (
                                <button
                                    onClick={handleReset}
                                    className="text-xs border border-slate-300 text-slate-500 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                                    Clear
                                </button>
                            )}
                            <button
                                onClick={handleUploadAndParse}
                                disabled={!file}
                                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
                                    file
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-sm hover:shadow-md'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}>
                                <MdAutoAwesome className="text-base" />
                                <span>Import with AI</span>
                            </button>
                        </div>

                        <p className="text-xs text-slate-400 text-center">
                            Your file is processed securely and saved to your profile.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeUploader;
