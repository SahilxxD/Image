import React from "react";
import { LogIn } from "lucide-react";

function LoginScreen({ onLogin }) {
    const videoUrl = "https://ik.imagekit.io/efhehcx94/2a200b4f897a4bf590c3542d308dfd67.mp4";

    return (
        <div className="relative flex flex-col justify-between min-h-screen p-6 md:p-8 overflow-hidden">
            {/* Video: z-0 (bottom), pointer-events-none so it doesn't capture clicks */}
            <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay: above video but below content */}
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10 pointer-events-none"></div>

            {/* Content: top layer */}
            <div className="relative z-20 text-center pt-16 sm:pt-24">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    Welcome to Shot Genie
                </h1>
                <p className="mt-4 text-base sm:text-lg text-gray-200">
                    Your creative partner for stunning visuals.
                </p>
            </div>

            <div className="relative z-20 pb-8 sm:pb-12">
                <div className="mx-auto w-full max-w-sm">
                    <p className="text-center text-sm text-gray-300 mb-6">
                        Please log in to continue.
                    </p>
                    <button
                        onClick={onLogin}
                        className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
                    >
                        <LogIn size={20} />
                        <span>Continue with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginScreen;
