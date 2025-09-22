import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../components/Layout';
import { Search, Filter, Eye, Calendar, Music, TrendingUp, Users, DollarSign, Menu, X, ChevronDown } from 'lucide-react';

export default function Dashboard() {
  const [tracks, setTracks] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');
  const [stats, setStats] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (!isLoggedIn) {
        router.push('/login');
        return;
      }
    }

    fetchTracks();
  }, [router]);

  useEffect(() => {
    // Apply filters
    applyFilters();
  }, [tracks, searchTerm, statusFilter, genreFilter]);

  const fetchTracks = async () => {
    try {
      const response = await fetch('/api/tracks');
      const data = await response.json();
      setTracks(data.tracks || []);
      calculateStats(data.tracks || []);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (tracksData) => {
    const totalTracks = tracksData.length;
    const publishedTracks = tracksData.filter(track => track.status === 'Published').length;
    const totalPlays = tracksData.reduce((sum, track) => sum + track.plays, 0);
    const totalRevenue = tracksData.reduce((sum, track) => sum + track.revenue, 0);

    setStats({
      totalTracks,
      publishedTracks,
      totalPlays,
      totalRevenue
    });
  };

  const applyFilters = () => {
    let filtered = tracks;

    if (searchTerm) {
      filtered = filtered.filter(track =>
        track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(track =>
        track.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (genreFilter !== 'all') {
      filtered = filtered.filter(track =>
        track.genre.toLowerCase() === genreFilter.toLowerCase()
      );
    }

    setFilteredTracks(filtered);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700';
      case 'under review': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - LabelLift</title>
        <meta name="description" content="Music Distribution Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      
      <Layout>
        <div className="max-w-full overflow-hidden">
          <div className="space-y-4 md:space-y-6">
            {/* Header - Enhanced Responsive Layout */}
            <div className="flex flex-col space-y-3 sm:space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
                  Dashboard
                </h1>
                <p className="mt-1 text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400">
                  Manage your music distribution
                </p>
              </div>
              <Link
                href="/upload"
                className="inline-flex items-center justify-center px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 bg-purple-600 text-white text-sm sm:text-base lg:text-lg font-medium rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-200 w-full sm:w-auto"
              >
                <Music className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap">Upload Track</span>
              </Link>
            </div>

            {/* Stats Cards - Improved Responsive Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 truncate">
                      Total Tracks
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stats.totalTracks || 0}
                    </p>
                  </div>
                  <Music className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-purple-600 flex-shrink-0" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 truncate">
                      Published
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {stats.publishedTracks || 0}
                    </p>
                  </div>
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-600 flex-shrink-0" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 truncate">
                      Total Plays
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      <span className="sm:hidden">{formatNumber(stats.totalPlays || 0)}</span>
                      <span className="hidden sm:inline">{(stats.totalPlays || 0).toLocaleString()}</span>
                    </p>
                  </div>
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-600 flex-shrink-0" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 truncate">
                      Revenue
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      ${(stats.totalRevenue || 0).toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-orange-600 flex-shrink-0" />
                </div>
              </div>
            </div>

            {/* Filters - Enhanced Mobile Responsive */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              {/* Mobile Filter Toggle */}
              <div className="flex items-center justify-between p-4 md:hidden border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                  Filters & Search
                </h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  {showFilters ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Filter className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Filter Content */}
              <div className={`transition-all duration-300 ${showFilters ? 'block' : 'hidden md:block'}`}>
                <div className="p-4 md:p-6">
                  <div className="space-y-4 md:space-y-0 md:flex md:flex-col lg:flex-row lg:gap-4">
                    {/* Search Input */}
                    <div className="flex-1 lg:max-w-md xl:max-w-lg">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search tracks, artists, or genres..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                        />
                      </div>
                    </div>
                    
                    {/* Filter Dropdowns */}
                    <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                      <div className="relative">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full sm:w-auto appearance-none px-4 py-2.5 md:py-3 pr-8 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 cursor-pointer"
                        >
                          <option value="all">All Status</option>
                          <option value="published">Published</option>
                          <option value="under review">Under Review</option>
                          <option value="draft">Draft</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>

                      <div className="relative">
                        <select
                          value={genreFilter}
                          onChange={(e) => setGenreFilter(e.target.value)}
                          className="w-full sm:w-auto appearance-none px-4 py-2.5 md:py-3 pr-8 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200 cursor-pointer"
                        >
                          <option value="all">All Genres</option>
                          <option value="pop">Pop</option>
                          <option value="electronic">Electronic</option>
                          <option value="folk">Folk</option>
                          <option value="edm">EDM</option>
                          <option value="indie rock">Indie Rock</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracks Table - Enhanced Responsive Design */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Mobile Card View */}
              <div className="block lg:hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTracks.length === 0 ? (
                    <div className="p-8 text-center">
                      <Music className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 text-base">
                        No tracks found matching your criteria
                      </p>
                    </div>
                  ) : (
                    filteredTracks.map((track) => (
                      <div key={track.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
                                {track.title}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                by {track.artistName}
                              </p>
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(track.status)} flex-shrink-0`}>
                              {track.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Genre: </span>
                              <span className="text-gray-900 dark:text-white">{track.genre}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Date: </span>
                              <span className="text-gray-900 dark:text-white">{formatDate(track.releaseDate)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                            <div className="text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Plays: </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                <span className="sm:hidden">{formatNumber(track.plays)}</span>
                                <span className="hidden sm:inline">{track.plays.toLocaleString()}</span>
                              </span>
                            </div>
                            <Link
                              href={`/track/${track.id}`}
                              className="inline-flex items-center px-3 py-2 text-sm text-purple-600 hover:text-white hover:bg-purple-600 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-600 border border-purple-200 dark:border-purple-800 rounded-md transition-all duration-200"
                            >
                              <Eye className="w-4 h-4 mr-1 flex-shrink-0" />
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Desktop/Tablet Table View */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 xl:px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Track
                        </th>
                        <th className="px-4 xl:px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Artist
                        </th>
                        <th className="px-4 xl:px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Release Date
                        </th>
                        <th className="px-4 xl:px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Genre
                        </th>
                        <th className="px-4 xl:px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 xl:px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Plays
                        </th>
                        <th className="px-4 xl:px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredTracks.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-12 text-center">
                            <Music className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 text-base">
                              No tracks found matching your criteria
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredTracks.map((track) => (
                          <tr key={track.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            <td className="px-4 xl:px-6 py-4">
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-48">
                                  {track.title}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {track.duration}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 xl:px-6 py-4">
                              <div className="text-sm text-gray-900 dark:text-white truncate max-w-36">
                                {track.artistName}
                              </div>
                            </td>
                            <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {formatDate(track.releaseDate)}
                            </td>
                            <td className="px-4 xl:px-6 py-4">
                              <div className="text-sm text-gray-900 dark:text-white truncate max-w-24">
                                {track.genre}
                              </div>
                            </td>
                            <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(track.status)}`}>
                                <span className="truncate max-w-24">{track.status}</span>
                              </span>
                            </td>
                            <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {track.plays.toLocaleString()}
                            </td>
                            <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                              <Link
                                href={`/track/${track.id}`}
                                className="inline-flex items-center px-3 py-1 text-sm text-purple-600 hover:text-white hover:bg-purple-600 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-600 border border-purple-200 dark:border-purple-800 rounded-md transition-all duration-200"
                              >
                                <Eye className="w-4 h-4 mr-1 flex-shrink-0" />
                                <span>View</span>
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            {(searchTerm || statusFilter !== 'all' || genreFilter !== 'all') && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                  Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredTracks.length}</span> of <span className="font-semibold text-gray-900 dark:text-white">{tracks.length}</span> tracks
                </p>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}