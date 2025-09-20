import React from "react";

function HistorySkeleton() {
    return (
        <div className="p-4 space-y-4">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="h-6 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            {/* Filter tabs skeleton */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex-1 py-2 px-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                ))}
            </div>

            {/* Date groups skeleton */}
            <div className="space-y-6">
                {/* First date group */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <HistorySkeletonCard key={i} />
                        ))}
                    </div>
                </div>

                {/* Second date group */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <HistorySkeletonCard key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Individual skeleton card for history items
function HistorySkeletonCard() {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <div className="relative">
                {/* Image area */}
                <div className="aspect-square w-full bg-purple-100/60 animate-pulse" />

                {/* Favorite button placeholder (top-right) */}
                <div className="absolute top-2 right-2">
                    <div className="w-8 h-8 rounded-full bg-purple-200/70 animate-pulse" />
                </div>

                {/* Environment badge placeholder (bottom-left) */}
                <div className="absolute bottom-2 left-2">
                    <div className="h-6 bg-purple-200/70 rounded-md w-16 animate-pulse" />
                </div>
            </div>
        </div>
    );
}

export default HistorySkeleton;