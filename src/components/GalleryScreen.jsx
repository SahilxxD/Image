import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import SkeletonCard from "./SkeletonCard";


function GalleryScreen({ generatedImages, setShowCustomizeModal, openFullscreen, toggleFavorite, isGenerating, batchSize }) {
    return (
        <div className="p-4 space-y-4 h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-gray-900">Generated Images</h1>
                    <p className="text-sm text-gray-600">
                        {isGenerating ? "Generating..." : `${generatedImages.length} variations`}
                    </p>
                </div>
                <button
                    onClick={() => setShowCustomizeModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100 transition-colors"
                >
                    <Sparkles size={16} />
                    Generate More
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {isGenerating
                    ? Array.from({ length: batchSize }).map((_, i) => <SkeletonCard key={i} />)
                    : generatedImages.map((image) => (
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
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default GalleryScreen;
