import React, { useEffect, useState, useCallback } from 'react';
import { X, Check } from 'lucide-react';

export default function CustomizeModal({
    showCustomizeModal,
    setShowCustomizeModal,
    customizeOptions,
    setCustomizeOptions,
    handleCustomizeGenerate, // can be sync or return a Promise
}) {
    const [isGenerating, setIsGenerating] = useState(false);

    // Ensure defaults
    useEffect(() => {
        if (!customizeOptions) return;
        if (!customizeOptions.batchSize) {
            setCustomizeOptions((p) => ({ ...p, batchSize: 2 }));
        }
        if (!customizeOptions.environment) {
            setCustomizeOptions((p) => ({ ...p, environment: 'studio' }));
        }
    }, [customizeOptions, setCustomizeOptions]);

    if (!showCustomizeModal) return null;

    const environments = [
        {
            id: 'studio',
            label: 'Studio',
            image:
                'https://ik.imagekit.io/efhehcx94/Generated%20Image%20September%2014,%202025%20-%2012_01AM.png?tr=w-600,h-600,fo-auto',
        },
        {
            id: 'outdoor',
            label: 'Outdoor',
            image:
                'https://ik.imagekit.io/efhehcx94/Generated%20Image%20September%2014,%202025%20-%2012_12AM.png?tr=w-600,h-600,fo-auto',
        },
        {
            id: 'urban',
            label: 'Urban',
            image:
                'https://ik.imagekit.io/efhehcx94/Generated%20Image%20September%2014,%202025%20-%2012_15AM.png?tr=w-600,h-600,fo-auto',
        },
        {
            id: 'editorial',
            label: 'Editorial',
            image:
                'https://ik.imagekit.io/efhehcx94/Generated%20Image%20September%2014,%202025%20-%2012_16AM.png?tr=w-600,h-600,fo-auto',
        },
    ];

    // keyboard navigation for environments (left/right)
    const onEnvKeyDown = useCallback(
        (e, idx) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                const next = (idx + 1) % environments.length;
                const id = environments[next].id;
                setCustomizeOptions((p) => ({ ...p, environment: id }));
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                const prev = (idx - 1 + environments.length) % environments.length;
                const id = environments[prev].id;
                setCustomizeOptions((p) => ({ ...p, environment: id }));
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const id = environments[idx].id;
                setCustomizeOptions((p) => ({ ...p, environment: id }));
            }
        },
        [environments, setCustomizeOptions]
    );

    const onGenerate = async () => {
        if (isGenerating) return;
        try {
            setIsGenerating(true);
            // If handler returns a Promise, await it. If not, still safe.
            await Promise.resolve(handleCustomizeGenerate?.());
        } catch (err) {
            console.error('Generate error', err);
        } finally {
            setIsGenerating(false);
        }
    };

    // safe-area styling inline for broad device compatibility
    const safeAreaStyle = { paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 12px)' };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end bg-black/45"
            aria-hidden={false}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="bg-white rounded-t-3xl w-full max-h-[86vh] flex flex-col"
                style={safeAreaStyle}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">Customize Generation</h2>
                    <button
                        onClick={() => setShowCustomizeModal(false)}
                        className="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        aria-label="Close customize modal"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* Body: environment grid */}
                <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                    <h3 className="font-medium text-gray-900 mb-3">Environment</h3>

                    <div
                        role="radiogroup"
                        aria-label="Environment"
                        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                    >
                        {environments.map((env, idx) => {
                            const selected = customizeOptions.environment === env.id;
                            return (
                                <div
                                    key={env.id}
                                    role="radio"
                                    aria-checked={selected}
                                    tabIndex={0}
                                    onKeyDown={(e) => onEnvKeyDown(e, idx)}
                                    onClick={() => setCustomizeOptions((p) => ({ ...p, environment: env.id }))}
                                    className={`relative flex flex-col rounded-2xl overflow-hidden focus:outline-none focus:ring-2
                    ${selected
                                            ? 'ring-2 ring-purple-400 bg-purple-50'
                                            : 'bg-white border border-gray-200 hover:shadow-md'
                                        }`}
                                    style={{ minHeight: 150 }}
                                >
                                    <div className="w-full aspect-[4/3] bg-gray-100">
                                        <img
                                            src={env.image}
                                            alt={env.label}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            // give browser hints: smaller src used on small devices
                                            sizes="(max-width: 640px) 46vw, 200px"
                                        />
                                    </div>

                                    <div className="p-3 flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{env.label}</div>
                                            <div className="text-xs text-gray-500">Recommended</div>
                                        </div>

                                        {selected && (
                                            <div className="ml-2 flex items-center gap-1">
                                                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                                                    <Check size={14} className="text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Divider */}
                    <div className="mt-4 border-t border-gray-100"></div>

                    {/* Batch size control (mobile-friendly) */}
                    <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-gray-700">Batch size</div>
                            <div className="text-xs text-gray-500">Choose how many images to generate</div>
                        </div>

                        <div role="radiogroup" aria-label="Batch size" className="flex gap-3">
                            {[2, 4].map((size) => {
                                const selected = customizeOptions.batchSize === size;
                                return (
                                    <button
                                        key={size}
                                        role="radio"
                                        aria-checked={selected}
                                        onClick={() => setCustomizeOptions((p) => ({ ...p, batchSize: size }))}
                                        className={`px-4 py-3 rounded-lg text-sm font-medium min-w-[84px] text-center transition-all focus:outline-none focus:ring-2
                      ${selected
                                                ? 'bg-purple-600 text-white shadow-sm'
                                                : 'bg-white border border-gray-200 text-gray-700'
                                            }`}
                                    >
                                        {size} images
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tiny visual preview so users understand layout on mobile */}
                        <div className="mt-3">
                            <div className="text-xs text-gray-500 mb-2">Preview</div>
                            <div className="w-full max-w-xs">
                                {customizeOptions.batchSize === 2 ? (
                                    <div className="flex gap-2">
                                        <div className="flex-1 aspect-square rounded bg-gray-100 border" />
                                        <div className="flex-1 aspect-square rounded bg-gray-100 border" />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="aspect-square rounded bg-gray-100 border" />
                                        <div className="aspect-square rounded bg-gray-100 border" />
                                        <div className="aspect-square rounded bg-gray-100 border" />
                                        <div className="aspect-square rounded bg-gray-100 border" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer: sticky, mobile-friendly */}
                <div className="p-4 border-t border-gray-100 bg-white">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowCustomizeModal(false)}
                            className="flex-1 py-3 rounded-xl border border-gray-200 font-medium text-gray-700 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-400"
                        >
                            Apply & Close
                        </button>

                        <button
                            onClick={onGenerate}
                            disabled={isGenerating}
                            className={`flex-1 py-3 rounded-xl font-medium min-h-[48px] focus:outline-none focus:ring-2 focus:ring-offset-1 ${isGenerating
                                    ? 'bg-purple-300 text-white cursor-wait'
                                    : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg'
                                }`}
                        >
                            {isGenerating ? 'Generating…' : 'Generate'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
