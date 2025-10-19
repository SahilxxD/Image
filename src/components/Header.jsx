import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Handshake, History, User, CreditCard, Image, LogOut } from 'lucide-react';

function Header({ currentScreen, setCurrentScreen, userProfile, onLogout }) {
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const avatarRef = useRef(null);
    // Default user data if not provided
    const defaultUser = {
        name: 'John Doe',
        avatar: null,
        initials: 'JD',
        credits: 0,
        showLogo: true
    };

    const user = userProfile || defaultUser;

    // Generate initials if no avatar is provided
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                avatarRef.current && !avatarRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleProfileDropdown = () => {
        setShowProfileDropdown(!showProfileDropdown);
    };

    const handleLogoutClick = () => {
        setShowProfileDropdown(false);
        onLogout();
    };

    return (
        <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-40">
            <div className="flex items-center justify-between max-w-lg mx-auto">
                <div className="flex items-center gap-2">


                    <div className="flex items-center gap-2">
                        <div className="w-full h-10 rounded-lg flex items-center justify-center">
                            <img
                                src="https://ik.imagekit.io/efhehcx94/1000041191%20(1).webp?updatedAt=1759397920741"
                                alt="ShotGenie Logo"
                                className="w-full h-full"
                                onClick={() => setCurrentScreen('upload')}
                            />
                        </div>

                    </div>
                </div>

                <div className="flex items-center gap-1 relative">
                    {/* History Button */}
                    <button
                        onClick={() => setCurrentScreen('clients')}
                        className="p-2 hover:bg-gray-50 rounded-lg"
                        title="View History"
                    >
                        <Handshake size={20} className="text-gray-600" />
                    </button>

                    {/* History Button */}
                    <button
                        onClick={() => setCurrentScreen('history')}
                        className="p-2 hover:bg-gray-50 rounded-lg"
                        title="View History"
                    >
                        <History size={20} className="text-gray-600" />
                    </button>

                    {/* Profile Avatar */}
                    <button
                        ref={avatarRef}
                        onClick={toggleProfileDropdown}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-purple-200 transition-all"
                    >
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-xs font-medium text-gray-600">
                                {user.initials || getInitials(user.name)}
                            </span>
                        )}
                    </button>

                    {/* Profile Dropdown */}
                    {showProfileDropdown && (
                        <div
                            ref={dropdownRef}
                            className="absolute top-10 right-0 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                        >
                            {/* User Info Section */}
                            <div className="px-4 py-3 border-b border-gray-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User size={16} className="text-gray-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <CreditCard size={12} className="text-purple-600" />
                                            <span className="text-xs text-purple-600 font-medium">{user.credits} credits</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-1">
                                {/* Logo Toggle */}
                                <div className="px-4 py-2 hover:bg-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Image size={16} className="text-gray-600" />
                                        <span className="text-sm text-gray-700">Show Logo</span>
                                    </div>
                                    <div className={`w-9 h-5 rounded-full relative transition-colors ${user.showLogo ? 'bg-purple-600' : 'bg-gray-300'}`}>
                                        <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform ${user.showLogo ? 'translate-x-5' : 'translate-x-1'}`}></div>
                                    </div>
                                </div>

                                {/* Sign Out */}
                                <button
                                    onClick={handleLogoutClick}
                                    className="w-full px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-red-600"
                                >
                                    <LogOut size={16} />
                                    <span className="text-sm">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;