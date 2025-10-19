import React, { useState, useEffect } from 'react';
import { User, ImagePlus, History, LayoutDashboard, Upload, X, ArrowLeft, Check, Loader2, Download } from 'lucide-react';
import HistoryScreen from './HistoryScreen';
import ClientDashboard from './ClientDashboard';

// Sample data - replace with actual API calls
// const sampleClients = [
//     {
//         _id: "1",
//         name: "Acme Corporation",
//         location: "Mumbai, Maharashtra",
//         imageGenerated: 145,
//         price: 50000,
//         totalCredits: 11300
//     },
//     {
//         _id: "2",
//         name: "Tech Solutions Ltd",
//         location: "Bangalore, Karnataka",
//         imageGenerated: 89,
//         price: 32000,
//         totalCredits: 8900
//     },
//     {
//         _id: "3",
//         name: "Creative Studios",
//         location: "Delhi, NCR",
//         imageGenerated: 203,
//         price: 75000,
//         totalCredits: 19500
//     },
//     {
//         _id: "4",
//         name: "Fashion Hub",
//         location: "Pune, Maharashtra",
//         imageGenerated: 67,
//         price: 28000,
//         totalCredits: 7200
//     }
// ];

const sampleHistory = [
    {
        id: "h1",
        date: "2025-10-18",
        images: 5,
        status: "completed",
        thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop"
    },
    {
        id: "h2",
        date: "2025-10-15",
        images: 8,
        status: "completed",
        thumbnail: "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=200&h=200&fit=crop"
    },
    {
        id: "h3",
        date: "2025-10-10",
        images: 3,
        status: "completed",
        thumbnail: "https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=200&h=200&fit=crop"
    }
];

