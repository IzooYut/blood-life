import React, { useState } from 'react';
import {
    Heart,
    User,
    Droplets,
    Clock,
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
} from 'lucide-react';
import { MakeAppointmentModal } from '@/components/appointments/make-appointment-modal';


interface Appointment {
    id: number;
    recipientName: string;
    bloodGroup: string;
    urgency: string;
    location: string;
    requiredBy: string;
}

interface FiltersState {
    bloodGroup: string;
    urgency: string;
    search: string;
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

// --- Header ---
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
                        <span className="text-lg sm:text-2xl font-bold text-gray-900">BloodLife</span>
                    </div>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex space-x-8">
                        <a href="#" className="text-gray-700 hover:text-red-600 transition-colors">Home</a>
                        <a href="#" className="text-gray-700 hover:text-red-600 transition-colors">About</a>
                        <a href="#" className="text-gray-700 hover:text-red-600 transition-colors">Donate</a>
                        <a href="#" className="text-gray-700 hover:text-red-600 transition-colors">Contact</a>
                    </nav>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden sm:flex items-center space-x-3 lg:space-x-4">
                        <a href="#" className="text-gray-700 hover:text-red-600 transition-colors font-medium text-sm lg:text-base">Login</a>
                        <a href="#" className="bg-red-500 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg hover:bg-red-600 transition-colors font-medium text-sm lg:text-base">Register</a>
                    </div>

                    {/* Mobile Menu Button */}
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

// --- Banner ---
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

// --- UrgencyBadge ---
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

// --- AppointmentCard ---
interface AppointmentCardProps {
    appointment: Appointment;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState(false);

    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    // const handleMakeAppointment = () => {
    //     // Handle appointment making logic here
    //     console.log('Making appointment for:', appointment.recipientName);
    // };

    const openModal = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setModalOpen(true)
    }


    return (
        <div
            className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 w-full hover:shadow-md hover:border-gray-300 ${
                isHovered ? 'transform -translate-y-1' : ''
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
                                    {appointment.recipientName}
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Droplets className="w-4 h-4 text-red-500 flex-shrink-0" />
                                        <span className="font-medium">Blood Group: {appointment.bloodGroup}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                        <span className="truncate">{appointment.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                        <span>Required by: {appointment.requiredBy}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="self-start">
                                <UrgencyBadge urgency={appointment.urgency} />
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex space-x-2">
                                <button className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors text-sm">
                                    <Phone className="w-4 h-4" />
                                    <span>Call</span>
                                </button>
                                <button className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors text-sm">
                                    <Mail className="w-4 h-4" />
                                    <span>Email</span>
                                </button>
                            </div>
                            <button
                                className="bg-red-500 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg hover:bg-red-600 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
                                onClick={()=>openModal(appointment)}
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
                appointment={selectedAppointment!}
                bloodGroups={[]}
                bloodCenters={[]}
            />
        </div>
    );
};

// --- Filters ---
interface FiltersProps {
    filters: FiltersState;
    onFilterChange: (filterType: keyof FiltersState, value: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-4 sm:p-6">
                {/* Mobile Filter Toggle */}
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

                {/* Desktop Filter Header */}
                <div className="hidden sm:flex items-center space-x-2 mb-4">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-700">Filters:</span>
                </div>

                {/* Filter Controls */}
                <div className={`${isExpanded ? 'block' : 'hidden'} sm:block`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            value={filters.bloodGroup}
                            onChange={(e) => onFilterChange('bloodGroup', e.target.value)}
                        >
                            <option value="">All Blood Groups</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>

                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            value={filters.urgency}
                            onChange={(e) => onFilterChange('urgency', e.target.value)}
                        >
                            <option value="">All Urgency Levels</option>
                            <option value="urgent">Urgent</option>
                            <option value="normal">Normal</option>
                            <option value="low">Low</option>
                        </select>

                        <div className="relative sm:col-span-2 lg:col-span-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by recipient name..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                value={filters.search}
                                onChange={(e) => onFilterChange('search', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Pagination ---
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
                    className={`px-2 py-2 sm:px-3 sm:py-2 rounded-lg border transition-colors text-sm sm:text-base ${
                        currentPage === page 
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

// --- Main Component ---
const BloodDonationPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filters, setFilters] = useState<FiltersState>({
        bloodGroup: '',
        urgency: '',
        search: '',
    });

    const mockAppointments: Appointment[] = [
        { id: 1, recipientName: "Sarah Johnson", bloodGroup: "O-", urgency: "urgent", location: "City Hospital", requiredBy: "Today" },
        { id: 2, recipientName: "Michael Chen", bloodGroup: "A+", urgency: "normal", location: "General Hospital", requiredBy: "Tomorrow" },
        { id: 3, recipientName: "Emily Rodriguez", bloodGroup: "B-", urgency: "urgent", location: "Emergency Center", requiredBy: "Today" },
        { id: 4, recipientName: "David Kim", bloodGroup: "AB+", urgency: "low", location: "Regional Hospital", requiredBy: "Next Week" },
        { id: 5, recipientName: "Lisa Thompson", bloodGroup: "O+", urgency: "normal", location: "Medical Center", requiredBy: "2 days" },
        { id: 6, recipientName: "James Wilson", bloodGroup: "A-", urgency: "urgent", location: "Children's Hospital", requiredBy: "Today" },
        { id: 7, recipientName: "Anna Martinez", bloodGroup: "B+", urgency: "normal", location: "University Hospital", requiredBy: "Tomorrow" },
        { id: 8, recipientName: "Robert Davis", bloodGroup: "O-", urgency: "urgent", location: "Memorial Hospital", requiredBy: "Today" },
    ];

    const appointmentsPerPage = 6;

    const filteredAppointments = mockAppointments.filter((a) => {
        const matchesBloodGroup = !filters.bloodGroup || a.bloodGroup === filters.bloodGroup;
        const matchesUrgency = !filters.urgency || a.urgency === filters.urgency;
        const matchesSearch = !filters.search || a.recipientName.toLowerCase().includes(filters.search.toLowerCase());
        return matchesBloodGroup && matchesUrgency && matchesSearch;
    });

    const currentAppointments = filteredAppointments.slice(
        (currentPage - 1) * appointmentsPerPage, 
        currentPage * appointmentsPerPage
    );

    const handleFilterChange = (filterType: keyof FiltersState, value: string) => {
        setFilters((prev) => ({ ...prev, [filterType]: value }));
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <Banner />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        Current Blood Donation Requests
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 max-w-3xl">
                        Help save lives by donating blood to those in need. Every donation makes a difference.
                    </p>
                </div>

                <Filters filters={filters} onFilterChange={handleFilterChange} />

                <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {currentAppointments.length > 0 ? (
                        currentAppointments.map((appointment) => (
                            <AppointmentCard key={appointment.id} appointment={appointment} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                            <p className="text-gray-600">Try adjusting your filters to see more results.</p>
                        </div>
                    )}
                </div>

                {filteredAppointments.length > appointmentsPerPage && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredAppointments.length / appointmentsPerPage)}
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
                            <span className="text-xl sm:text-2xl font-bold">BloodLife</span>
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