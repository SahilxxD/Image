import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, X, Download, Share, Maximize2, Pencil } from 'lucide-react';

function FullscreenView({
    selectedImage,
    setSelectedImageId,
    isGenerating,
    handleGeneratePoses,
    handleRefine,
}) {
    if (!selectedImage) return null;

    const [overlayOpen, setOverlayOpen] = useState(false);
    const closeBtnRef = useRef(null);

    useEffect(() => {
        // restore scroll when component unmounts or overlay closes
        return () => { document.body.style.overflow = ''; };
    }, []);

    useEffect(() => {
        if (overlayOpen) {
            // disable body scroll when overlay is open
            document.body.style.overflow = 'hidden';
            // focus the close button for keyboard users
            setTimeout(() => closeBtnRef.current?.focus(), 60);
        } else {
            document.body.style.overflow = '';
        }
    }, [overlayOpen]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape' && overlayOpen) {
                setOverlayOpen(false);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [overlayOpen]);

    const handleFullView = (e) => {
        e?.preventDefault();
        setOverlayOpen(true);
    };

    const handleRefineClick = () => {
        if (typeof handleRefine === 'function') {
            handleRefine(selectedImage);
            return;
        }
        if (typeof handleGeneratePoses === 'function') {
            // handleGeneratePoses(selectedImage);
            return;
        }
        alert('Refine will be available soon.');
    };

    const handleShareClick = async () => {
        const url = selectedImage.url;
        if (!url) return;
        if (navigator.share) {
            try { await navigator.share({ title: 'Image', url }); } catch { }
            return;
        }
        if (navigator.clipboard?.writeText) {
            try { await navigator.clipboard.writeText(url); alert('Image URL copied'); } catch { prompt('Copy URL', url); }
            return;
        }
        prompt('Copy this image URL:', url);
    };

    const handleDownloadClick = async () => {
        const url = selectedImage?.url;
        if (!url) return;

        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = objectUrl;
            a.download = selectedImage.filename || 'image.jpg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // cleanup
            URL.revokeObjectURL(objectUrl);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };

    return (
        <>
            {/* Main compact viewer (your existing UI) */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
                <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-scroll no-scrollbar">
                    <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>

                    <div className="p-4 border-b border-gray-100 flex items-center sticky top-0 bg-white z-10">
                        <h2 className="text-base font-semibold text-gray-900">Image View</h2>

                        <div className="flex items-center gap-2 ml-auto">
                            <button
                                onClick={() => handleGeneratePoses(selectedImage)}
                                disabled={isGenerating}
                                title="Generate 4 pose variations from this image"
                                aria-label="Generate 4 poses"
                                aria-busy={isGenerating}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium shadow-sm transition-all h-9
                  ${isGenerating ? 'bg-purple-400/80 text-white cursor-wait' : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:brightness-105'} ${selectedImage?.type !== 'on-model' ? 'hidden' : ''}`}
                            >
                                {isGenerating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Sparkles size={16} className="text-white" />}
                                <span>Generate Poses</span>
                            </button>

                            <button
                                onClick={() => setSelectedImageId(null)}
                                className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-gray-100 transition"
                                aria-label="Close"
                            >
                                <X size={18} className="text-gray-600" />
                            </button>
                        </div>
                    </div>

                    <div className="p-4">
                        <img
                            src={selectedImage.url}
                            alt={`${selectedImage.pose ?? 'image'} pose`}
                            className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                        />

                        <div className="flex items-center justify-center gap-6 mt-6 pb-4">
                            <button
                                onClick={handleFullView}
                                className="flex flex-col items-center gap-1 text-gray-700"
                                aria-label="Full view"
                                title="Open full view"
                            >
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Maximize2 size={20} />
                                </div>
                                <span className="text-xs">Full view</span>
                            </button>

                            <button
                                onClick={handleRefineClick}
                                className="flex flex-col items-center gap-1 text-gray-700"
                                aria-label="Refine image"
                                title="Refine / edit this image"
                            >
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Pencil size={20} />
                                </div>
                                <span className="text-xs">Refine</span>
                            </button>

                            <button
                                onClick={handleShareClick}
                                className="flex flex-col items-center gap-1 text-gray-700"
                                aria-label="Share image"
                                title="Share image"
                            >
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Share size={20} />
                                </div>
                                <span className="text-xs">Share</span>
                            </button>

                            <button
                                onClick={handleDownloadClick}
                                className="flex flex-col items-center gap-1 text-gray-700"
                                aria-label="Download image"
                                title="Download image"
                            >
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Download size={20} />
                                </div>
                                <span className="text-xs">Download</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Minimal full-screen overlay with blurred black background */}
            {overlayOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setOverlayOpen(false)} // close when clicking backdrop
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm transition-opacity"
                >
                    {/* Top-right X (stop propagation so clicks don't close from the button) */}
                    <button
                        ref={closeBtnRef}
                        onClick={(e) => { e.stopPropagation(); setOverlayOpen(false); }}
                        aria-label="Close full view"
                        className="absolute top-6 right-6 z-70 p-2 rounded-full bg-white/10 hover:bg-white/20 focus:outline-none"
                    >
                        <X size={22} className="text-white" />
                    </button>

                    {/* Image container — clicking the image should not close overlay */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
                    >
                        <img
                            src={selectedImage.url}
                            alt={selectedImage.filename || 'Full view image'}
                            className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
                            draggable={false}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default FullscreenView;