const ClientsScreen = ({ openFullscreen, toggleFavorite, setHistoryImages }) => {
    const [currentPage, setCurrentPage] = useState('clients'); // clients, actions, generate, history, dashboard, results
    const [selectedClient, setSelectedClient] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResults, setGeneratedResults] = useState([]);
    const [sampleClients, setSampleClients] = useState([]);

    const fetchClients = async (signal) => {


        try {
            const res = await fetch("https://image-backend-delta.vercel.app/api/clients/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // If your API requires auth, add it here:
                    "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Y2U2NDk4MWQ1NDM4YWQ1Y2VmOTNlYSIsImlhdCI6MTc2MDg1OTUzMywiZXhwIjoxNzYwOTAyNzMzfQ.GPFVuI197ur5aU7Tc6zCG52UQEoHf47ZwFBXipwk1Y0`
                },
                signal,
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status} ${res.statusText}`);
            }

            const json = await res.json();
            // adapt depending on your API shape - if you return { success, data }:
            const data = json.data ?? json; // fallback to raw response if not wrapped
            console.log("Fetched clients data:", data);
            setSampleClients(Array.isArray(data) ? data : []);

        } catch (err) {
            if (err.name === "AbortError") {
                // request was cancelled — ignore
                console.log("fetchHistory aborted");
            } else {
                console.error("fetchHistory error:", err);
                // optional: set an error state to show to the user
                // setError?.(err.message || "Failed to fetch history");
            }
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        fetchClients(controller.signal);

        return () => {
            controller.abort();
        };
    }, []);

    // Client List Page
    const ClientList = () => (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sampleClients.map(client => {
                        const profit = (client.imageGenerated * client.price) - client.totalCredits;
                        const isProfitable = profit > 0;

                        return (
                            <div
                                key={client._id}
                                onClick={() => {
                                    setSelectedClient(client);
                                    setCurrentPage('actions');
                                }}
                                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-indigo-500 transform hover:-translate-y-1"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="bg-indigo-100 p-3 rounded-full">
                                            <User className="w-8 h-8 text-indigo-600" />
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isProfitable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {isProfitable ? 'Profitable' : 'Loss'}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{client.name}</h3>
                                    <p className="text-sm text-gray-600 mb-4">{client.location}</p>

                                    <div className="space-y-2 pt-4 border-t border-gray-100">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Images Generated</span>
                                            <span className="font-semibold text-gray-900">{client.imageGenerated}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Revenue</span>
                                            <span className="font-semibold text-green-600">₹{client.imageGenerated * client.price}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Net {isProfitable ? 'Profit' : 'Loss'}</span>
                                            <span className={`font-semibold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                                                ₹{Math.abs(profit).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    // Actions Menu Page
    const ActionsMenu = () => (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => setCurrentPage('clients')}
                    className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Clients
                </button>



                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <div className="flex items-center mb-2">
                        <div className="bg-indigo-100 p-3 rounded-full mr-4">
                            <User className="w-8 h-8 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{selectedClient?.name}</h1>
                            <p className="text-gray-600">{selectedClient?.location}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                        onClick={() => setCurrentPage('dashboard')}
                        className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500 transform hover:-translate-y-2 p-8"
                    >
                        <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <LayoutDashboard className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Dashboard</h3>
                        <p className="text-gray-600 text-sm">View detailed analytics and statistics</p>
                    </div>

                    <div
                        onClick={() => setCurrentPage('generate')}
                        className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-500 transform hover:-translate-y-2 p-8"
                    >
                        <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <ImagePlus className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Generate Images</h3>
                        <p className="text-gray-600 text-sm">Upload and generate new images for this client</p>
                    </div>

                    <div
                        onClick={() => setCurrentPage('history')}
                        className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-purple-500 transform hover:-translate-y-2 p-8"
                    >
                        <div className="bg-purple-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <History className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">History</h3>
                        <p className="text-gray-600 text-sm">View all previously generated images</p>
                    </div>


                </div>
            </div>
        </div>
    );

    // Generate Images Page
    const GenerateImages = () => {
        const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });
        const [generationError, setGenerationError] = useState(null);

        const handleFileUpload = (e) => {
            const files = Array.from(e.target.files);
            const newFiles = files.slice(0, 10 - uploadedFiles.length);

            const fileObjects = newFiles.map((file, idx) => ({
                id: Date.now() + idx,
                file,
                preview: URL.createObjectURL(file),
                name: file.name
            }));

            setUploadedFiles([...uploadedFiles, ...fileObjects]);
        };

        const removeFile = (id) => {
            setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
        };

        const handleGenerate = async () => {
            setIsGenerating(true);
            setGenerationError(null);
            setGenerationProgress({ current: 0, total: uploadedFiles.length });

            try {
                const formData = new FormData();

                // Append all files to the same FormData
                uploadedFiles.forEach((fileObj) => {
                    formData.append('file', fileObj.file);
                });

                formData.append('clientId', selectedClient._id);

                const response = await fetch('https://image-backend-delta.vercel.app/api/generateImageNew', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success && data.data && data.data.length > 0) {
                    // Map the results back to our uploaded files
                    const results = data.data.map((generatedData, index) => ({
                        id: uploadedFiles[index]?.id || Date.now() + index,
                        original: uploadedFiles[index]?.preview,
                        generated: generatedData.arkUrl || generatedData.link,
                        prompt: generatedData.prompt,
                        status: 'completed'
                    }));

                    setGeneratedResults(results);
                    setIsGenerating(false);

                    if (data.failed > 0) {
                        setGenerationError(`${data.generated} images generated successfully, ${data.failed} failed`);
                    }

                    setCurrentPage('results');
                } else {
                    setGenerationError(data.message || 'Generation failed');
                    setIsGenerating(false);
                }
            } catch (error) {
                console.error('Error generating images:', error);
                setGenerationError(error.message || 'Network error occurred');
                setIsGenerating(false);
            }
        };

        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                <div className="max-w-5xl mx-auto">
                    <button
                        onClick={() => {
                            setCurrentPage('actions');
                            setUploadedFiles([]);
                        }}
                        className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Actions
                    </button>

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Images</h1>
                        <p className="text-gray-600 mb-6">Upload up to 10 images for {selectedClient?.name}</p>

                        {/* Upload Area */}
                        <div className="border-2 border-dashed border-indigo-300 rounded-xl p-12 text-center mb-6 bg-indigo-50 hover:bg-indigo-100 transition-colors">
                            <input
                                type="file"
                                id="file-upload"
                                multiple
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                disabled={uploadedFiles.length >= 10}
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <Upload className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                                <p className="text-xl font-semibold text-gray-900 mb-2">
                                    {uploadedFiles.length >= 10 ? 'Maximum files reached' : 'Click to upload images'}
                                </p>
                                <p className="text-gray-600">
                                    {uploadedFiles.length} of 10 images uploaded
                                </p>
                            </label>
                        </div>

                        {/* Uploaded Files Grid */}
                        {uploadedFiles.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Images</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {uploadedFiles.map(file => (
                                        <div key={file.id} className="relative group">
                                            <img
                                                src={file.preview}
                                                alt={file.name}
                                                className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                            />
                                            <button
                                                onClick={() => removeFile(file.id)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Generate Button */}
                        {generationError && (
                            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-800 text-sm">{generationError}</p>
                            </div>
                        )}

                        <button
                            onClick={handleGenerate}
                            disabled={uploadedFiles.length === 0 || isGenerating}
                            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isGenerating ? (
                                <div className="flex items-center">
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    <span>Generating {uploadedFiles.length} images...</span>
                                </div>
                            ) : (
                                <>
                                    <ImagePlus className="w-5 h-5 mr-2" />
                                    Generate {uploadedFiles.length} Image{uploadedFiles.length !== 1 ? 's' : ''}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        );
    };



    // Results Page
    const ResultsPage = () => {
        const [lightboxImage, setLightboxImage] = useState(null);
        const [copiedId, setCopiedId] = useState(null);
        const [expandedPrompts, setExpandedPrompts] = useState({});
        const [downloadingId, setDownloadingId] = useState(null);

        const copyPrompt = (prompt, id) => {
            navigator.clipboard.writeText(prompt);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        };

        const togglePrompt = (id) => {
            setExpandedPrompts(prev => ({
                ...prev,
                [id]: !prev[id]
            }));
        };

        const downloadImage = async (imageUrl, id) => {
            try {
                setDownloadingId(id);

                // Try direct download first (works for same-origin or CORS-enabled images)
                try {
                    const response = await fetch(imageUrl);
                    const blob = await response.blob();

                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `generated-image-${id}-${Date.now()}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                } catch (fetchError) {
                    // If fetch fails due to CORS, use direct link download
                    console.log('CORS issue detected, using direct download method');
                    const link = document.createElement('a');
                    link.href = imageUrl;
                    link.download = `generated-image-${id}-${Date.now()}.jpg`;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }

                setDownloadingId(null);
            } catch (error) {
                console.error('Error downloading image:', error);
                setDownloadingId(null);
                alert('Failed to download image. The image will open in a new tab instead.');
                window.open(imageUrl, '_blank');
            }
        };


        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
                <div className="max-w-6xl mx-auto">
                    <button
                        onClick={() => {
                            setCurrentPage('actions');
                            setUploadedFiles([]);
                            setGeneratedResults([]);
                        }}
                        className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Actions
                    </button>

                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Generation Complete!</h1>
                                <p className="text-gray-600">{generatedResults.length} images successfully generated for {selectedClient?.name}</p>
                            </div>
                            <div className="bg-green-100 p-4 rounded-full">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {generatedResults.map(result => (
                            <div key={result.id} className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Comparison</h3>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Original</p>
                                        <img
                                            src={result.original}
                                            alt="Original"
                                            onClick={() => setLightboxImage({ src: result.original, type: 'Original' })}
                                            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Generated</p>
                                        {result.status === 'failed' ? (
                                            <div className="w-full h-48 flex items-center justify-center bg-red-50 rounded-lg border-2 border-red-200">
                                                <div className="text-center p-4">
                                                    <X className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                                    <p className="text-sm text-red-600 font-medium">Generation Failed</p>
                                                    <p className="text-xs text-red-500 mt-1">{result.error}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <img
                                                    src={result.generated}
                                                    alt="Generated"
                                                    onClick={() => setLightboxImage({ src: result.generated, type: 'Generated' })}
                                                    className="w-full h-48 object-cover rounded-lg border-2 border-green-200 cursor-pointer hover:opacity-90 transition-opacity"
                                                />
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        downloadImage(result.generated, result.id);
                                                    }}
                                                    disabled={downloadingId === result.id}
                                                    className="absolute bottom-2 right-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg shadow-lg transition-colors disabled:bg-gray-400"
                                                    title="Download image"
                                                >
                                                    {downloadingId === result.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Download className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Prompt Section */}
                                {result.status !== 'failed' && result.prompt && (
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-semibold text-gray-700">Prompt Used</h4>
                                            <button
                                                onClick={() => copyPrompt(result.prompt, result.id)}
                                                className="flex items-center gap-1 px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-md text-xs font-medium transition-colors"
                                            >
                                                {copiedId === result.id ? (
                                                    <>
                                                        <Check className="w-3 h-3" />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                        Copy
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <p className={`text-sm text-gray-600 leading-relaxed ${expandedPrompts[result.id] ? '' : 'line-clamp-3'}`}>
                                            {result.prompt}
                                        </p>
                                        {result.prompt && result.prompt.length > 150 && (
                                            <button
                                                onClick={() => togglePrompt(result.id)}
                                                className="text-indigo-600 hover:text-indigo-800 text-xs font-medium mt-2"
                                            >
                                                {expandedPrompts[result.id] ? 'Show less' : 'Show more'}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Lightbox Modal */}
                    {lightboxImage && (
                        <div
                            onClick={() => setLightboxImage(null)}
                            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                        >
                            <button
                                onClick={() => setLightboxImage(null)}
                                className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="max-w-5xl max-h-[90vh] flex flex-col items-center">
                                <div className="bg-white px-4 py-2 rounded-t-lg">
                                    <p className="text-sm font-semibold text-gray-900">{lightboxImage.type} Image</p>
                                </div>
                                <img
                                    src={lightboxImage.src}
                                    alt={lightboxImage.type}
                                    className="max-w-full max-h-[80vh] object-contain rounded-b-lg"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };






    // Router
    const renderPage = () => {
        switch (currentPage) {
            case 'clients':
                return <ClientList />;
            case 'actions':
                return <ActionsMenu />;
            case 'generate':
                return <GenerateImages />;
            case 'results':
                return <ResultsPage />;
            case 'history':
                return <HistoryScreen
                    openFullscreen={openFullscreen}
                    toggleFavorite={toggleFavorite}
                    setHistoryImages={setHistoryImages} // Add this prop
                    clientId={selectedClient?._id}
                />;
            case 'dashboard':
                return <ClientDashboard
                    client={selectedClient}
                    setCurrentPage={setCurrentPage}
                />;
            default:
                return <ClientList />;
        }
    };

    return renderPage();
};

export default ClientsScreen;