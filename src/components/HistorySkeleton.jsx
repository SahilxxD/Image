import React from "react";

function HistorySkeleton() {
    return (
        <div className="p-4 space-y-4">
            {/* Header skeleton */}
            <div className="flex items-center justify-between"
                style={{
                    animation: 'fadeIn 0.5s ease-out both'
                }}>
                <div>
                    <div className="h-6 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 bg-[length:200%_100%] rounded w-20 mb-2"
                        style={{ animation: 'shimmer 2s ease-in-out infinite' }}
                    />
                    <div className="h-4 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 bg-[length:200%_100%] rounded w-32"
                        style={{ animation: 'shimmer 2s ease-in-out 0.1s infinite' }}
                    />
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 bg-[length:200%_100%] rounded-lg"
                    style={{ animation: 'shimmer 2s ease-in-out 0.2s infinite' }}
                />
            </div>

            {/* Date groups skeleton */}
            <div className="space-y-6">
                {/* First date group */}
                <div className="space-y-3"
                    style={{
                        animation: 'fadeIn 0.5s ease-out 0.2s both'
                    }}>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 bg-[length:200%_100%] rounded"
                            style={{ animation: 'shimmer 2s ease-in-out infinite' }}
                        />
                        <div className="h-4 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 bg-[length:200%_100%] rounded w-16"
                            style={{ animation: 'shimmer 2s ease-in-out 0.1s infinite' }}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i}
                                style={{
                                    animation: `fadeIn 0.5s ease-out ${0.3 + i * 0.1}s both`
                                }}>
                                <HistorySkeletonCard delay={i * 0.15} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Second date group */}
                <div className="space-y-3"
                    style={{
                        animation: 'fadeIn 0.5s ease-out 0.7s both'
                    }}>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 bg-[length:200%_100%] rounded"
                            style={{ animation: 'shimmer 2s ease-in-out 0.7s infinite' }}
                        />
                        <div className="h-4 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 bg-[length:200%_100%] rounded w-20"
                            style={{ animation: 'shimmer 2s ease-in-out 0.8s infinite' }}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i}
                                style={{
                                    animation: `fadeIn 0.5s ease-out ${0.9 + i * 0.1}s both`
                                }}>
                                <HistorySkeletonCard delay={0.7 + i * 0.15} />
                            </div>
                        ))}
                    </div>
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
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}

// Individual skeleton card for history items
function HistorySkeletonCard({ delay = 0 }) {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <div className="relative">
                {/* Image area with shimmer */}
                <div className="aspect-square w-full bg-gradient-to-r from-purple-100 via-purple-200 to-purple-100 bg-[length:200%_100%]"
                    style={{
                        animation: `shimmer 2s ease-in-out ${delay}s infinite`
                    }}
                />

                {/* Favorite button placeholder (top-right) */}
                <div className="absolute top-2 right-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 bg-[length:200%_100%]"
                        style={{
                            animation: `shimmer 2s ease-in-out ${delay + 0.2}s infinite`
                        }}
                    />
                </div>

                {/* Environment badge placeholder (bottom-left) */}
                <div className="absolute bottom-2 left-2">
                    <div className="h-6 bg-gradient-to-r from-purple-200 via-purple-300 to-purple-200 bg-[length:200%_100%] rounded-md w-16"
                        style={{
                            animation: `shimmer 2s ease-in-out ${delay + 0.4}s infinite`
                        }}
                    />
                </div>
            </div>
        </div>
    );
}


export default HistorySkeleton;