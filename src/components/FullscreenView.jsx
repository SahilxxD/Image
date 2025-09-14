import React from 'react';
import { Sparkles, X, Download, Share, RotateCcw, Heart } from 'lucide-react';

function FullscreenView({ selectedImage, setSelectedImageId, isGenerating, toggleFavorite, handleGenerate }) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
            <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-scroll no-scrollbar">
                {/* hide scrollbar styles */}
                <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center sticky top-0 bg-white z-10">
                    {/* Title */}
                    <h2 className="text-base font-semibold text-gray-900">Image View</h2>

                    {/* Actions aligned right */}
                    <div className="flex items-center gap-2 ml-auto">
                        {/* Generate Poses */}
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            title="Generate 4 pose variations from this image"
                            aria-label="Generate 4 poses"
                            aria-busy={isGenerating}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium shadow-sm transition-all h-9
    ${isGenerating
                                    ? 'bg-purple-400/80 text-white cursor-wait'
                                    : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:brightness-105'}`}
                        >
                            {isGenerating ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Sparkles size={16} className="text-white" />
                            )}
                            <span>Generate Poses</span>
                        </button>

                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedImageId(null)}
                            className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-gray-100 transition"
                        >
                            <X size={18} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <img
                        src={selectedImage.url}
                        alt={`${selectedImage.pose} pose`}
                        className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                    />

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-center gap-6 mt-6 pb-4">
                        <button className="flex flex-col items-center gap-1 text-gray-700">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <Download size={20} />
                            </div>
                            <span className="text-xs">Download</span>
                        </button>

                        <button className="flex flex-col items-center gap-1 text-gray-700">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <Share size={20} />
                            </div>
                            <span className="text-xs">Share</span>
                        </button>

                        <button className="flex flex-col items-center gap-1 text-gray-700">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <RotateCcw size={20} />
                            </div>
                            <span className="text-xs">Regenerate</span>
                        </button>

                        <button
                            onClick={() => toggleFavorite(selectedImage.id)}
                            className="flex flex-col items-center gap-1 text-gray-700"
                        >
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedImage.isFavorited ? 'bg-red-500 text-white' : 'bg-gray-100'
                                    }`}
                            >
                                <Heart
                                    size={20}
                                    fill={selectedImage.isFavorited ? 'currentColor' : 'none'}
                                />
                            </div>
                            <span className="text-xs">Favorite</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FullscreenView;
