import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
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

const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

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
                    <a href="#" className="block text-gray-700 hover:text-red-600 transition-colors py-2">Home</a>
                    <a href="#" className="block text-gray-700 hover:text-red-600 transition-colors py-2">About</a>
                    <a href="#" className="block text-gray-700 hover:text-red-600 transition-colors py-2">Donate</a>
                    <a href="#" className="block text-gray-700 hover:text-red-600 transition-colors py-2">Contact</a>
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
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14 sm:h-16">
                    <div className="flex items-center space-x-2">
                        <div className="bg-red-500 p-1.5 sm:p-2 rounded-full">
                            <Heart className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <span className="text-lg sm:text-2xl font-bold text-gray-900">DonationLife</span>
                    </div>
                    
                    <nav className="hidden lg:flex space-x-8">
                        <a href="#" className="text-gray-700 hover:text-red-600 transition-colors">Home</a>
                        <a href="#" className="text-gray-700 hover:text-red-600 transition-colors">About</a>
                        <a href="#" className="text-gray-700 hover:text-red-600 transition-colors">Donate</a>
                        <a href="#" className="text-gray-700 hover:text-red-600 transition-colors">Contact</a>
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
    <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-8 sm:py-12 lg:py-16">
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
    <div className="bg-gray-50 py-8 sm:py-12 lg:py-16">
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
    <div className="bg-gray-50 py-8 sm:py-12 lg:py-16">
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
                <a href="#" className="bg-red-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors border-2 border-red-700 flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Find Donation Center</span>
                </a>
            </div>
        </div>
    </div>
);

const  HomePage: React.FC<HomePageProps> = ({ blood_centers }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="DonationLife - Save Lives Through Blood Donation" />
            <Header />
            <Banner />
            <WhyDonateSection />
            <StatsSection />
            <ProcessSection />
            <BloodCentersSection bloodCenters={blood_centers}/>
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
                                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">How to Donate</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Find Centers</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
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