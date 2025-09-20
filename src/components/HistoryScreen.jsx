import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Filter, Sparkles } from 'lucide-react';
import HistorySkeleton from './HistorySkeleton';

function HistoryScreen({ openFullscreen, toggleFavorite, setHistoryImages: setParentHistoryImages }) {
    const [historyImages, setHistoryImages] = useState([]);
    const [filter, setFilter] = useState('all'); // all, favorites, recent
    const [loading, setLoading] = useState(true);

    // Mock history data - replace with actual API call
    const mockHistoryData = [
        {
            id: 'hist-1',
            url: 'https://ik.imagekit.io/efhehcx94/1000039585.png?updatedAt=1757786299011&tr=w-1080%2Ch-1080%2Cfo-auto',
            pose: 'front',
            environment: 'studio',
            outputType: 'catalog',
            isHighRes: true,
            isFavorited: true,
            createdAt: '2025-01-15T10:30:00Z',
            batchId: 'batch-001'
        },
        {
            id: 'hist-2',
            url: 'https://ik.imagekit.io/efhehcx94/1000039500.png?updatedAt=1757786299006&tr=w-1080%2Ch-1080%2Cfo-auto',
            pose: 'three-quarter',
            environment: 'studio',
            outputType: 'catalog',
            isHighRes: true,
            isFavorited: false,
            createdAt: '2025-01-15T10:30:00Z',
            batchId: 'batch-001'
        },
        {
            id: 'hist-3',
            url: 'https://ik.imagekit.io/efhehcx94/1000039767.png?updatedAt=1757786298897&tr=w-1080%2Ch-1080%2Cfo-auto',
            pose: 'walking',
            environment: 'outdoor',
            outputType: 'instagram',
            isHighRes: true,
            isFavorited: true,
            createdAt: '2025-01-14T15:45:00Z',
            batchId: 'batch-002'
        },
        {
            id: 'hist-4',
            url: 'https://ik.imagekit.io/efhehcx94/1000039641.png?updatedAt=1757786298791&tr=w-1080%2Ch-1080%2Cfo-auto',
            pose: 'closeup',
            environment: 'studio',
            outputType: 'catalog',
            isHighRes: true,
            isFavorited: false,
            createdAt: '2025-01-14T12:20:00Z',
            batchId: 'batch-003'
        },
        {
            id: 'hist-5',
            url: 'https://ik.imagekit.io/efhehcx94/Generated%20Image%20September%2013,%202025%20-%2012_32PM.png?updatedAt=1757787811859&tr=w-1080%2Ch-1080%2Cfo-auto',
            pose: 'flat-lay',
            environment: 'minimal',
            outputType: 'catalog',
            isHighRes: true,
            isFavorited: true,
            createdAt: '2025-01-13T09:15:00Z',
            batchId: 'batch-004'
        },
        {
            id: 'hist-6',
            url: 'https://ik.imagekit.io/efhehcx94/1000039621.png?updatedAt=1757786296927&tr=w-1080%2Ch-1080%2Cfo-auto',
            pose: 'front',
            environment: 'studio',
            outputType: 'social',
            isHighRes: true,
            isFavorited: false,
            createdAt: '2025-01-12T16:30:00Z',
            batchId: 'batch-005'
        }
    ];

    useEffect(() => {
        // Simulate API call
        const fetchHistory = async () => {
            setLoading(true);
            // In real app, make API call here
            setTimeout(() => {
                setHistoryImages(mockHistoryData);
                // Also update the parent component's history images for fullscreen access
                if (setParentHistoryImages) {
                    setParentHistoryImages(mockHistoryData);
                }
                setLoading(false);
            }, 500);
        };

        fetchHistory();
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

            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {[
                    { key: 'all', label: 'All', count: historyImages.length },
                    { key: 'favorites', label: 'Favorites', count: historyImages.filter(img => img.isFavorited).length },
                    {
                        key: 'recent', label: 'Recent', count: historyImages.filter(img => {
                            const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                            return new Date(img.createdAt) > dayAgo;
                        }).length
                    }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${filter === tab.key
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
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
                                                    {image.environment}
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