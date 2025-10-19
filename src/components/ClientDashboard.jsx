import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Image, ArrowLeft, RefreshCw, DollarSign, Activity, MapPin, FileText } from 'lucide-react';

// Sample client data - replace with actual data from your API
const sampleClient = {
    name: "Acme Corporation",
    refPrompt: "Modern minimalist design with vibrant colors, professional photography style, high-end product shots",
    location: "Mumbai, Maharashtra",
    price: 50000,
    assets: new Array(12).fill(null),
    creditsUsed: 8500,
    retryCredits: 2800,
    totalCredits: 11300,
    imageGenerated: 145,
    retryImages: 38
};

const ClientDashboard = ({ client, setCurrentPage }) => {
    // const [client] = useState(sampleClient);
    const [showFullPrompt, setShowFullPrompt] = useState(false);

    // Calculations
    const revenueRecieved = client.imageGenerated * client.price;
    const profit = revenueRecieved - client.totalCredits;

    const profitMargin = ((profit / client.totalCredits) * 100).toFixed(2);
    const costRecovery = ((revenueRecieved / client.totalCredits) * 100).toFixed(2);
    const costPerImage = (client.totalCredits / client.imageGenerated).toFixed(2);
    const clientPaysPerImage = client.price.toFixed(2);
    const marginPerImage = ((revenueRecieved - client.totalCredits) / client.imageGenerated).toFixed(2);
    const retryRate = ((client.retryImages / client.imageGenerated) * 100).toFixed(1);
    const avgRetriesPerImage = (client.retryImages / client.imageGenerated).toFixed(2);
    const generationEfficiency = ((client.creditsUsed / client.totalCredits) * 100).toFixed(1);
    const effectiveRate = (revenueRecieved / (client.imageGenerated + client.retryImages)).toFixed(2);
    const isProfitable = profit > 0;

    const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = "blue" }) => {
        const colorClasses = {
            blue: "bg-blue-50 border-blue-200",
            green: "bg-green-50 border-green-200",
            red: "bg-red-50 border-red-200",
            orange: "bg-orange-50 border-orange-200",
            purple: "bg-purple-50 border-purple-200"
        };

        return (
            <div className={`rounded-lg border-2 p-4 ${colorClasses[color]}`}>

                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
                    </div>
                    {Icon && (
                        <div className={`p-2 rounded-lg ${color === 'green' ? 'bg-green-200' : color === 'red' ? 'bg-red-200' : color === 'orange' ? 'bg-orange-200' : color === 'purple' ? 'bg-purple-200' : 'bg-blue-200'}`}>
                            <Icon className="w-5 h-5 text-gray-700" />
                        </div>
                    )}
                </div>
                {trend && (
                    <div className="flex items-center mt-2">
                        {trend > 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {Math.abs(trend)}%
                        </span>
                    </div>
                )}
            </div>
        );
    };

    const ProgressBar = ({ label, value, max, color = "blue", showPercentage = true }) => {
        const percentage = (value / max * 100).toFixed(1);
        const colorClasses = {
            blue: "bg-blue-500",
            green: "bg-green-500",
            orange: "bg-orange-500",
            purple: "bg-purple-500"
        };

        return (
            <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <span className="text-sm text-gray-600">
                        {value.toLocaleString()} {showPercentage && `(${percentage}%)`}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${colorClasses[color]}`} style={{ width: `${percentage}%` }}></div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => {
                        setCurrentPage('actions');
                        // setUploadedFiles([]);
                        // setGeneratedResults([]);
                    }}
                    className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Actions
                </button>
            </div>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
                            <div className="flex items-center mt-2 text-gray-600">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span className="text-sm">{client.location}</span>
                            </div>
                        </div>
                        <div className={`px-4 py-2 rounded-full font-semibold ${isProfitable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {isProfitable ? '✓ Profitable' : '✗ Loss Making'}
                        </div>
                    </div>
                </div>

                {/* Primary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        title="Total Images Generated"
                        value={client.imageGenerated.toLocaleString()}
                        subtitle="Successful generations"
                        icon={Image}
                        color="blue"
                    />
                    <StatCard
                        title="Regenerations"
                        value={client.retryImages.toLocaleString()}
                        subtitle="FREE for client"
                        icon={RefreshCw}
                        color="purple"
                    />
                    <StatCard
                        title="Revenue Received"
                        value={`₹${revenueRecieved.toLocaleString()}`}
                        subtitle="Total payment"
                        icon={DollarSign}
                        color="green"
                    />
                    <StatCard
                        title={isProfitable ? "Net Profit" : "Net Loss"}
                        value={`₹${Math.abs(profit).toLocaleString()}`}
                        subtitle={`${profitMargin}% margin`}
                        icon={Activity}
                        color={isProfitable ? "green" : "red"}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Financial Overview */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Financial Overview</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Our Total Cost</span>
                                <span className="font-semibold text-gray-900">₹{client.totalCredits.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Client Payment</span>
                                <span className="font-semibold text-gray-900">₹{revenueRecieved.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Profit Margin</span>
                                <span className={`font-semibold ${parseFloat(profitMargin) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {profitMargin}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Cost Recovery</span>
                                <span className="font-semibold text-gray-900">{costRecovery}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Per-Image Breakdown */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Per-Image Analysis</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Our Cost per Image</span>
                                <span className="font-semibold text-gray-900">₹{costPerImage}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Client Pays per Image</span>
                                <span className="font-semibold text-gray-900">₹{clientPaysPerImage}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Margin per Image</span>
                                <span className={`font-semibold ${parseFloat(marginPerImage) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ₹{marginPerImage}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Effective Rate (incl. retries)</span>
                                <span className="font-semibold text-gray-900">₹{effectiveRate}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Credit Usage Details */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Credit Usage Breakdown</h2>
                    <ProgressBar
                        label="Credits for Generation"
                        value={client.creditsUsed}
                        max={client.totalCredits}
                        color="blue"
                    />
                    <ProgressBar
                        label="Credits for Retry (FREE for client)"
                        value={client.retryCredits}
                        max={client.totalCredits}
                        color="purple"
                    />
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600">Total Credits Consumed</p>
                            <p className="text-2xl font-bold text-gray-900">{client.totalCredits.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600">Generation Efficiency</p>
                            <p className="text-2xl font-bold text-gray-900">{generationEfficiency}%</p>
                            <p className="text-xs text-gray-500 mt-1">Original vs retries</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Image Statistics */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Image Statistics</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Successful Generations</span>
                                <span className="font-semibold text-gray-900">{client.imageGenerated} images</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Regenerations Requested</span>
                                <span className="font-semibold text-gray-900">{client.retryImages} images</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Regeneration Rate</span>
                                <span className={`font-semibold ${parseFloat(retryRate) > 30 ? 'text-orange-600' : 'text-gray-900'}`}>
                                    {retryRate}% {parseFloat(retryRate) > 30 && '⚠️'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600">Avg Retries per Image</span>
                                <span className="font-semibold text-gray-900">{avgRetriesPerImage}</span>
                            </div>
                        </div>
                    </div>

                    {/* Additional Insights */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Insights</h2>
                        <div className="space-y-3">
                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                <p className="text-sm text-purple-800 font-medium">Free Service Value</p>
                                <p className="text-2xl font-bold text-purple-900">₹{client.retryCredits.toLocaleString()}</p>
                                <p className="text-xs text-purple-600 mt-1">What regenerations would have cost</p>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <p className="text-sm text-blue-800 font-medium">Total Assets</p>
                                <p className="text-2xl font-bold text-blue-900">{client.assets.length}</p>
                                <p className="text-xs text-blue-600 mt-1">Resources in database</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Client Information */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Reference Prompt
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700">
                            {showFullPrompt ? client.refPrompt : `${client.refPrompt.substring(0, 150)}...`}
                        </p>
                        <button
                            onClick={() => setShowFullPrompt(!showFullPrompt)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                        >
                            {showFullPrompt ? 'Show less' : 'Show more'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;