import React from 'react';
import { Palette, ChevronRight } from 'lucide-react';

function SettingsScreen() {
    return (
        <div className="p-4 space-y-6">
            <div>
                <h1 className="text-lg font-semibold text-gray-900 mb-2">Settings</h1>
                <p className="text-sm text-gray-600">Manage your preferences and export settings</p>
            </div>

            <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h2 className="font-medium text-gray-900 mb-3">Brand Kit</h2>
                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Palette size={16} className="text-purple-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-900">Color Palette</span>
                            </div>
                            <ChevronRight size={16} className="text-gray-400" />
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h2 className="font-medium text-gray-900 mb-3">Export Profiles</h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">High-resolution exports</span>
                            <div className="w-11 h-6 bg-purple-600 rounded-full relative">
                                <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Watermark removal</span>
                            <div className="w-11 h-6 bg-gray-300 rounded-full relative">
                                <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsScreen;
