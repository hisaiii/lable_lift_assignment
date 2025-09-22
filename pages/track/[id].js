import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { 
  ArrowLeft, Music, Calendar, Tag, User, Play, Download, Share2, 
  TrendingUp, DollarSign, Clock, FileType, Instagram, Twitter, 
  ExternalLink, Globe, AlertCircle, ChevronDown, ChevronUp 
} from 'lucide-react';

export default function TrackPage() {
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLyrics, setShowLyrics] = useState(false);
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // Check authentication
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (!isLoggedIn) {
        router.push('/login');
        return;
      }
    }

    if (id) {
      fetchTrackDetails(id);
    }
  }, [id, router]);

  const fetchTrackDetails = async (trackId) => {
    try {
      const response = await fetch(`/api/tracks/${trackId}`);
      const data = await response.json();

      if (response.ok) {
        setTrack(data.track);
      } else {
        setError(data.error || 'Track not found');
      }
    } catch (error) {
      console.error('Error fetching track details:', error);
      setError('Failed to load track details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'under review': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${track.title} by ${track.artistName}`,
        text: `Check out this track: ${track.title} by ${track.artistName}`,
        url: window.location.href
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Track URL copied to clipboard!');
    }
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

  if (error || !track) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-12 px-4 sm:px-6 lg:px-8">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Track Not Found</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{track.title} by {track.artistName} - LabelLift</title>
        <meta name="description" content={`Track details for ${track.title} by ${track.artistName}`} />
      </Head>
      
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header - Mobile Responsive */}
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Back to Dashboard</span>
              <span className="xs:hidden">Back</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content - Mobile First */}
            <div className="xl:col-span-2 space-y-4 sm:space-y-6">
              {/* Track Header - Mobile Optimized */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 break-words">
                      {track.title}
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-3">
                      by {track.artistName}
                    </p>
                    <span className={`inline-flex px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full border ${getStatusColor(track.status)}`}>
                      {track.status}
                    </span>
                  </div>
                  
                  <div className="flex justify-end sm:justify-start">
                    <button
                      onClick={handleShare}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      title="Share track"
                    >
                      <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                {track.description && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                      {track.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Track Stats - Mobile Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Plays</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                        {track.plays?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 flex-shrink-0" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                        ${(track.revenue || 0).toFixed(2)}
                      </p>
                    </div>
                    <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Duration</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                        {track.duration || 'N/A'}
                      </p>
                    </div>
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
                  </div>
                </div>
              </div>

              {/* Distribution Status - Mobile Responsive */}
              {track.distributedTo && track.distributedTo.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Distribution Status
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                    {track.distributedTo.map((platform, index) => (
                      <div
                        key={index}
                        className={`p-2 sm:p-3 rounded-lg text-xs sm:text-sm text-center font-medium ${
                          platform === 'Pending Review' || platform === 'Not Yet Distributed'
                            ? 'bg-yellow-50 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
                            : 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                        }`}
                      >
                        {platform}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lyrics Section - Mobile Collapsible */}
              {track.lyrics && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowLyrics(!showLyrics)}
                    className="w-full p-4 sm:p-6 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors sm:cursor-pointer"
                  >
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Lyrics
                    </h2>
                    <div className="sm:hidden">
                      {showLyrics ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  <div className={`${showLyrics ? 'block' : 'hidden'} sm:block px-4 pb-4 sm:px-6 sm:pb-6 sm:pt-0`}>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
                      <pre className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line font-normal leading-relaxed">
                        {track.lyrics}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Mobile Stack */}
            <div className="space-y-4 sm:space-y-6">
              {/* Track Details */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Track Details
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center text-sm">
                    <User className="w-4 h-4 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400 w-16 sm:w-20 flex-shrink-0">Artist:</span>
                    <span className="text-gray-900 dark:text-white font-medium truncate">{track.artistName}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Tag className="w-4 h-4 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400 w-16 sm:w-20 flex-shrink-0">Genre:</span>
                    <span className="text-gray-900 dark:text-white font-medium truncate">{track.genre}</span>
                  </div>
                  
                  <div className="flex items-start text-sm">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400 w-16 sm:w-20 flex-shrink-0">Released:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{formatDate(track.releaseDate)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400 w-16 sm:w-20 flex-shrink-0">Duration:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{track.duration || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* File Information */}
              {(track.format || track.bitrate || track.fileSize || track.uploadDate) && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    File Information
                  </h2>
                  <div className="space-y-3 sm:space-y-4">
                    {track.format && (
                      <div className="flex items-center text-sm">
                        <FileType className="w-4 h-4 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400 w-16 sm:w-20 flex-shrink-0">Format:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{track.format}</span>
                      </div>
                    )}
                    
                    {track.bitrate && (
                      <div className="flex items-center text-sm">
                        <Music className="w-4 h-4 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400 w-16 sm:w-20 flex-shrink-0">Bitrate:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{track.bitrate}</span>
                      </div>
                    )}
                    
                    {track.fileSize && (
                      <div className="flex items-center text-sm">
                        <Download className="w-4 h-4 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400 w-16 sm:w-20 flex-shrink-0">Size:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{track.fileSize}</span>
                      </div>
                    )}
                    
                    {track.uploadDate && (
                      <div className="flex items-start text-sm">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400 w-16 sm:w-20 flex-shrink-0">Uploaded:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{formatDate(track.uploadDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Social Links - Mobile Collapsible */}
              {track.socialLinks && Object.keys(track.socialLinks).length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setShowSocialLinks(!showSocialLinks)}
                    className="w-full p-4 sm:p-6 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors sm:cursor-default"
                  >
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Artist Social Links
                    </h2>
                    <div className="sm:hidden">
                      {showSocialLinks ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  <div className={`${showSocialLinks ? 'block' : 'hidden'} sm:block px-4 pb-4 sm:px-6 sm:pb-6 sm:pt-0`}>
                    <div className="space-y-2 sm:space-y-3">
                      {track.socialLinks.instagram && (
                        <a
                          href={`https://instagram.com/${track.socialLinks.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <Instagram className="w-4 h-4 mr-2 sm:mr-3 flex-shrink-0" />
                          <span className="truncate flex-1">{track.socialLinks.instagram}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      )}
                      
                      {track.socialLinks.twitter && (
                        <a
                          href={`https://twitter.com/${track.socialLinks.twitter.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <Twitter className="w-4 h-4 mr-2 sm:mr-3 flex-shrink-0" />
                          <span className="truncate flex-1">{track.socialLinks.twitter}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      )}
                      
                      {track.socialLinks.spotify && (
                        <a
                          href={track.socialLinks.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <Music className="w-4 h-4 mr-2 sm:mr-3 flex-shrink-0" />
                          <span className="truncate flex-1">Spotify Artist</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions - Mobile Full Width */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Actions
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  <button
                    className="w-full flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    disabled
                    title="Demo mode - actual playback not available"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    <span>Play Track (Demo)</span>
                  </button>
                  
                  <button
                    className="w-full flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    disabled
                    title="Demo mode - download not available"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span>Download (Demo)</span>
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    <span>Share Track</span>
                  </button>
                </div>
              </div>

              {/* Mobile Quick Stats - Only show on mobile in sidebar position */}
              <div className="block xl:hidden bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="text-center">
                    <div className="text-gray-600 dark:text-gray-400">Plays</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {(track.plays || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 dark:text-gray-400">Revenue</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      ${(track.revenue || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}