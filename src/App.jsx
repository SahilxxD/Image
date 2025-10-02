import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, Grid, Settings, Download, Share, RotateCcw, X, Check, ChevronRight, ArrowLeft, Heart, Info, Zap, Palette } from 'lucide-react';
import CustomizeModal from './components/CustomizeModal';
import FullscreenView from './components/FullscreenView';
import GalleryScreen from './components/GalleryScreen';
import Header from './components/Header';
import LoadingOverlay from './components/LoadingOverlay';
import SettingsScreen from './components/SettingsScreen';
import DetectionBadge from './components/DetectionBadge';
import GenerateMoreModal from './components/GenerateMoreModal';
import LoginScreen from './components/LoginScreen'; // NEW
import HistoryScreen from './components/HistoryScreen'; // Add this import


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
  const [userProfile, setUserProfile] = useState(null);
  const [historyImages, setHistoryImages] = useState([]); // Add this
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('upload');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showGenerateMoreModal, setShowGeneratMoreModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [customizeOptions, setCustomizeOptions] = useState({
    type: 'on-model',
    environment: 'studio',
    outputs: ['catalog'],
    batchSize: 2
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isDetected, setIsDetected] = useState(false);
  const [originalFile, setOriginalFile] = useState(null);

  const fileInputRef = useRef(null);
  const styleSelectionRef = useRef(null);
  const actionsRef = useRef(null);
  const containerRef = useRef(null);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("https://image-backend-delta.vercel.app/api/me", {
        method: "GET",
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.status}`);
      }

      const userData = await response.json();
      console.log("User profile data:", userData);

      // Set user profile state for Header component
      setUserProfile(userData);
      if (userData.history.length > 0) {
        setHistoryImages(userData.history);
      }

    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Handle error - maybe show a notification or use default profile
    }
  };

  // Check for token on initial load from URL or localStorage
  const handleAuthentication = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');

    if (tokenFromUrl) {
      localStorage.setItem('authToken', tokenFromUrl);
      setIsLoggedIn(true);

      // Clean the URL
      window.history.replaceState({}, document.title, "/");
      await fetchUserProfile();

    } else {
      const tokenFromStorage = localStorage.getItem('authToken');
      if (tokenFromStorage) {
        setIsLoggedIn(true);
        await fetchUserProfile();
      }
    }
  };

  useEffect(() => {
    handleAuthentication();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUserProfile(null); // Clear user profile
    setCurrentScreen('upload');
  };



  // Mock data for demonstration
  const mockGeneratedImages = [
    { id: '1', url: 'https://ik.imagekit.io/efhehcx94/1000039585.png?updatedAt=1757786299011&tr=w-1080%2Ch-1080%2Cfo-auto', pose: 'front', environment: 'studio', outputType: 'catalog', isHighRes: true, isFavorited: false },
    { id: '2', url: 'https://ik.imagekit.io/efhehcx94/1000039500.png?updatedAt=1757786299006&tr=w-1080%2Ch-1080%2Cfo-auto', pose: 'three-quarter', environment: 'studio', outputType: 'catalog', isHighRes: true, isFavorited: false },
    { id: '3', url: 'https://ik.imagekit.io/efhehcx94/1000039767.png?updatedAt=1757786298897&tr=w-1080%2Ch-1080%2Cfo-auto', pose: 'walking', environment: 'outdoor', outputType: 'instagram', isHighRes: true, isFavorited: false },
    { id: '4', url: 'https://ik.imagekit.io/efhehcx94/1000039641.png?updatedAt=1757786298791&tr=w-1080%2Ch-1080%2Cfo-auto', pose: 'closeup', environment: 'studio', outputType: 'catalog', isHighRes: true, isFavorited: false },
  ];
  const placeholderImages = [
    'https://ik.imagekit.io/efhehcx94/1000039500.png?updatedAt=1757786299006&tr=w-1080%2Ch-1080%2Cfo-auto',
    'https://ik.imagekit.io/efhehcx94/generated-1758371816787-2_rzXFc-hYiO.png?updatedAt=1758371819361&tr=w-1080%2Ch-1080%2Cfo-auto',
    'https://ik.imagekit.io/efhehcx94/generated-1758223146611-1_fvC-23o5qs.png?updatedAt=1758223150798&tr=w-1080%2Ch-1080%2Cfo-auto',
    'https://ik.imagekit.io/efhehcx94/generated-1758476830101-1_JcoXvTsHb.png?updatedAt=1758476834481&tr=w-1080%2Ch-1080%2Cfo-auto',
    'https://ik.imagekit.io/efhehcx94/generated-1757871948563-2_fMExPrI9D.png?updatedAt=1757871951449&tr=w-1080%2Ch-1080%2Cfo-auto',
    'https://ik.imagekit.io/efhehcx94/generated-1758431998778-2_88E6uh9yhb.png?updatedAt=1758432004054&tr=w-1080%2Ch-1080%2Cfo-auto',
    'https://ik.imagekit.io/efhehcx94/generated-1758219602404-2_1vidQQNmml.png?updatedAt=1758219604929&tr=w-1080%2Ch-1080%2Cfo-auto',
    'https://ik.imagekit.io/efhehcx94/generated-1758431998041-1_5DTy1bqJV.png?updatedAt=1758432001969&tr=w-1080%2Ch-1080%2Cfo-auto',
    'https://ik.imagekit.io/efhehcx94/generated-1758372085580-1_bjg7XFaWp.png?updatedAt=1758372088275&tr=w-1080%2Ch-1080%2Cfo-auto',
    'https://ik.imagekit.io/efhehcx94/generated-1758371816787-2_rzXFc-hYiO.png?updatedAt=1758371819361&tr=w-1080%2Ch-1080%2Cfo-auto',
    'https://ik.imagekit.io/efhehcx94/generated-1758367148526-1_j0DQKwTyNc.png?updatedAt=1758367150986&tr=w-1080%2Ch-1080%2Cfo-auto',
    'https://ik.imagekit.io/efhehcx94/generated-1758368571583-1_nwSOskN6SA.png?updatedAt=1758368574199&tr=w-1080%2Ch-1080%2Cfo-auto',
    'https://ik.imagekit.io/efhehcx94/generated-1758359770498-1_b-bh7i0CCm.png?updatedAt=1758359773115&tr=w-1080%2Ch-1080%2Cfo-auto',
    'https://ik.imagekit.io/efhehcx94/generated-1758219602404-2_1vidQQNmml.png?updatedAt=1758219604929&tr=w-1080%2Ch-1080%2Cfo-auto'
  ];

  useEffect(() => {
    if (uploadedImage) {
      console.log("Uploaded image state updated:", uploadedImage);
    }
  }, [uploadedImage]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };


  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Step 1: Show local preview immediately
    const url = URL.createObjectURL(file);
    setUploadedImage({ url });
    setOriginalFile(file); // Store the original file for later use
    setIsUploading(true);
    setIsDetected(false);
    setShowSlideshow(true);

    try {
      // Step 2: Prepare FormData for Multer
      const formData = new FormData();
      formData.append("file", file);

      // Step 3: Upload to backend
      const res = await fetch("https://image-backend-delta.vercel.app/api/upload", {
        method: "POST",
        headers: { ...getAuthHeaders() },
        body: formData
      });

      if (!res.ok) {
        console.error("Upload failed with status:", res.status);
        // throw new Error("Upload failed");
      }

      const response = await res.json();
      console.log("Backend response:", response);

      // Step 4: Access the nested data object
      const { data } = response; // Extract the data object
      console.log("Extracted data:", data);

      // Update uploadedImage with backend data from the nested object
      const updatedImage = {
        url,
        category: data.product,   // Now accessing from data object
        product: data.category      // Now accessing from data object
      };

      setUploadedImage(updatedImage);
      console.log("Setting uploadedImage to:", updatedImage);

      // Step 5: Auto-scroll after detection
      styleSelectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      setIsDetected(true);
    } catch (error) {
      console.error("Upload error:", error);
      setIsDetected(true);
      alert("Failed to upload file.");
    } finally {
      setIsUploading(false);
      setShowSlideshow(false);
      setSelectedType('on-model'); // Default to 'on-model' after upload
    }
  };


  const handleGeneratePoses = async (file) => {
    if (!file) {
      alert("No file available for generation. Please upload an image first.");
      return;
    }

    try {
      console.log("Inputs validated. Proceeding with generation...", customizeOptions);
      const creditsNeeded = 4; // 1 credit per image
      if (userProfile.credits < creditsNeeded) {
        alert(`Insufficient credits. You need ${creditsNeeded} credits but only have ${userProfile.credits}.`);
        return;
      }

      // Deduct credits immediately in frontend for instant UI feedback
      setUserProfile(prev => ({
        ...prev,
        credits: prev.credits - creditsNeeded
      }))

      setIsGenerating(true);
      setCurrentScreen('gallery');
      setSelectedImageId(null);

      console.log("Generating poses:");

      setShowGeneratMoreModal(false);

      // Build FormData
      const formData = new FormData();
      formData.append("url", file.url);
      formData.append("product", uploadedImage?.product || uploadedImage?.category || "product");
      formData.append("environment", file.environment); // always 4 for poses

      console.log("Sending request with FormData:", {
        file: originalFile.name,
        product: uploadedImage?.product || uploadedImage?.category,
      });

      const response = await fetch("https://image-backend-delta.vercel.app/api/generatePoses", {
        method: "POST",
        headers: { ...getAuthHeaders() },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.error("API Error Response:", response.status, response.statusText, errorText);
        throw new Error(`Generation failed: ${response.status} ${response.statusText} ${errorText ? "- " + errorText : ""}`);
      }

      const result = await response.json();
      console.log("Raw Generation API result:", result);

      // Normalize the payload: support both { success, data: {...} } and { successful, results } formats
      const payload = result?.data ?? result ?? {};
      const successfulCount = Number((payload.successful ?? payload.success) || 0);
      const failedCount = Number(payload.failed ?? payload.failedCount ?? 0);
      const results = Array.isArray(payload.results) ? payload.results : (Array.isArray(result?.results) ? result.results : []);

      console.log("Normalized payload:", { successfulCount, failedCount, results });

      if (successfulCount > 0 && results.length > 0) {
        const transformedImages = results
          .map((img, index) => {
            // img might be a string URL or an object { url, imageIndex }
            const url = typeof img === "string" ? img : (img.url || img.uploadResult || null);
            if (!url) return null;
            return {
              id: `generated-${Date.now()}-${index}`,
              url,
              type: payload.type,
              environment: payload.environment,
              pose: selectedType === 'on-model' ? 'front' : 'flat-lay',
              outputType: 'generated',
              isHighRes: true,
              isFavorited: false,
              imageIndex: img.imageIndex ?? index + 1,
            };
          })
          .filter(Boolean);

        setGeneratedImages(transformedImages);
        console.log("Successfully generated images:", transformedImages);

        if (failedCount > 0) {
          console.warn(`Generated ${successfulCount} images, but ${failedCount} failed:`, payload.errors ?? []);
          alert(`Successfully generated ${successfulCount} out of ${customizeOptions.batchSize} images.`);
        }
      } else if (payload.url || result.url) {
        // single-image shapes
        const url = payload.url ?? result.url;
        const singleImage = [{
          id: `generated-${Date.now()}`,
          url,
          type: payload.type,
          environment: payload.environment,
          pose: selectedType === 'on-model' ? 'front' : 'flat-lay',
          outputType: 'generated',
          isHighRes: true,
          isFavorited: false
        }];
        setGeneratedImages(singleImage);
        console.log("Successfully generated single image:", singleImage);
      } else {
        console.warn("No images found in normalized payload. Full result:", result);
        throw new Error("No images generated or invalid response format");
      }

      // Refresh user profile to update credits and history
      await fetchUserProfile();

    } catch (error) {
      console.error("Generation error:", error);
      let errorMessage = "Failed to generate images. ";

      if (String(error.message).includes('Failed to fetch')) {
        errorMessage += "Please check if the server is running.";
      } else if (String(error.message).includes('500')) {
        errorMessage += "Server error occurred. Please try again.";
      } else if (String(error.message).includes('400')) {
        errorMessage += "Invalid request. Please check your inputs.";
      } else {
        errorMessage += error.message || String(error);
      }

      alert(errorMessage);
      setCurrentScreen('upload');

      // Refresh user profile to update credits and history
      await fetchUserProfile();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    if (!originalFile) {
      alert("No file available for generation. Please upload an image first.");
      return;
    }

    try {
      validateGenerationInputs(); // should throw on invalid input
      console.log("Inputs validated. Proceeding with generation...", customizeOptions);
      const creditsNeeded = customizeOptions.batchSize; // 1 credit per image
      if (userProfile.credits < creditsNeeded) {
        alert(`Insufficient credits. You need ${creditsNeeded} credits but only have ${userProfile.credits}.`);
        return;
      }

      // Deduct credits immediately in frontend for instant UI feedback
      setUserProfile(prev => ({
        ...prev,
        credits: prev.credits - creditsNeeded
      }))

      setIsGenerating(true);
      setCurrentScreen('gallery');
      setSelectedImageId(null);

      console.log(" Selected type:", selectedType);
      console.log("Generating with options:", customizeOptions);
      console.log("Using original file:", originalFile.name);

      // Build FormData
      const formData = new FormData();
      formData.append("file", originalFile);
      formData.append("type", customizeOptions.type || "flat-lay");
      formData.append("batchSize", String(customizeOptions.batchSize));
      formData.append("environment", customizeOptions.environment || "complementary");
      formData.append("product", uploadedImage?.product || uploadedImage?.category || "product");

      console.log("Sending request with FormData:", {
        file: originalFile.name,
        type: selectedType,
        batchSize: customizeOptions.batchSize,
        environment: customizeOptions.environment,
        product: uploadedImage?.product || uploadedImage?.category,
      });

      const response = await fetch("https://image-backend-delta.vercel.app/api/generateImage", {
        method: "POST",
        headers: { ...getAuthHeaders() },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        console.error("API Error Response:", response.status, response.statusText, errorText);
        throw new Error(`Generation failed: ${response.status} ${response.statusText} ${errorText ? "- " + errorText : ""}`);
      }

      const result = await response.json();
      console.log("Raw Generation API result:", result);

      // Normalize the payload: support both { success, data: {...} } and { successful, results } formats
      const payload = result?.data ?? result ?? {};
      const successfulCount = Number((payload.successful ?? payload.success) || 0);
      const failedCount = Number(payload.failed ?? payload.failedCount ?? 0);
      const results = Array.isArray(payload.results) ? payload.results : (Array.isArray(result?.results) ? result.results : []);

      console.log("Normalized payload:", { successfulCount, failedCount, results });

      if (successfulCount > 0 && results.length > 0) {
        console.log("Results array:", results);
        const transformedImages = results
          .map((img, index) => {
            // img might be a string URL or an object { url, imageIndex }
            const url = typeof img === "string" ? img : (img.url || img.uploadResult || null);
            if (!url) return null;
            return {
              id: `generated-${Date.now()}-${index}`,
              url,
              pose: selectedType === 'on-model' ? 'front' : 'flat-lay',
              type: payload.type,
              environment: payload.environment,
              outputType: 'generated',
              isHighRes: true,
              isFavorited: false,
              imageIndex: img.imageIndex ?? index + 1,
            };
          })
          .filter(Boolean);

        setGeneratedImages(transformedImages);
        console.log("Successfully generated images:", transformedImages);

        if (failedCount > 0) {
          console.warn(`Generated ${successfulCount} images, but ${failedCount} failed:`, payload.errors ?? []);
          alert(`Successfully generated ${successfulCount} out of ${customizeOptions.batchSize} images.`);
        }
      } else if (payload.url || result.url) {
        // single-image shapes
        const url = payload.url ?? result.url;
        const singleImage = [{
          id: `generated-${Date.now()}`,
          url,
          type: payload.type,
          environment: payload.environment,
          pose: selectedType === 'on-model' ? 'front' : 'flat-lay',
          outputType: 'generated',
          isHighRes: true,
          isFavorited: false
        }];
        setGeneratedImages(singleImage);
        console.log("Successfully generated single image:", singleImage);
      } else {
        console.warn("No images found in normalized payload. Full result:", result);
        throw new Error("No images generated or invalid response format");
      }

      // Refresh user profile to update credits and history
      await fetchUserProfile();

    } catch (error) {
      console.error("Generation error:", error);
      let errorMessage = "Failed to generate images. ";

      if (String(error.message).includes('Failed to fetch')) {
        errorMessage += "Please check if the server is running.";
      } else if (String(error.message).includes('500')) {
        errorMessage += "Server error occurred. Please try again.";
      } else if (String(error.message).includes('400')) {
        errorMessage += "Invalid request. Please check your inputs.";
      } else {
        errorMessage += error.message || String(error);
      }

      alert(errorMessage);
      setCurrentScreen('upload');

      // Refresh user profile to update credits and history
      await fetchUserProfile();
    } finally {
      setIsGenerating(false);
    }
  };


  const validateGenerationInputs = () => {
    if (!originalFile) throw new Error("No file uploaded");
    if (!customizeOptions.batchSize || customizeOptions.batchSize < 1 || customizeOptions.batchSize > 4)
      throw new Error("Invalid batch size (1-4 allowed)");
    if (!uploadedImage?.product && !uploadedImage?.category) throw new Error("Product information missing");
    return true;
  };


  const handleCustomizeGenerate = () => {
    setShowCustomizeModal(false);
    setShowGeneratMoreModal(false);
    console.log("Final options before generate:", { customizeOptions });
    handleGenerate();
  };

  const handleStyleSelection = () => {
    setSelectedType('on-model');

    setTimeout(() => {
      window.scrollBy({
        top: -100, // adjust how much you want to scroll
        behavior: 'smooth',
      });
    }, 50); // small delay to allow DOM to render
  };




  const openFullscreen = (imageId) => {
    setSelectedImageId(imageId);
  };

  const toggleFavorite = (imageId) => {
    setGeneratedImages(prev =>
      prev.map(img =>
        img.id === imageId ? { ...img, isFavorited: !img.isFavorited } : img
      )
    );
  };
  const handleGoogleLogin = () => {
    try {
      // ✅ Instead of fetch, do a redirect
      // This will hit your backend /api/google route
      // → backend redirects to Google login
      // → Google redirects back to your backend /google/callback
      // → backend issues a JWT & redirects to your frontend
      window.location.href = "https://image-backend-delta.vercel.app/api/google";
    } catch (error) {
      console.error("Login error:", error);
      alert(`Failed to log in: ${error.message}`);
    }
  };



  const allImages = [...generatedImages, ...historyImages];
  const selectedImage = allImages.find(img => img.id === selectedImageId);

  return (
    <div className="min-h-screen bg-gray-50 relative">

      {!isLoggedIn ? (
        <LoginScreen onLogin={handleGoogleLogin} />
      ) : (
        <>
          {/* Header */}
          <Header
            currentScreen={currentScreen}
            setCurrentScreen={setCurrentScreen}
            onLogout={handleLogout}
            userProfile={userProfile}
          />

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
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full max-w-md mx-auto">
                  <div className="text-center ">
                    <h1 className="text-lg font-semibold text-gray-900 mb-2">
                      Create stunning product images
                    </h1>


                    {uploadedImage ? (
                      <div className="space-y-4">
                        <div className="relative">
                          <img
                            src={uploadedImage.url}
                            alt="Uploaded product"
                            className="w-48 h-48 object-cover rounded-xl mx-auto border border-gray-200"
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
                        <p className="text-sm text-gray-600 mb-6">
                          Upload product image — PNG or JPG. We auto-detect category and suggest templates.
                        </p>
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

                <div className={`  h-0  ${showSlideshow ? 'relative opacity-100 mx-2 mt-6 space-y-4' : 'opacity-0'}`}>
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
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                      <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                        Choose Your Vibe
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setCustomizeOptions((prev) => ({
                          ...prev,
                          type: 'on-model',
                        }), setSelectedType('on-model'))}

                        className={`p-4 rounded-xl border-2 transition-all ${customizeOptions.type === 'on-model'
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
                        <p className="text-xs text-purple-600 mt-1">{customizeOptions.batchSize} • {customizeOptions.environment}</p>
                      </button>

                      <button
                        onClick={() => setCustomizeOptions((prev) => ({
                          ...prev,
                          type: 'flat-lay',
                        }), setSelectedType('flat-lay'))}
                        className={`p-4 rounded-xl border-2 transition-all ${customizeOptions.type === 'flat-lay'
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
                        <p className="text-xs text-purple-600 mt-1">{customizeOptions.batchSize} • Product only</p>
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
                  {<button
                    onClick={() => setShowCustomizeModal(true)}
                    className="flex-1 border border-purple-200 text-purple-700 py-4 rounded-xl font-medium hover:bg-purple-50 transition-colors"
                  >
                    Customize
                  </button>}
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
              <GalleryScreen generatedImages={generatedImages} openFullscreen={openFullscreen} toggleFavorite={toggleFavorite} isGenerating={isGenerating} batchSize={customizeOptions.batchSize} setShowGeneratMoreModal={setShowGeneratMoreModal} />
            )}

            {/* Fullscreen View */}
            {selectedImage && (
              <FullscreenView
                selectedImage={selectedImage}
                setSelectedImageId={setSelectedImageId}
                isGenerating={isGenerating}
                toggleFavorite={toggleFavorite}
                handleGeneratePoses={handleGeneratePoses}
              />
            )}

            {/* History Screen */}
            {currentScreen === 'history' && (
              <HistoryScreen
                openFullscreen={openFullscreen}
                toggleFavorite={toggleFavorite}
                setHistoryImages={setHistoryImages} // Add this prop
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
              setCustomizeOptions={setCustomizeOptions}
            />

          )}
          {showGenerateMoreModal && (
            <GenerateMoreModal
              showGenerateMoreModal={showGenerateMoreModal}
              setShowGeneratMoreModal={setShowCustomizeModal}
              setCustomizeOptions={setCustomizeOptions}
              customizeOptions={customizeOptions}
              handleCustomizeGenerate={handleCustomizeGenerate}

            />

          )}





          {/* Loading Overlay */}
          {/* {isGenerating && (
        <LoadingOverlay isGenerating={isGenerating} customizeOptions={customizeOptions} />
      )} */}
        </>
      )}

    </div>
  );
}


export default App;