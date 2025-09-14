import React from 'react';
import { ArrowLeft, Sparkles, Settings } from 'lucide-react';

function Header({ currentScreen, setCurrentScreen }) {
    return (
        <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-40">
            <div className="flex items-center justify-between max-w-lg mx-auto">
                <div className="flex items-center gap-2">
                    {currentScreen !== 'upload' && (
                        <button
                            onClick={() => {
                                if (currentScreen === 'fullscreen') {
                                    setCurrentScreen('gallery');
                                } else if (currentScreen === 'gallery') {
                                    setCurrentScreen('choice');
                                } else if (currentScreen === 'choice') {
                                    setCurrentScreen('upload');
                                } else if (currentScreen === 'settings') {
                                    setCurrentScreen('upload');
                                }
                            }}
                            className="p-2 hover:bg-gray-50 rounded-lg"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                    )}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <span className="font-semibold text-gray-900">Fashion AI</span>
                    </div>
                </div>
                <button
                    onClick={() => setCurrentScreen('settings')}
                    className="p-2 hover:bg-gray-50 rounded-lg"
                >
                    <Settings size={20} className="text-gray-600" />
                </button>
            </div>
        </header>
    );
}

export default Header;
