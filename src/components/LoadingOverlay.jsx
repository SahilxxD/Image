import React from 'react';
import { Zap } from 'lucide-react';

function LoadingOverlay({ isGenerating, customizeOptions }) {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap size={24} className="text-white animate-pulse" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Generating images...</h3>
                <p className="text-sm text-gray-600 mb-4">Creating {customizeOptions.batchSize} variations with AI</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
            </div>
        </div>
    );
}

export default LoadingOverlay;
