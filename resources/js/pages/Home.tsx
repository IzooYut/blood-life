import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import {
    Heart,
    Droplets,
    Menu,
    X,
    Phone,
    Mail,
    UserPlus,
    Shield,
    Award,
    Clock,
    MapPin,
    Activity,
    Users,
    CheckCircle,
    XCircle,
    Scale,
    Calendar,
    AlertCircle,
    Building2,
    ArrowRight
} from 'lucide-react';
import BloodCentersSection from '@/components/blood_centers/blood-centers-section';

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

interface HomePageProps {
    blood_centers: {
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

const smoothScroll = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }
};

const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleNavClick = (sectionId: string) => {
        smoothScroll(sectionId);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
            <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <span className="text-lg font-semibold">Menu</span>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <nav className="p-4 space-y-4">
                    <button onClick={() => handleNavClick('home')} className="block w-full text-left text-gray-700 hover:text-red-600 transition-colors py-2">Home</button>
                    <button onClick={() => handleNavClick('why-donate')} className="block w-full text-left text-gray-700 hover:text-red-600 transition-colors py-2">Why Donate</button>
                    <button onClick={() => handleNavClick('eligibility')} className="block w-full text-left text-gray-700 hover:text-red-600 transition-colors py-2">Eligibility</button>
                    <button onClick={() => handleNavClick('process')} className="block w-full text-left text-gray-700 hover:text-red-600 transition-colors py-2">Process</button>
                    <button onClick={() => handleNavClick('blood-centers')} className="block w-full text-left text-gray-700 hover:text-red-600 transition-colors py-2">Blood Centers</button>
                    <a href={route('requests-page')} className="block text-gray-700 hover:text-red-600 transition-colors py-2">Find Recipients</a>
                    <div className="pt-4 border-t border-gray-200 space-y-2">
                        <a href={route('login')} className="block text-gray-700 hover:text-red-600 transition-colors py-2">Login</a>
                        <a href={route('register-donor')} className="block bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-center">Register</a>
                    </div>
                </nav>
            </div>
        </div>
    );
};

const Header: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14 sm:h-16">
                    <div className="flex items-center space-x-2">
                        <div className="bg-red-500 p-1.5 sm:p-2 rounded-full">
                            <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <span className="text-lg sm:text-2xl font-bold text-gray-900">DonationLife</span>
                    </div>
                    
                    <nav className="hidden lg:flex space-x-8">
                        <button onClick={() => smoothScroll('home')} className="text-gray-700 hover:text-red-600 transition-colors">Home</button>
                        <button onClick={() => smoothScroll('why-donate')} className="text-gray-700 hover:text-red-600 transition-colors">Why Donate</button>
                        <button onClick={() => smoothScroll('eligibility')} className="text-gray-700 hover:text-red-600 transition-colors">Eligibility</button>
                        <button onClick={() => smoothScroll('process')} className="text-gray-700 hover:text-red-600 transition-colors">Process</button>
                        <button onClick={() => smoothScroll('blood-centers')} className="text-gray-700 hover:text-red-600 transition-colors">Centers</button>
                    </nav>

                    <div className="hidden sm:flex items-center space-x-3 lg:space-x-4">
                        <a href={route('login')} className="text-gray-700 hover:text-red-600 transition-colors font-medium text-sm lg:text-base">Login</a>
                        <a href={route('register-donor')} className="bg-red-500 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg hover:bg-red-600 transition-colors font-medium text-sm lg:text-base">Register</a>
                    </div>

                    <button 
                        className="sm:hidden p-2 hover:bg-gray-100 rounded-lg"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </header>
    );
};

const Banner: React.FC = () => (
    <div id="home" className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                Save Lives Through Blood Donation
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 opacity-90 max-w-4xl mx-auto">
                Your donation can give someone a second chance at life. Join our community of heroes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 text-sm sm:text-base lg:text-lg mb-8">
                <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Every 2 seconds someone needs blood</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Droplets className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>1 donation saves 3 lives</span>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <a href={route('requests-page')} className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Find Recipients
                </a>
                <a href={route('register-donor')} className="bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors border-2 border-red-700">
                    Register as Donor
                </a>
            </div>
        </div>
    </div>
);

