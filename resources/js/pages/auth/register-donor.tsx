import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
    Heart,
    User,
    Droplets,
    Clock,
    Menu,
    X,
    Phone,
    Mail,
    Calendar,
    UserPlus,
    Shield,
    Award,
    CheckCircle,
} from 'lucide-react';

interface BloodGroup {
    id: number;
    name: string;
}

interface Props {
    bloodGroups: BloodGroup[];
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
                        <a href="#" className="block text-gray-700 hover:text-red-600 transition-colors py-2">Login</a>
                        <a href="#" className="block bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-center">Register</a>
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
                        <a href="#" className="text-gray-700 hover:text-red-600 transition-colors font-medium text-sm lg:text-base">Login</a>
                        <a href="#" className="bg-red-500 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg hover:bg-red-600 transition-colors font-medium text-sm lg:text-base">Register</a>
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
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 text-sm sm:text-base lg:text-lg">
                <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>Every 2 seconds someone needs blood</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Droplets className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span>1 donation saves 3 lives</span>
                </div>
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

const DonorRegistrationForm: React.FC<{ bloodGroups: BloodGroup[] }> = ({ bloodGroups }) => {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        gender: '',
        dob: '',
        phone: '',
        email: '',
        password: '',
        password_confirmation: '',
        blood_group_id: '',
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/create-donor', {
            onSuccess: () => {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 5000);
            },
        });
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    return (
        <div className="bg-white py-8 sm:py-12 lg:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-12">
                    <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Register as a Donor
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                        Join our community of life-savers. Fill out the form below to register as a blood donor.
                    </p>
                </div>

                {showSuccess && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <p className="text-green-800 font-medium">
                            Registration successful! Thank you for joining our donor community.
                        </p>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 lg:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${errors.first_name ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your first name"
                                    required
                                />
                                {errors.first_name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${errors.last_name ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your last name"
                                    required
                                />
                                {errors.last_name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gender <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${errors.gender ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    required
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.gender && (
                                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date of Birth <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formatDate(data.dob)}
                                    onChange={(e) => setData('dob', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${errors.dob ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    required
                                />
                                {errors.dob && (
                                    <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${errors.phone ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your phone number"
                                    required
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${errors.email ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your email address"
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${errors.phone ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="••••••••"
                                    required
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${errors.email ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="••••••••"
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Blood Group <span className="text-red-500"></span>
                            </label>
                            <select
                                value={data.blood_group_id}
                                onChange={(e) => setData('blood_group_id', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${errors.blood_group_id ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Select your blood group</option>
                                {bloodGroups.map((bg) => (
                                    <option key={bg.id} value={bg.id}>
                                        {bg.name}
                                    </option>
                                ))}
                            </select>
                            {errors.blood_group_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.blood_group_id}</p>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full bg-red-500 text-white py-3 px-6 rounded-lg font-medium text-lg hover:bg-red-600 transition-colors ${processing ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {processing ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Registering...</span>
                                    </div>
                                ) : (
                                    'Register as Donor'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const RegisterDonor: React.FC<Props> = ({ bloodGroups }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Blood Donation - Register as Donor" />
            <Header />
            {/* <Banner /> */}
            {/* <WhyDonateSection /> */}
            <DonorRegistrationForm bloodGroups={bloodGroups} />

            <footer className="bg-gray-800 text-white py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <div className="bg-red-500 p-2 rounded-full">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl sm:text-2xl font-bold">DonationLife</span>
                        </div>
                        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
                            Connecting donors with those in need. Together, we save lives.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default RegisterDonor;