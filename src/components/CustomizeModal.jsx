import React from 'react';
import { X, Check } from 'lucide-react';

function CustomizeModal({ showCustomizeModal, setShowCustomizeModal, customizeOptions, setCustomizeOptions, handleCustomizeGenerate }) {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="bg-white rounded-t-2xl w-full max-h-[80vh] flex flex-col">
                {/* hide scrollbar styles */}
                <style>{`
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>

                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Customize Generation</h2>
                    <button
                        onClick={() => setShowCustomizeModal(false)}
                        className="p-2 hover:bg-gray-50 rounded-lg"
                        aria-label="Close customize modal"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* Body (scrollable) */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Environment</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[
                            {
                                id: 'studio',
                                label: 'Studio',
                                image:
                                    'https://ik.imagekit.io/efhehcx94/Generated%20Image%20September%2014,%202025%20-%2012_01AM.png?updatedAt=1757789285879&tr=w-1080%2Ch-1080%2Cfo-auto',
                            },
                            {
                                id: 'outdoor',
                                label: 'Outdoor',
                                image:
                                    'https://ik.imagekit.io/efhehcx94/Generated%20Image%20September%2014,%202025%20-%2012_12AM.png?updatedAt=1757789283918&tr=w-1080%2Ch-1080%2Cfo-auto',
                            },
                            {
                                id: 'urban',
                                label: 'Urban',
                                image:
                                    'https://ik.imagekit.io/efhehcx94/Generated%20Image%20September%2014,%202025%20-%2012_15AM.png?updatedAt=1757789285528&tr=w-1080%2Ch-1080%2Cfo-auto',
                            },
                            {
                                id: 'editorial',
                                label: 'Editorial',
                                image:
                                    'https://ik.imagekit.io/efhehcx94/Generated%20Image%20September%2014,%202025%20-%2012_16AM.png?updatedAt=1757789285214&tr=w-1080%2Ch-1080%2Cfo-auto',
                            }
                        ].map((env) => {
                            const selected = customizeOptions.environment === env.id;
                            return (
                                <button
                                    key={env.id}
                                    onClick={() =>
                                        setCustomizeOptions((prev) => ({ ...prev, environment: env.id }))
                                    }
                                    aria-pressed={selected}
                                    className={`relative flex flex-col items-start gap-3 p-3 rounded-2xl transition-transform transform
              ${selected
                                            ? 'ring-2 ring-purple-400 bg-purple-50 shadow-sm'
                                            : 'bg-white border border-gray-200 hover:shadow-md hover:-translate-y-1'
                                        }
            `}
                                >
                                    {/* image */}
                                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                                        <img src={env.image} alt={env.label} className="w-full h-full object-cover" />
                                    </div>

                                    {/* label + desc */}
                                    <div className="w-full">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{env.label}</div>
                                                <div className="text-xs text-gray-600">{env.desc}</div>
                                            </div>

                                            {/* selected badge */}
                                            {selected && (
                                                <div className="ml-2 flex items-center gap-1">
                                                    <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                                                        <Check size={14} className="text-white" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* subtle footer tag */}
                                    <div className="mt-1 text-xs text-gray-500">Recommended</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer (always visible) */}
                <div className="p-4 border-t border-gray-100 bg-white">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowCustomizeModal(false)}
                            className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                        >
                            Apply & Close
                        </button>
                        <button
                            onClick={handleCustomizeGenerate}
                            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                        >
                            Generate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomizeModal;