const WhyDonateSection: React.FC = () => (
    <div id="why-donate" className="bg-gray-50 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    Why Donate Blood?
                </h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                    Blood donation is one of the most significant contributions you can make to society.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200 text-center">
                    <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Save Lives</h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                        One blood donation can save up to three lives. Your contribution directly impacts families and communities.
                    </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200 text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Health Benefits</h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Regular blood donation can help maintain healthy iron levels and reduce the risk of heart disease.
                    </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200 text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Community Impact</h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Join a network of heroes who regularly contribute to their community's health and well-being.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const EligibilitySection: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'eligible' | 'ineligible'>('eligible');

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

    const filteredCriteria = eligibilityCriteria.filter(criteria => criteria.type === activeTab);

    return (
        <div id="eligibility" className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 py-16 sm:py-20 lg:py-28 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px]" />
            <div className="absolute top-0 right-0 -mt-40 -mr-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-60 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-40 -ml-40 w-80 h-80 bg-gradient-to-tr from-green-100 to-emerald-100 rounded-full opacity-60 blur-3xl" />
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                        <Users className="w-4 h-4 mr-2" />
                        Donation Eligibility
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-6 leading-tight">
                        Who Can
                        <span className="block text-blue-600">Donate Blood?</span>
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Learn about the requirements and restrictions for blood donation to ensure safe and successful donations.
                    </p>
                </div>

                {/* Eligibility Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
                        <button
                            onClick={() => setActiveTab('eligible')}
                            className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                activeTab === 'eligible'
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Eligible Criteria
                        </button>
                        <button
                            onClick={() => setActiveTab('ineligible')}
                            className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                activeTab === 'ineligible'
                                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/25'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            <XCircle className="w-5 h-5 mr-2" />
                            Restrictions
                        </button>
                    </div>
                </div>

                {/* Eligibility Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {filteredCriteria.map((criteria, index) => (
                        <div 
                            key={criteria.id}
                            className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                            style={{
                                animationDelay: `${index * 100}ms`
                            }}
                        >
                            {/* Icon */}
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300 ${
                                criteria.type === 'eligible' 
                                    ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                                    : 'bg-gradient-to-br from-red-500 to-pink-600'
                            }`}>
                                <div className="text-white">
                                    {criteria.icon}
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className={`text-lg font-bold mb-3 group-hover:transition-colors duration-300 ${
                                criteria.type === 'eligible' 
                                    ? 'text-gray-900 group-hover:text-green-600' 
                                    : 'text-gray-900 group-hover:text-red-600'
                            }`}>
                                {criteria.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                                {criteria.description}
                            </p>

                            {/* Status Badge */}
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-4 ${
                                criteria.type === 'eligible'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                            }`}>
                                {criteria.type === 'eligible' ? (
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                ) : (
                                    <XCircle className="w-3 h-3 mr-1" />
                                )}
                                {criteria.type === 'eligible' ? 'Eligible' : 'Not Eligible'}
                            </div>

                            {/* Hover Effect Overlay */}
                            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                                criteria.type === 'eligible'
                                    ? 'bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5'
                                    : 'bg-gradient-to-br from-red-500/5 via-transparent to-pink-500/5'
                            }`} />
                        </div>
                    ))}
                </div>

                {/* Important Notice */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
                    <div className="flex items-start">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-yellow-100 mr-4 mt-1">
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Important Notice</h4>
                            <p className="text-gray-700 leading-relaxed">
                                This is general eligibility information. Final eligibility will be determined by medical professionals at the donation center through a health screening questionnaire and brief medical examination. Always consult with healthcare providers if you have specific concerns about your ability to donate blood.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-12">
                    <button
                        onClick={() => smoothScroll('blood-centers')}
                        className="group inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                    >
                        <Building2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                        <span>Find Blood Centers</span>
                        <ArrowRight className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const StatsSection: React.FC = () => (
    <div className="bg-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    Blood Donation Facts
                </h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                    Understanding the impact of blood donation helps us appreciate its importance.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                <div className="text-center">
                    <div className="bg-red-500 text-white text-2xl sm:text-3xl lg:text-4xl font-bold py-4 px-6 rounded-lg mb-4">
                        4.5M
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Lives Saved</h3>
                    <p className="text-gray-600 text-sm">Lives saved annually through blood donations</p>
                </div>
                
                <div className="text-center">
                    <div className="bg-blue-500 text-white text-2xl sm:text-3xl lg:text-4xl font-bold py-4 px-6 rounded-lg mb-4">
                        6.8M
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Donors</h3>
                    <p className="text-gray-600 text-sm">People donate blood annually</p>
                </div>
                
                <div className="text-center">
                    <div className="bg-green-500 text-white text-2xl sm:text-3xl lg:text-4xl font-bold py-4 px-6 rounded-lg mb-4">
                        38%
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Eligible</h3>
                    <p className="text-gray-600 text-sm">Of population eligible to donate</p>
                </div>
                
                <div className="text-center">
                    <div className="bg-purple-500 text-white text-2xl sm:text-3xl lg:text-4xl font-bold py-4 px-6 rounded-lg mb-4">
                        56
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Days</h3>
                    <p className="text-gray-600 text-sm">Between donations for most people</p>
                </div>
            </div>
        </div>
    </div>
);

const ProcessSection: React.FC = () => (
    <div id="process" className="bg-gray-50 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    The Donation Process
                </h2>
                <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                    Donating blood is a simple, safe process that takes about an hour of your time.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
                <div className="text-center">
                    <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Registration</h3>
                    <p className="text-gray-600 text-sm">
                        Sign up and provide basic information about your health and identity.
                    </p>
                </div>
                
                <div className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Health Screening</h3>
                    <p className="text-gray-600 text-sm">
                        A quick health check to ensure you're eligible to donate safely.
                    </p>
                </div>
                
                <div className="text-center">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Droplets className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Donation</h3>
                    <p className="text-gray-600 text-sm">
                        The actual donation takes about 10-15 minutes in a comfortable setting.
                    </p>
                </div>
                
                <div className="text-center">
                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-purple-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Recovery</h3>
                    <p className="text-gray-600 text-sm">
                        Rest and enjoy refreshments while your body begins to replenish.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const CallToActionSection: React.FC = () => (
    <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Ready to Make a Difference?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                Join thousands of heroes who regularly donate blood and help save lives in their communities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <a href={route('register-donor')} className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2">
                    <UserPlus className="w-5 h-5" />
                    <span>Register as Donor</span>
                </a>
                <button 
                    onClick={() => smoothScroll('blood-centers')}
                    className="bg-red-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors border-2 border-red-700 flex items-center space-x-2"
                >
                    <MapPin className="w-5 h-5" />
                    <span>Find Donation Center</span>
                </button>
            </div>
        </div>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ blood_centers }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="DonationLife - Save Lives Through Blood Donation" />
            <Header />
            <Banner />
            <WhyDonateSection />
            <EligibilitySection />
            <StatsSection />
            <ProcessSection />
            <div id="blood-centers">
                <BloodCentersSection bloodCenters={blood_centers}/>
            </div>
            <CallToActionSection />

            
            <footer className="bg-gray-800 text-white py-8 mt-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="bg-red-500 p-2 rounded-full">
                                    <Heart className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl sm:text-2xl font-bold">DonationLife</span>
                            </div>
                            <p className="text-gray-400 mb-4">
                                Connecting donors with those in need. Together, we save lives and build stronger communities.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><button onClick={() => smoothScroll('home')} className="hover:text-white transition-colors">Home</button></li>
                                <li><button onClick={() => smoothScroll('why-donate')} className="hover:text-white transition-colors">Why Donate</button></li>
                                <li><button onClick={() => smoothScroll('eligibility')} className="hover:text-white transition-colors">Eligibility</button></li>
                                <li><button onClick={() => smoothScroll('blood-centers')} className="hover:text-white transition-colors">Find Centers</button></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4" />
                                    <span>0712345678</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <Mail className="w-4 h-4" />
                                    <span>info@DonationLife.com</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>Emergency 24/7</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 DonationLife. All rights reserved. Saving lives, one donation at a time.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;