import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Filter, Sparkles } from 'lucide-react';
import HistorySkeleton from './HistorySkeleton';

function HistoryScreen({ openFullscreen, toggleFavorite, setHistoryImages: setParentHistoryImages, clientId }) {
    const [historyImages, setHistoryImages] = useState([]);
    const [filter, setFilter] = useState('all'); // all, favorites, recent
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // optional error state

    // Mock history data - replace with actual API call


    const fetchHistory = async (signal) => {
        setLoading(true);
        setError(null); // optional state if you have one

        try {
            // Construct URL with optional clientId param
            const baseUrl = "https://image-backend-delta.vercel.app/api/history";
            const url = clientId ? `${baseUrl}?clientId=${encodeURIComponent(clientId)}` : baseUrl;

            // Build request options dynamically
            const options = {
                method: "GET", // use POST if you’re sending a body
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Y2U2NDk4MWQ1NDM4YWQ1Y2VmOTNlYSIsImlhdCI6MTc2MDg1OTUzMywiZXhwIjoxNzYwOTAyNzMzfQ.GPFVuI197ur5aU7Tc6zCG52UQEoHf47ZwFBXipwk1Y0`,
                },
                signal,
            };

            // Make the request
            const res = await fetch(url, options);


            if (!res.ok) {
                throw new Error(`HTTP ${res.status} ${res.statusText}`);
            }

            const json = await res.json();
            // adapt depending on your API shape - if you return { success, data }:
            const data = json.data ?? json; // fallback to raw response if not wrapped
            console.log("Fetched history data:", data);
            const normalized = data.map(img => ({
                ...img,
                id: img.id ?? img._id,
                url: img.imageUrl ?? img.url
            }));


            // update local state and parent callback (same as your mock behavior)
            setHistoryImages(Array.isArray(normalized) ? normalized : []);
            if (typeof setParentHistoryImages === "function") {
                setParentHistoryImages(Array.isArray(normalized) ? normalized : []);
            }
        } catch (err) {
            if (err.name === "AbortError") {
                // request was cancelled — ignore
                console.log("fetchHistory aborted");
            } else {
                console.error("fetchHistory error:", err);
                // optional: set an error state to show to the user
                setError?.(err.message || "Failed to fetch history");
            }
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const controller = new AbortController();
        fetchHistory(controller.signal);

        return () => {
            controller.abort();
        };
    }, []);


    const filteredImages = historyImages.filter(image => {
        if (filter === 'favorites') return image.isFavorited;
        if (filter === 'recent') {
            const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            return new Date(image.createdAt) > dayAgo;
        }
        return true; // 'all'
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString();
        }
    };

    // Group images by date
    const groupedImages = filteredImages.reduce((groups, image) => {
        const date = formatDate(image.createdAt);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(image);
        return groups;
    }, {});

    if (loading) {
        return <HistorySkeleton />;
    }

    return (
        <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-gray-900">History</h1>
                    <p className="text-sm text-gray-600">
                        {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button className="p-2 hover:bg-gray-50 rounded-lg">
                    <Filter size={20} className="text-gray-600" />
                </button>
            </div>


            {/* Images Grid */}
            <div className="space-y-6">
                {Object.keys(groupedImages).length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
                        <p className="text-gray-600">
                            {filter === 'favorites'
                                ? "You haven't favorited any images yet"
                                : filter === 'recent'
                                    ? "No recent images in the last 24 hours"
                                    : "Start generating some amazing images!"
                            }
                        </p>
                    </div>
                ) : (
                    Object.entries(groupedImages).map(([date, images]) => (
                        <div key={date} className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" />
                                <h2 className="text-sm font-medium text-gray-900">{date}</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {images.map((image) => (
                                    <div
                                        key={image.id}
                                        className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
                                    >
                                        <div className="relative">
                                            <img
                                                src={image.url}
                                                alt={`Generated ${image.pose} pose`}
                                                className="w-full aspect-square object-cover cursor-pointer"
                                                onClick={() => openFullscreen(image.id)}
                                            />
                                            <div className="absolute top-2 right-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleFavorite(image.id);
                                                        // Update local state
                                                        setHistoryImages(prev =>
                                                            prev.map(img =>
                                                                img.id === image.id
                                                                    ? { ...img, isFavorited: !img.isFavorited }
                                                                    : img
                                                            )
                                                        );
                                                    }}
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${image.isFavorited
                                                        ? "bg-red-100 text-red-600"
                                                        : "bg-black/20 text-white hover:bg-black/40"
                                                        }`}
                                                >
                                                    <Heart
                                                        size={14}
                                                        fill={image.isFavorited ? "currentColor" : "none"}
                                                    />
                                                </button>
                                            </div>
                                            {/* Environment/Type Badge */}
                                            <div className="absolute bottom-2 left-2">
                                                <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-md">
                                                    {image.environment ? image.environment.charAt(0).toUpperCase() + image.environment.slice(1) : image.type} - {image.outputType ? image.outputType.charAt(0).toUpperCase() + image.outputType.slice(1) : 'Image'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default HistoryScreen;