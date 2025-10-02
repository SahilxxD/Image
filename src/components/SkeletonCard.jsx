import React from "react";

function SkeletonCard() {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <div className="relative">
                {/* Image area with shimmer effect */}
                <div className="aspect-square w-full bg-gradient-to-r from-purple-100 via-purple-200 to-purple-100 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]"
                    style={{
                        animation: 'shimmer 2s ease-in-out infinite'
                    }}
                />

                {/* Favorite button placeholder with delayed animation */}
                <div className="absolute top-2 right-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 bg-[length:200%_100%]"
                        style={{
                            animation: 'shimmer 2s ease-in-out 0.3s infinite'
                        }}
                    />
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% {
                        background-position: -200% 0;
                    }
                    100% {
                        background-position: 200% 0;
                    }
                }
            `}</style>
        </div>
    );
}


export default SkeletonCard;