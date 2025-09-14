import React from 'react';
import { X, Check } from 'lucide-react';

function GenerateMoreModal({
    showCustomizeModal,
    setShowGeneratMoreModal,
    customizeOptions,
    setCustomizeOptions,
    handleCustomizeGenerate
}) {
    const environments = [
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
    ];

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
                        onClick={() => setShowGeneratMoreModal(false)}
                        className="p-2 hover:bg-gray-50 rounded-lg"
                        aria-label="Close customize modal"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* Body (scrollable) */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-4">
                    {/* STEP 1: Select type */}
                    <h3 className="font-medium text-gray-900 mb-3">Choose Style</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {[
                            {
                                id: "model",
                                label: "Model Showcase",
                                desc: "Styled on models",
                                image:
                                    "https://ik.imagekit.io/efhehcx94/1000039500.png?updatedAt=1757786299006&tr=w-1080%2Ch-1080%2Cfo-auto",
                            },
                            {
                                id: "flatlay",
                                label: "Flat-Lay",
                                desc: "Product only",
                                image:
                                    "https://ik.imagekit.io/efhehcx94/Generated%20Image%20September%2013,%202025%20-%2012_32PM.png?updatedAt=1757787811859&tr=w-1080%2Ch-1080%2Cfo-auto",
                            },
                        ].map((type) => {
                            const selected = customizeOptions.type === type.id;
                            return (
                                <button
                                    key={type.id}
                                    onClick={() =>
                                        setCustomizeOptions((prev) => ({
                                            ...prev,
                                            type: type.id,
                                            environment: null, // reset if switching
                                        }))
                                    }
                                    className={`p-4 rounded-xl border-2 transition-all ${selected
                                        ? "border-purple-500 bg-purple-50"
                                        : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                >
                                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                                        <img
                                            src={type.image}
                                            alt={type.label}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                    <h3 className="font-medium text-sm text-gray-900 mb-1">{type.label}</h3>
                                    <p className="text-xs text-purple-600 mt-1">{type.desc}</p>

                                    {/* check icon if selected */}
                                    {selected && (
                                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center">
                                            <Check size={14} />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>


                    {/* STEP 2: Environments (only if Model Showcase selected) */}
                    {customizeOptions.type === 'model' && (
                        <>
                            <h3 className="font-medium text-gray-900 mb-3">Environment</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {environments.map((env) => {
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

                                            {/* label */}
                                            <div className="w-full flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-900">{env.label}</span>
                                                {selected && (
                                                    <div className="ml-2 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center">
                                                        <Check size={14} />
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
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
                            disabled={!customizeOptions.type || (customizeOptions.type === 'model' && !customizeOptions.environment)}
                            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Generate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GenerateMoreModal;
