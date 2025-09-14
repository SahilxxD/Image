import React from 'react';
import { Upload, X, Sparkles } from 'lucide-react';
import { placeholderImages } from '../data/mockData';

function UploadScreen({
    uploadedImage,
    setUploadedImage,
    selectedType,
    setSelectedType,
    showSlideshow,
    setShowSlideshow,
    isUploading,
    setIsUploading,
    fileInputRef,
    styleSelectionRef,
    containerRef,
    handleFileUpload,
    handleStyleSelection,
    handleGenerate,
    isGenerating,
    showCustomizeModal,
    setShowCustomizeModal,
    customizeOptions,
    setCustomizeOptions,
    handleCustomizeGenerate
}) {
    return (
        <div
            className={`flex flex-col justify-center items-center transition-all px-2 duration-700 ease-out max-w-full
      ${uploadedImage ? 'fixed top-20' : 'fixed top-1/2 -translate-y-1/2'}
    `}
        >
            {/* Upload Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-center">
                    <h1 className="text-lg font-semibold text-gray-900 mb-2">
                        Create stunning product images
                    </h1>
                    <p className="text-sm text-gray-600 mb-6">
                        Upload product image — PNG or JPG. We auto-detect category and suggest templates.
                    </p>

                    {uploadedImage ? (
                        <div className="space-y-4">
                            <div className="relative">
                                <img
                                    src={uploadedImage.url}
                                    alt="Uploaded product"
                                    className="w-32 h-32 object-cover rounded-xl mx-auto border border-gray-200"
                                />
                                <button
                                    onClick={() => setUploadedImage(null)}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center"
                                >
                                    <X size={12} />
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-2">
                                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                    Detected: {uploadedImage.category}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-purple-400 transition-colors"
                        >
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Upload size={20} className="text-purple-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-900 mb-1">Upload product image</p>
                            <p className="text-xs text-gray-500">Tap to browse files</p>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Animated Slideshow */}
            {showSlideshow && (
                <div
                    className={`mx-2 mt-6 relative overflow-hidden rounded-xl shadow-sm w-full h-40 transition-opacity duration-400 ${showSlideshow ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <div className="flex animate-scroll whitespace-nowrap">
                        {[...placeholderImages, ...placeholderImages].map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`Placeholder ${idx}`}
                                className="w-64 h-40 object-cover rounded-xl mr-3 flex-shrink-0"
                            />
                        ))}
                    </div>

                    {/* Scroll animation using Tailwind keyframes */}
                    <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 15s linear infinite;
        }
      `}</style>
                </div>
            )}

            <div ref={containerRef} className={`mt-2 w-full h-0 ${isUploading ? 'opacity-100 translate-y-0 h-full' : 'opacity-0 -translate-y-3 pointer-events-none'} transition-all duration-600`}>
                {/* Type Selection */}
                <div ref={styleSelectionRef} className="space-y-3">
                    <h2 className="font-medium text-gray-900">Choose style</h2>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleStyleSelection}
                            className={`p-4 rounded-xl border-2 transition-all ${selectedType === 'model'
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                        >
                            <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                                <img
                                    src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=200"
                                    alt="Model showcase"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                            <h3 className="font-medium text-sm text-gray-900 mb-1">Model Showcase</h3>
                            <p className="text-xs text-purple-600 mt-1">Default: Studio</p>
                        </button>

                        <button
                            onClick={() => setSelectedType('creative')}
                            className={`p-4 rounded-xl border-2 transition-all ${selectedType === 'creative'
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                        >
                            <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                                <img
                                    src="https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=200"
                                    alt="Creative"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                            <h3 className="font-medium text-sm text-gray-900 mb-1">Flat-lay</h3>
                            <p className="text-xs text-purple-600 mt-1">Default: instagram</p>
                        </button>
                    </div>
                </div>

                {selectedType && (
                    <div className="space-y-3">
                        <div className="bg-gray-50 rounded-xl p-4">
                        </div>

                        {/* Action Buttons */}
                        <div className="sticky bottom-4 bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCustomizeModal(true)}
                                    className="flex-1 border border-purple-200 text-purple-700 py-4 rounded-xl font-medium hover:bg-purple-50 transition-colors"
                                >
                                    Customize
                                </button>
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                                >
                                    {isGenerating ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Generating...
                                        </div>
                                    ) : (
                                        'Generate'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UploadScreen;
