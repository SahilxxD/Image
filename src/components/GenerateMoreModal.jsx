import React, { useEffect, useState, useCallback } from 'react';
import { X, Check } from 'lucide-react';

export default function GenerateMoreModal({
    showGenerateMoreModal,
    setShowGenerateMoreModal,
    customizeOptions,
    setCustomizeOptions,
    handleCustomizeGenerate,
}) {
    const [isGenerating, setIsGenerating] = useState(false);

    // Normalize and set defaults for mobile-first UX
    useEffect(() => {
        if (!customizeOptions) return;
        setCustomizeOptions((prev) => ({
            type: prev?.type ?? 'on-model',
            environment: prev?.environment ?? null,
            batchSize: prev?.batchSize ?? 2,
            ...prev,
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const types = [
        {
            id: 'on-model',
            label: 'Model Showcase',
            desc: 'Styled on models',
            image:
                'https://ik.imagekit.io/efhehcx94/1000039500.png?tr=w-600,h-600,fo-auto',
        },
        {
            id: 'flat-lay',
            label: 'Flat Layout',
            desc: 'Product only',
            image:
                'https://ik.imagekit.io/efhehcx94/Generated%20Image%20September%2013,%202025%20-%2012_32PM.png?tr=w-600,h-600,fo-auto',
        },
    ];

    if (!showGenerateMoreModal) return null;

    // keyboard nav for simple lists
    const onKeyNav = useCallback((e, list, idx, setterKey) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            const next = (idx + 1) % list.length;
            const id = list[next].id;
            setCustomizeOptions((p) => ({ ...p, [setterKey]: id }));
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            const prev = (idx - 1 + list.length) % list.length;
            const id = list[prev].id;
            setCustomizeOptions((p) => ({ ...p, [setterKey]: id }));
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const id = list[idx].id;
            setCustomizeOptions((p) => ({ ...p, [setterKey]: id }));
        }
    }, [setCustomizeOptions]);

    const onGenerate = async () => {
        if (isGenerating) return;
        try {
            setIsGenerating(true);
            await Promise.resolve(handleCustomizeGenerate?.());
        } catch (err) {
            console.error('Generate error', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const safeAreaStyle = { paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 12px)' };

    return (
        <div className="fixed inset-0 bg-black/45 z-50 flex items-end" role="dialog" aria-modal="true">
            <div className="bg-white rounded-t-3xl w-full max-h-[86vh] flex flex-col" style={safeAreaStyle}>
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">Customize Generation</h2>
                    <button
                        onClick={() => setShowGenerateMoreModal(false)}
                        className="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        aria-label="Close customize modal"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                    {/* STEP 1: Select type */}
                    <h3 className="font-medium text-gray-900 mb-3">Choose Style</h3>

                    <div role="radiogroup" aria-label="Style" className="grid grid-cols-2 gap-4 mb-6">
                        {types.map((type, idx) => {
                            const selected = customizeOptions.type === type.id;
                            return (
                                <div
                                    key={type.id}
                                    role="radio"
                                    aria-checked={selected}
                                    tabIndex={0}
                                    onKeyDown={(e) => onKeyNav(e, types, idx, 'type')}
                                    onClick={() => setCustomizeOptions((prev) => ({ ...prev, type: type.id, environment: null }))}
                                    className={`relative p-4 rounded-xl transition-all focus:outline-none focus:ring-2 ${selected ? 'border-2 border-purple-500 bg-purple-50' : 'border border-gray-200 bg-white'
                                        }`}
                                    style={{ minHeight: 150 }}
                                >
                                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                                        <img src={type.image} alt={type.label} className="w-full h-full object-cover rounded-lg" loading="lazy" sizes="(max-width:640px) 46vw, 200px" />
                                    </div>

                                    <h3 className="font-medium text-sm text-gray-900 mb-1">{type.label}</h3>
                                    <p className="text-xs text-gray-500">{type.desc}</p>

                                    {selected && (
                                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center">
                                            <Check size={14} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* STEP 2: Environments (only if on-model selected) */}
                    {customizeOptions.type === 'on-model' && (
                        <>
                            <h3 className="font-medium text-gray-900 mb-3">Environment</h3>
                            <div role="radiogroup" aria-label="Environment" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {environments.map((env, idx) => {
                                    const selected = customizeOptions.environment === env.id;
                                    return (
                                        <div
                                            key={env.id}
                                            role="radio"
                                            aria-checked={selected}
                                            tabIndex={0}
                                            onKeyDown={(e) => onKeyNav(e, environments, idx, 'environment')}
                                            onClick={() => setCustomizeOptions((prev) => ({ ...prev, environment: env.id }))}
                                            className={`relative flex flex-col rounded-2xl overflow-hidden focus:outline-none focus:ring-2 ${selected ? 'ring-2 ring-purple-400 bg-purple-50' : 'bg-white border border-gray-200 hover:shadow-md'
                                                }`}
                                            style={{ minHeight: 140 }}
                                        >
                                            <div className="w-full aspect-[4/3] bg-gray-100">
                                                <img src={env.image} alt={env.label} className="w-full h-full object-cover" loading="lazy" sizes="(max-width:640px) 46vw, 200px" />
                                            </div>

                                            <div className="p-3 flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-900">{env.label}</span>
                                                {selected && (
                                                    <div className="ml-2 w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center">
                                                        <Check size={14} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-4 border-t border-gray-100"></div>

                            {/* Batch size control */}
                            <div className="mt-3">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-sm font-medium text-gray-700">Batch size</div>
                                    <div className="text-xs text-gray-500">Tap to choose how many images</div>
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
                                                className={`px-4 py-3 rounded-lg text-sm font-medium min-w-[84px] text-center transition-all focus:outline-none focus:ring-2 ${selected ? 'bg-purple-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-700'
                                                    }`}
                                            >
                                                {size} images
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* tiny preview */}
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
                        </>
                    )}
                </div>

                {/* Footer: mobile-friendly */}
                <div className="p-4 border-t border-gray-100 bg-white">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowGenerateMoreModal(false)}
                            className="flex-1 py-3 rounded-xl border border-gray-200 font-medium text-gray-700 min-h-[48px] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-400"
                        >
                            Apply & Close
                        </button>

                        <button
                            onClick={onGenerate}
                            disabled={
                                isGenerating ||
                                !customizeOptions.type ||
                                (customizeOptions.type === 'on-model' && !customizeOptions.environment)
                            }
                            className={`flex-1 py-3 rounded-xl font-medium min-h-[48px] focus:outline-none focus:ring-2 focus:ring-offset-1 ${isGenerating
                                ? 'bg-purple-300 text-white cursor-wait'
                                : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isGenerating ? 'Generating…' : 'Generate'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
