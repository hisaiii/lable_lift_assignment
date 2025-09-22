import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
    Home, Music, Upload, Sun, Moon, Menu, X, LogOut,
    BarChart3, Settings, User
} from 'lucide-react';

export default function Layout({ children }) {
    const [darkMode, setDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [username, setUsername] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Initialize dark mode from localStorage
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('darkMode');
            const isDark = savedTheme === 'true' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
            setDarkMode(isDark);

            // Get username
            const savedUsername = localStorage.getItem('username');
            setUsername(savedUsername || 'User');
        }
    }, []);

    useEffect(() => {
        // Apply dark mode to document
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        // Save to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('darkMode', darkMode.toString());
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
        }
        router.push('/login');
    };

    const navigation = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: Home,
            current: router.pathname === '/dashboard'
        },
        {
            name: 'Upload Track',
            href: '/upload',
            icon: Upload,
            current: router.pathname === '/upload'
        },
        {
            name: 'Analytics',
            href: '#',
            icon: BarChart3,
            current: false,
            disabled: true
        },
        {
            name: 'Settings',
            href: '#',
            icon: Settings,
            current: false,
            disabled: true
        }
    ];

    const NavItem = ({ item }) => {
        const Icon = item.icon;

        if (item.disabled) {
            return (
                <div className="flex items-center px-4 py-3 text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed">
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                    <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        Soon
                    </span>
                </div>
            );
        }

        return (
            <Link
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${item.current
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                onClick={() => setSidebarOpen(false)}
            >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
            </Link>
        );
    };

    return (
        <div className="min-h-screen w-full flex bg-red-500 dark:bg-gray-900 transition-colors">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                </div>
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 inset-y-0 left-0 z-50 w-64 h-full-screen  bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform md:translate-x-0 md:static md:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6  border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <Music className="w-8 h-8 text-purple-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">LabelLift</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.map((item) => (
                            <NavItem key={item.name} item={item} />
                        ))}
                          <button
                            onClick={handleLogout}
                            className="w-20px flex  px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign out
                        </button>
                    </nav>

                
                </div>
            </div>

            {/* Main content */}
            <div className="w-full ">
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            <Menu className="w-6 h-6" />
                        </button>


                        {/* <button
                            onClick={handleLogout}
                            className="w-20px flex  px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign out
                        </button> */}
                        {/* User section */}
                        <div className=" p-4">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {username}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Artist Dashboard
                                    </p>
                                </div>
                            </div>


                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}