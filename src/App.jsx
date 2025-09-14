import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, Grid, Settings, Download, Share, RotateCcw, X, Check, ChevronRight, ArrowLeft, Heart, Info, Zap, Palette } from 'lucide-react';
import CustomizeModal from './components/CustomizeModal';
import FullscreenView from './components/FullscreenView';
import GalleryScreen from './components/GalleryScreen';
import Header from './components/Header';
import LoadingOverlay from './components/LoadingOverlay';
import SettingsScreen from './components/SettingsScreen';
import DetectionBadge from './components/DetectionBadge';

// Design tokens
const tokens = {
  colors: {
    primary: {
      500: '#7C3AED',
      600: '#6D28D9',
    },
    accent: {
      500: '#EC4899',
    },
    bg: '#F8FAFC',
    card: '#FFFFFF',
    muted: '#6B7280',
    success: '#10B981',
    neutral: {
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    }
  },
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    6: '24px',
    8: '32px',
  },
  radius: {
    base: '12px',
    modal: '16px',
  }
};

function App() {
  const [currentScreen, setCurrentScreen] = useState('upload');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [customizeOptions, setCustomizeOptions] = useState({
    poses: ['front', 'three-quarter', 'walking'],
    environment: 'studio',
    outputs: ['catalog'],
    batchSize: 4
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isDetected, setIsDetected] = useState(false);

  const fileInputRef = useRef(null);
  const styleSelectionRef = useRef(null);
  // near your other refs and useState
  const actionsRef = useRef(null);
  const containerRef = useRef(null);

  // Mock data for demonstration
  const mockGeneratedImages = [
    { id: '1', url: 'https://ik.imagekit.io/efhehcx94/1000039585.png?updatedAt=1757786299011&tr=w-1080%2Ch-1080%2Cfo-auto', pose: 'front', environment: 'studio', outputType: 'catalog', isHighRes: true, isFavorited: false },
    { id: '2', url: 'https://ik.imagekit.io/efhehcx94/1000039500.png?updatedAt=1757786299006&tr=w-1080%2Ch-1080%2Cfo-auto', pose: 'three-quarter', environment: 'studio', outputType: 'catalog', isHighRes: true, isFavorited: false },
    { id: '3', url: 'https://ik.imagekit.io/efhehcx94/1000039767.png?updatedAt=1757786298897&tr=w-1080%2Ch-1080%2Cfo-auto', pose: 'walking', environment: 'outdoor', outputType: 'instagram', isHighRes: true, isFavorited: false },
    { id: '4', url: 'https://ik.imagekit.io/efhehcx94/1000039641.png?updatedAt=1757786298791&tr=w-1080%2Ch-1080%2Cfo-auto', pose: 'closeup', environment: 'studio', outputType: 'catalog', isHighRes: true, isFavorited: false },
  ];
  const placeholderImages = [
    'https://ik.imagekit.io/efhehcx94/1000039500.png?updatedAt=1757786299006&tr=w-1080%2Ch-1080%2Cfo-auto',
    'https://ik.imagekit.io/efhehcx94/1000039767.png?updatedAt=1757786298897',
    'https://ik.imagekit.io/efhehcx94/1000039641.png?updatedAt=1757786298791&tr=w-1080%2Ch-1080%2Cfo-auto',
    'https://ik.imagekit.io/efhehcx94/1000039621.png?updatedAt=1757786296927&tr=w-1080%2Ch-1080%2Cfo-auto',
    'https://ik.imagekit.io/efhehcx94/1000039585.png?updatedAt=1757786299011',
  ];



  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      // Mock category detection
      const categories = ['Dress', 'Shirt', 'Shoes', 'Accessories'];
      const category = categories[Math.floor(Math.random() * categories.length)];
      setShowSlideshow(true);
      setUploadedImage({ url, category });
      setIsUploading(true);
      setIsDetected(false);

      // Auto-scroll to style selection after upload
      setTimeout(() => {
        styleSelectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        setShowSlideshow(false);
        setIsUploading(false);
        setIsDetected(true);

      }, 5000);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCurrentScreen('gallery');

    // Simulate generation process
    setTimeout(() => {
      setGeneratedImages(mockGeneratedImages);
      setIsGenerating(false);
    }, 10000);
  };

  const handleCustomizeGenerate = () => {
    setShowCustomizeModal(false);
    handleGenerate();
  };

  const handleStyleSelection = () => {
    setSelectedType('model');

    setTimeout(() => {
      window.scrollBy({
        top: -100, // adjust how much you want to scroll
        behavior: 'smooth',
      });
    }, 50); // small delay to allow DOM to render
  };




  const openFullscreen = (imageId) => {
    setSelectedImageId(imageId);
    setCurrentScreen('gallery');
  };

  const toggleFavorite = (imageId) => {
    setGeneratedImages(prev =>
      prev.map(img =>
        img.id === imageId ? { ...img, isFavorited: !img.isFavorited } : img
      )
    );
  };

  const selectedImage = generatedImages.find(img => img.id === selectedImageId);

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <Header currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />


      <main className="max-w-lg mx-auto bg-gray-50">
        {/* Upload Screen */}
        {currentScreen === 'upload' && (
          <div
            className={`flex flex-col justify-center items-center transition-all px-2 duration-900 ease-out max-w-full
          ${uploadedImage ? 'fixed top-20' : 'fixed top-1/2 -translate-y-1/2'}
        `}
          >

            {/* </div>
          <div
            className={`min-h-[calc(100vh-64px)] flex flex-col justify-center ${uploadedImage ? 'justify-center w-full max-w-lg' : 'items-center'
              } p-4 space-y-6 transition-all`}
          > */}
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
                      {/* Use the DetectionBadge while detecting, otherwise show final category */}
                      <DetectionBadge isDetecting={isUploading} uploadedImage={uploadedImage} />
                    </div>
                  </div>
                ) : (
                  <>

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
                  </>
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

            <div className={`mx-2 mt-6 relative h-0 space-y-4 ${showSlideshow ? 'opacity-100' : 'opacity-0'}`}>
              {/* Left to Right Slider */}
              <div
                className={`relative overflow-hidden rounded-xl shadow-sm w-full h-0 transition-opacity duration-400 ${showSlideshow ? 'opacity-100 h-40' : 'opacity-0'
                  }`}
              >
                <div className="flex animate-scroll-ltr whitespace-nowrap">
                  {[...placeholderImages, ...placeholderImages].map((img, idx) => (
                    <img
                      key={`ltr-${idx}`}
                      src={img}
                      alt={`Placeholder ${idx}`}
                      className="w-64 h-40 object-cover rounded-xl mr-3 flex-shrink-0"
                    />
                  ))}
                </div>
              </div>

              {/* Right to Left Slider */}
              <div
                className={`relative overflow-hidden rounded-xl shadow-sm w-full h-0 transition-opacity duration-400 ${showSlideshow ? 'opacity-100 h-40' : 'opacity-0'
                  }`}
              >
                <div className="flex animate-scroll-rtl whitespace-nowrap">
                  {[...placeholderImages, ...placeholderImages].map((img, idx) => (
                    <img
                      key={`rtl-${idx}`}
                      src={img}
                      alt={`Placeholder ${idx}`}
                      className="w-64 h-40 object-cover rounded-xl mr-3 flex-shrink-0"
                    />
                  ))}
                </div>
              </div>

              {/* Scroll Animations */}
              <style>{`
      /* Left → Right */
      @keyframes scroll-ltr {
        0% { transform: translateX(0); }
        100% { transform: translateX(50%); }
      }

      /* Right → Left but starting from left corner */
      @keyframes scroll-rtl {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }

      .animate-scroll-ltr {
        animation: scroll-ltr 15s linear infinite;
      }
      .animate-scroll-rtl {
        animation: scroll-rtl 15s linear infinite;
      }
    `}</style>
            </div>





            <div ref={containerRef} className={`mt-2 w-full h-0 ${isDetected ? 'opacity-100 translate-y-0 h-full' : 'opacity-0 -translate-y-3 pointer-events-none'} transition-all duration-600`}>
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
                        src="https://ik.imagekit.io/efhehcx94/1000039500.png?updatedAt=1757786299006&tr=w-1080%2Ch-1080%2Cfo-auto"
                        alt="Model showcase"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="font-medium text-sm text-gray-900 mb-1">Model Showcase</h3>
                    <p className="text-xs text-purple-600 mt-1">Studio</p>
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
                        src="https://ik.imagekit.io/efhehcx94/Generated%20Image%20September%2013,%202025%20-%2012_32PM.png?updatedAt=1757787811859&tr=w-1080%2Ch-1080%2Cfo-auto"
                        alt="Creative"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="font-medium text-sm text-gray-900 mb-1">Flat-lay</h3>
                    <p className="text-xs text-purple-600 mt-1">Creative</p>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Fixed Action Buttons - Only show when selectedType is set and on upload screen */}
        {currentScreen === 'upload' && selectedType && (
          <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t border-gray-100 z-50">
            <div className="max-w-lg mx-auto flex gap-3">
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
        )}


        {/* Gallery Screen */}
        {currentScreen === 'gallery' && (
          <GalleryScreen generatedImages={generatedImages} setShowCustomizeModal={setShowCustomizeModal} openFullscreen={openFullscreen} toggleFavorite={toggleFavorite} isGenerating={isGenerating} batchSize={customizeOptions.batchSize} />
        )}

        {/* Fullscreen View */}
        {currentScreen === 'gallery' && selectedImage && (
          <FullscreenView
            selectedImage={selectedImage}
            setSelectedImageId={setSelectedImageId}
            isGenerating={isGenerating}
            toggleFavorite={toggleFavorite}
          />
        )}



        {/* Settings Screen */}
        {currentScreen === 'settings' && (
          <SettingsScreen />
        )}
      </main>

      {/* Customize Modal */}
      {showCustomizeModal && (
        <CustomizeModal
          showCustomizeModal={showCustomizeModal}
          customizeOptions={customizeOptions}
          setShowCustomizeModal={setShowCustomizeModal}
          handleCustomizeGenerate={handleCustomizeGenerate}
        />

      )}





      {/* Loading Overlay */}
      {/* {isGenerating && (
        <LoadingOverlay isGenerating={isGenerating} customizeOptions={customizeOptions} />
      )} */}
    </div>
  );
}


export default App;