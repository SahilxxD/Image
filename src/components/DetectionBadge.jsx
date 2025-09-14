import React, { useState, useEffect, useRef } from "react";

function DetectionBadge({ isDetecting, uploadedImage }) {
    const phrases = [
        "Our AI is studying this piece — almost ready ✨",
        "Tuning studio lights & angles for your product…",
        "Checking the best framing and styling…"
    ];

    const [index, setIndex] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!isDetecting) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIndex(0);
            return;
        }

        intervalRef.current = setInterval(() => {
            setIndex((i) => (i + 1) % phrases.length);
        }, 1800);

        return () => {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        };
    }, [isDetecting]);

    const finalText = uploadedImage?.category
        ? `${uploadedImage.category} — Ready to generate!`
        : "Ready to generate!";

    return (
        <div
            role="status"
            aria-live="polite"
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${isDetecting
                ? "bg-amber-50 text-amber-800"
                : "bg-green-50 text-green-700"
                }`}
        >
            {/* Spinner / Check */}
            <span className="flex items-center justify-center w-4 h-4">
                {isDetecting ? (
                    <svg
                        className="w-4 h-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeOpacity="0.16"
                        />
                        <path
                            d="M22 12a10 10 0 00-6-9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                ) : (
                    <span aria-hidden>✅</span>
                )}
            </span>

            {/* Animated text */}
            <div className="relative w-[260px] h-5 overflow-hidden">
                {isDetecting ? (
                    phrases.map((p, i) => (
                        <span
                            key={i}
                            className={`absolute left-0 top-0 transition-all duration-500 ease-in-out ${i === index
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-5"
                                }`}
                            style={{ willChange: "opacity, transform" }}
                        >
                            {p}
                        </span>
                    ))
                ) : (
                    <span className="block whitespace-nowrap">{finalText}</span>
                )}
            </div>


        </div>
    );
}

export default DetectionBadge;
