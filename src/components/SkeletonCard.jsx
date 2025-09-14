import React from "react";

function SkeletonCard() {
    return (
        <div className="bg-gray rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <div className="relative">
                {/* Image area: same aspect ratio as final image */}
                <div className="aspect-square w-full bg-purple-400/60 animate-pulse" />

                {/* Favorite button placeholder (top-right) */}
                <div className="absolute top-2 right-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500/70 animate-pulse" />
                </div>

            </div>
        </div>
    );
}

export default SkeletonCard;
