// BloodCentersSection.tsx
import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { 
    MapPin, 
    Phone, 
    Mail, 
    Clock, 
    Droplets,
    ChevronLeft,
    ChevronRight,
    Building2,
    Star,
    ArrowRight,
    Users,
    CheckCircle,
    XCircle,
    Heart,
    Scale,
    Calendar,
    Activity,
    AlertCircle
} from 'lucide-react';

interface BloodCenter {
    id: number;
    name: string;
    contact_person: string;
    email: string;
    phone: string;
    location: string;
    address: string;
    longitude: number;
    latitude: number;
    created_at: string;
    updated_at: string;
}

interface BloodCentersProps {
    bloodCenters: {
        data: BloodCenter[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
}

interface EligibilityCriteria {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    type: 'eligible' | 'ineligible';
}

const BloodCentersSection: React.FC<BloodCentersProps> = ({ bloodCenters }) => {
    const [currentPage, setCurrentPage] = useState(bloodCenters.current_page);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [activeEligibilityTab, setActiveEligibilityTab] = useState<'eligible' | 'ineligible'>('eligible');

    const eligibilityCriteria: EligibilityCriteria[] = [
        {
            id: 1,
            title: "Age 18-65 years",
            description: "You must be between 18 and 65 years old to donate blood safely.",
            icon: <Calendar className="w-5 h-5" />,
            type: 'eligible'
        },
        {
            id: 2,
            title: "Weight 50kg or more",
            description: "Minimum weight requirement ensures your body can safely handle blood donation.",
            icon: <Scale className="w-5 h-5" />,
            type: 'eligible'
        },
        {
            id: 3,
            title: "Good general health",
            description: "You should feel well and be in good health on the day of donation.",
            icon: <Heart className="w-5 h-5" />,
            type: 'eligible'
        },
        {
            id: 4,
            title: "Normal blood pressure",
            description: "Your blood pressure should be within normal range (90/50 - 180/100 mmHg).",
            icon: <Activity className="w-5 h-5" />,
            type: 'eligible'
        },
        {
            id: 5,
            title: "Recent illness or fever",
            description: "Wait at least 2 weeks after recovering from any illness or fever.",
            icon: <AlertCircle className="w-5 h-5" />,
            type: 'ineligible'
        },
        {
            id: 6,
            title: "Pregnancy or breastfeeding",
            description: "Pregnant or breastfeeding women should not donate blood.",
            icon: <Users className="w-5 h-5" />,
            type: 'ineligible'
        },
        {
            id: 7,
            title: "Recent medication",
            description: "Certain medications may require a waiting period before donation.",
            icon: <AlertCircle className="w-5 h-5" />,
            type: 'ineligible'
        },
        {
            id: 8,
            title: "Recent travel to malaria areas",
            description: "Wait 3-12 months after traveling to malaria-endemic areas.",
            icon: <MapPin className="w-5 h-5" />,
            type: 'ineligible'
        }
    ];

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= bloodCenters.last_page) {
            setCurrentPage(page);
            console.log(`Fetching page ${page}`);
        }
    };

    const handleViewLocation = (center: BloodCenter) => {
        console.log(`View location for ${center.name}:`, {
            lat: center.latitude,
            lng: center.longitude
        });
    };

    const handleDonate = (center: BloodCenter) => {
        router.visit('/requests-page', {
            data: {
                center_id: center.id,
                center_name: center.name
            }
        });
    };

