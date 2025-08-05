import React, { useState,useRef,useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Heart,
    User,
    Droplets,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    Menu,
    X,
    MapPin,
    Calendar,
    Phone,
    Mail,
    ChevronDown,
    LogOut,
    Settings,
    UserCircle
} from 'lucide-react';
import { MakeAppointmentModal } from '@/components/appointments/make-appointment-modal';

interface Hospital {
    id: number;
    name: string;
    address: string;
    contact_person: string;
    phone: string;
    email: string;
}

interface BloodRequestItem {
    id: number;
    blood_request_id: number;
    hospital_name: string;
    recipient_name: string;
    bloodGroup: string;
    urgency: 'urgent' | 'normal' | 'low';
    location: string;
    address: string;
    phone: string;
    email: string;
    unitsRequested: number;
    requestDate: string;
    status: string;
    hospital: Hospital;
    created_at: string;
    updated_at: string;
}

interface PaginatedBloodRequests {
    data: BloodRequestItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface FilterOptions {
    bloodGroups: { id: number; name: string }[];
    bloodCenters: { id: number; name: string }[];
    urgencies: { value: string; label: string }[];
}

interface FiltersState {
    blood_group: string;
    urgency: string;
    search: string;
    per_page: number;
    sort_by: string;
    sort_direction: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

interface Auth {
    user: User | null;
}
interface Props {
    bloodRequests: PaginatedBloodRequests;
    filters: Partial<FiltersState>;
    filterOptions: FilterOptions;
    auth: Auth;

}

interface UserDropdownProps {
    user: User;
    isOpen: boolean;
    onClose: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ user, isOpen, onClose }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleLogout = () => {
        router.post(route('logout'), {}, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div 
            ref={dropdownRef}
            className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
        >
            <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        {user.avatar ? (
                            <img 
                                src={user.avatar} 
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                            {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {user.email}
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="py-1">
                <button
                    onClick={() => {
                       
                        onClose();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <UserCircle className="w-4 h-4 mr-3 text-gray-400" />
                    Profile
                </button>
                
                <button
                    onClick={() => {
                        // Add settings navigation here if needed
                        // router.visit(route('settings'));
                        onClose();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <Settings className="w-4 h-4 mr-3 text-gray-400" />
                    Settings
                </button>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
};

const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void; auth: Auth }> = ({ isOpen, onClose, auth }) => {
    const handleLogout = () => {
        router.post(route('logout'));
    };

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
                
                {auth?.user && (
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="flex-shrink-0">
                                {auth?.user?.avatar ? (
                                    <img 
                                        src={auth?.user?.avatar } 
                                        alt={auth?.user?.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {auth?.user?.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {auth?.user?.email}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                
                <nav className="p-4 space-y-4">
                    <a href="#" className="block text-gray-700 hover:text-red-600 transition-colors py-2">Home</a>
                    <a href="#" className="block text-gray-700 hover:text-red-600 transition-colors py-2">About</a>
                    <a href="#" className="block text-gray-700 hover:text-red-600 transition-colors py-2">Donate</a>
                    <a href="#" className="block text-gray-700 hover:text-red-600 transition-colors py-2">Contact</a>
                    
                    {auth?.user ? (
                        <div className="pt-4 border-t border-gray-200 space-y-2">
                            <a href="#" className="block text-gray-700 hover:text-red-600 transition-colors py-2">Profile</a>
                            <a href="#" className="block text-gray-700 hover:text-red-600 transition-colors py-2">Settings</a>
                            <button 
                                onClick={handleLogout}
                                className="block w-full text-left text-red-600 hover:text-red-700 transition-colors py-2"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="pt-4 border-t border-gray-200 space-y-2">
                            <a href="#" className="block text-gray-700 hover:text-red-600 transition-colors py-2">Login</a>
                            <a href={route('register-donor')} className="block bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-center">Register</a>
                        </div>
                    )}
                </nav>
            </div>
        </div>
    );
};

const Header: React.FC<{ auth: Auth }> = ({ auth }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

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
                        {auth?.user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex-shrink-0">
                                        {auth?.user?.avatar ? (
                                            <img 
                                                src={auth?.user?.avatar} 
                                                alt={auth?.user?.name}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="hidden lg:block text-left">
                                        <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                                            {auth?.user?.name}
                                        </p>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>
                                
                                <UserDropdown 
                                    user={auth?.user}
                                    isOpen={userDropdownOpen}
                                    onClose={() => setUserDropdownOpen(false)}
                                />
                            </div>
                        ) : (
                            <>
                                <a href="#" className="text-gray-700 hover:text-red-600 transition-colors font-medium text-sm lg:text-base">Login</a>
                                <a href={route('register-donor')} className="bg-red-500 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg hover:bg-red-600 transition-colors font-medium text-sm lg:text-base">Register</a>
                            </>
                        )}
                    </div>

                    <button
                        className="sm:hidden p-2 hover:bg-gray-100 rounded-lg"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} auth={auth} />
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

interface UrgencyBadgeProps {
    urgency: string;
}

const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ urgency }) => {
    const getUrgencyStyles = (urgency: string) => {
        switch (urgency) {
            case 'urgent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'normal':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium border ${getUrgencyStyles(urgency)}`}>
            {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
        </span>
    );
};

interface AppointmentCardProps {
    appointment: BloodRequestItem;
    filterOptions: FilterOptions;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, filterOptions }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<BloodRequestItem | null>(null);

    const openModal = (appointment: BloodRequestItem) => {
        setSelectedAppointment(appointment);
        setModalOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleCall = () => {
        if (appointment.phone) {
            window.location.href = `tel:${appointment.phone}`;
        }
    };

    const handleEmail = () => {
        if (appointment.email) {
            window.location.href = `mailto:${appointment.email}`;
        }
    };

    return (
        <div
            className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 w-full hover:shadow-md hover:border-gray-300 ${isHovered ? 'transform -translate-y-1' : ''
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex-shrink-0 self-center sm:self-start">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                            <div className="mb-3 sm:mb-0">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                                    {appointment.recipient_name}
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Droplets className="w-4 h-4 text-red-500 flex-shrink-0" />
                                        <span className="font-medium">
                                            Blood Group: {appointment.bloodGroup} ({appointment.unitsRequested} units)
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                        <span className="truncate">{appointment.hospital_name}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                        <span>Required by: {formatDate(appointment.requestDate)}</span>
                                    </div>
                                    {appointment.address && (
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                            <span className="truncate">{appointment.address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="self-start">
                                <UrgencyBadge urgency={appointment.urgency} />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleCall}
                                    className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors text-sm"
                                >
                                    <Phone className="w-4 h-4" />
                                    <span>Call</span>
                                </button>
                                <button
                                    onClick={handleEmail}
                                    className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors text-sm"
                                >
                                    <Mail className="w-4 h-4" />
                                    <span>Email</span>
                                </button>
                            </div>
                            <button
                                className="bg-red-500 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg hover:bg-red-600 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
                                onClick={() => openModal(appointment)}
                            >
                                Donate Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <MakeAppointmentModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                appointment={selectedAppointment ? {
                    id: selectedAppointment.id,
                    recipientName: selectedAppointment.recipient_name,
                    bloodGroup: selectedAppointment.bloodGroup,
                    urgency: selectedAppointment.urgency,
                    location: selectedAppointment.hospital_name,
                    requiredBy: formatDate(selectedAppointment.requestDate),
                } : undefined}
                bloodGroups={filterOptions.bloodGroups}
                bloodCenters={filterOptions.bloodCenters}
            />
        </div>
    );
};

interface FiltersProps {
    filters: Partial<FiltersState>;
    filterOptions: FilterOptions;
    onFilterChange: (filters: Partial<FiltersState>) => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, filterOptions, onFilterChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleFilterChange = (key: keyof FiltersState, value: string | number) => {
        onFilterChange({ ...filters, [key]: value });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between sm:hidden mb-4">
                    <div className="flex items-center space-x-2">
                        <Filter className="w-5 h-5 text-gray-500" />
                        <span className="font-medium text-gray-700">Filters</span>
                    </div>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-red-500 hover:text-red-600 transition-colors text-sm"
                    >
                        {isExpanded ? 'Hide' : 'Show'}
                    </button>
                </div>

                <div className="hidden sm:flex items-center space-x-2 mb-4">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-700">Filters:</span>
                </div>

                <div className={`${isExpanded ? 'block' : 'hidden'} sm:block`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            value={filters.blood_group || ''}
                            onChange={(e) => handleFilterChange('blood_group', e.target.value)}
                        >
                            <option value="">All Blood Groups</option>
                            {filterOptions.bloodGroups.map((group) => (
                                <option key={group.id} value={group.name}>
                                    {group.name}
                                </option>
                            ))}
                        </select>

                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            value={filters.urgency || ''}
                            onChange={(e) => handleFilterChange('urgency', e.target.value)}
                        >
                            <option value="">All Urgency Levels</option>
                            {filterOptions.urgencies.map((urgency) => (
                                <option key={urgency.value} value={urgency.value}>
                                    {urgency.label}
                                </option>
                            ))}
                        </select>

                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            value={filters.per_page || 8}
                            onChange={(e) => handleFilterChange('per_page', parseInt(e.target.value))}
                        >
                            <option value={4}>4 per page</option>
                            <option value={8}>8 per page</option>
                            <option value={12}>12 per page</option>
                            <option value={16}>16 per page</option>
                            <option value={20}>20 per page</option>
                        </select>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search hospital or contact..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                value={filters.search || ''}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = (): number[] => {
        const pages: number[] = [];
        const maxVisible = window.innerWidth < 640 ? 3 : 5;
        const start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        const end = Math.min(totalPages, start + maxVisible - 1);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    return (
        <div className="flex items-center justify-center space-x-1 sm:space-x-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-2 py-2 sm:px-3 sm:py-2 rounded-lg border transition-colors text-sm sm:text-base ${currentPage === page
                            ? 'bg-red-500 text-white border-red-500'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

const BloodDonationPage: React.FC<Props> = ({ bloodRequests, filters, filterOptions, auth }) => {
    const [currentFilters, setCurrentFilters] = useState<Partial<FiltersState>>(filters);

    const handleFilterChange = (newFilters: Partial<FiltersState>) => {
        setCurrentFilters(newFilters);
        // Use Inertia to make the request with new filters
        router.get(route('blood-requests.index'), newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.get(route('blood-requests.index'), { ...currentFilters, page }, {
            preserveState: true,
            preserveScroll: false,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Blood Donation Requests" />
            <Header auth={auth} />
            <Banner />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        Current Blood Donation Requests
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-3xl">
                        Help save lives by donating blood to those in need. Every donation makes a difference.
                    </p>
                    <div className="mt-4 text-sm text-gray-500">
                        Showing {bloodRequests.from} to {bloodRequests.to} of {bloodRequests.total} requests
                    </div>
                </div>

                <Filters
                    filters={currentFilters}
                    filterOptions={filterOptions}
                    onFilterChange={handleFilterChange}
                />

                <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {bloodRequests.data.length > 0 ? (
                        bloodRequests.data.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                filterOptions={filterOptions}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                            <p className="text-gray-600">Try adjusting your filters to see more results.</p>
                        </div>
                    )}
                </div>

                {bloodRequests.last_page > 1 && (
                    <Pagination
                        currentPage={bloodRequests.current_page}
                        totalPages={bloodRequests.last_page}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>

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

export default BloodDonationPage;