    const getPaginationNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        const end = Math.min(bloodCenters.last_page, start + maxVisible - 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const filteredEligibilityCriteria = eligibilityCriteria.filter(
        criteria => criteria.type === activeEligibilityTab
    );

    return (
        <div className="relative bg-gradient-to-br from-slate-50 via-white to-red-50/30 py-16 sm:py-20 lg:py-28 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px]" />
            <div className="absolute top-0 right-0 -mt-40 -mr-40 w-80 h-80 bg-gradient-to-br from-red-100 to-pink-100 rounded-full opacity-60 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-40 -ml-40 w-80 h-80 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-full opacity-60 blur-3xl" />
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-6">
                        <Building2 className="w-4 h-4 mr-2" />
                        Available Blood Centers
                    </div>
                </div>

                

                {bloodCenters.data.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-100 to-pink-100 mb-8">
                            <div className="absolute inset-2 rounded-full bg-white/80 backdrop-blur-sm" />
                            <Droplets className="relative w-12 h-12 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">No Blood Centers Found</h3>
                        <p className="text-gray-600 text-lg">No blood centers are currently available in your area.</p>
                    </div>
                ) : (
                    <>
                        {/* Blood Centers Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {bloodCenters.data.map((center, index) => (
                                <div 
                                    key={center.id}
                                    className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                                        hoveredCard === center.id ? 'scale-105' : ''
                                    }`}
                                    onMouseEnter={() => setHoveredCard(center.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        animationDelay: `${index * 100}ms`
                                    }}
                                >
                                    {/* Gradient Border Effect */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/20 via-pink-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
                                    
                                    {/* Header with Icon */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex-1">
                                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                                                <Building2 className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
                                                {center.name}
                                            </h3>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 mr-3">
                                            <MapPin className="w-4 h-4 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{center.location}</p>
                                            <p className="text-sm text-gray-500">{center.address}</p>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center text-gray-600">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 mr-3">
                                                <Phone className="w-4 h-4 text-green-500" />
                                            </div>
                                            <span className="text-sm font-medium">{center.phone}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 mr-3">
                                                <Mail className="w-4 h-4 text-purple-500" />
                                            </div>
                                            <span className="text-sm font-medium truncate">{center.email}</span>
                                        </div>
                                        {center.contact_person && (
                                            <div className="flex items-center text-gray-600">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 mr-3">
                                                    <Clock className="w-4 h-4 text-orange-500" />
                                                </div>
                                                <span className="text-sm font-medium">Contact: {center.contact_person}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleViewLocation(center)}
                                            className="flex-1 group/btn relative overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-lg"
                                        >
                                            <span className="relative flex items-center justify-center">
                                                <MapPin className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
                                                <span className="text-sm">Location</span>
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => handleDonate(center)}
                                            className="flex-1 group/btn relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25"
                                        >
                                            <span className="relative flex items-center justify-center">
                                                <Droplets className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                                                <span className="text-sm">Donate</span>
                                                <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all duration-300" />
                                            </span>
                                            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left" />
                                        </button>
                                    </div>

                                    {/* Hover Effect Overlay */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                </div>
                            ))}
                        </div>

                        {/* Enhanced Pagination */}
                        {bloodCenters.last_page > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between space-y-6 sm:space-y-0 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                {/* Results Info */}
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
                                        <Building2 className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        Showing <span className="font-bold text-red-600">{bloodCenters.from}</span> to <span className="font-bold text-red-600">{bloodCenters.to}</span> of <span className="font-bold text-red-600">{bloodCenters.total}</span> centers
                                    </span>
                                </div>

                                {/* Pagination Controls */}
                                <div className="flex items-center space-x-2">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`group flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                                            currentPage === 1 
                                                ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                                                : 'text-gray-700 hover:text-white bg-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 shadow-sm hover:shadow-lg'
                                        }`}
                                    >
                                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300" />
                                    </button>

                                    {/* Page Numbers */}
                                    {getPaginationNumbers().map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`group flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold transition-all duration-300 ${
                                                page === currentPage
                                                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/25'
                                                    : 'text-gray-700 hover:text-white bg-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 shadow-sm hover:shadow-lg'
                                            }`}
                                        >
                                            <span className="group-hover:scale-110 transition-transform duration-300">
                                                {page}
                                            </span>
                                        </button>
                                    ))}

                                    {/* Next Button */}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === bloodCenters.last_page}
                                        className={`group flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${
                                            currentPage === bloodCenters.last_page 
                                                ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                                                : 'text-gray-700 hover:text-white bg-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 shadow-sm hover:shadow-lg'
                                        }`}
                                    >
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BloodCentersSection;