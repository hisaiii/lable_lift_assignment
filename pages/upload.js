import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import { Upload, Music, Calendar, Tag, User, CheckCircle, AlertCircle } from 'lucide-react';

export default function UploadTrack() {
  const [formData, setFormData] = useState({
    title: '',
    artistName: '',
    releaseDate: '',
    genre: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});
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
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Track title is required';
    }

    if (!formData.artistName.trim()) {
      newErrors.artistName = 'Artist name is required';
    }

    if (!formData.releaseDate) {
      newErrors.releaseDate = 'Release date is required';
    } else {
      const selectedDate = new Date(formData.releaseDate);
      const today = new Date();
      if (selectedDate < today.setHours(0, 0, 0, 0)) {
        newErrors.releaseDate = 'Release date cannot be in the past';
      }
    }

    if (!formData.genre) {
      newErrors.genre = 'Genre is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/tracks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setFormData({
          title: '',
          artistName: '',
          releaseDate: '',
          genre: ''
        });
        
        // Redirect to dashboard after successful upload
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Upload failed' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const genres = [
    'Pop',
    'Rock',
    'Hip Hop',
    'Electronic',
    'Folk',
    'Country',
    'Jazz',
    'Blues',
    'Classical',
    'Reggae',
    'R&B',
    'Indie Rock',
    'EDM',
    'Alternative',
    'Metal',
    'Punk',
    'Other'
  ];

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <>
      <Head>
        <title>Upload Track - LabelLift</title>
        <meta name="description" content="Upload a new track to your music distribution dashboard" />
      </Head>
      
      <Layout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header - Mobile Responsive */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Upload New Track
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Fill in the details below to upload your new track to the distribution platform
            </p>
          </div>

          {/* Form Container - Responsive Padding */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Track Title - Mobile Optimized */}
              <div>
                <label htmlFor="title" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Music className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Track Title *</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.title 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter track title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-start">
                    <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              {/* Artist Name - Mobile Optimized */}
              <div>
                <label htmlFor="artistName" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>Artist Name *</span>
                </label>
                <input
                  type="text"
                  id="artistName"
                  name="artistName"
                  value={formData.artistName}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.artistName 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter artist name"
                />
                {errors.artistName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-start">
                    <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                    <span>{errors.artistName}</span>
                  </p>
                )}
              </div>

              {/* Form Row for Tablet/Desktop - Split Date and Genre */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Release Date */}
                <div>
                  <label htmlFor="releaseDate" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>Release Date *</span>
                  </label>
                  <input
                    type="date"
                    id="releaseDate"
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleChange}
                    min={getTodayDate()}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.releaseDate 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.releaseDate && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-start">
                      <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span>{errors.releaseDate}</span>
                    </p>
                  )}
                </div>

                {/* Genre */}
                <div>
                  <label htmlFor="genre" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Tag className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>Genre *</span>
                  </label>
                  <select
                    id="genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                      errors.genre 
                        ? 'border-red-300 dark:border-red-600' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Select a genre</option>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                  {errors.genre && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-start">
                      <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                      <span>{errors.genre}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* File Upload Info - Mobile Responsive */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
                <div className="flex items-start">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-1">
                      File Upload (Demo Mode)
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                      In this demo version, actual file upload is simulated. In a production environment, 
                      you would be able to upload your audio files here.
                    </p>
                  </div>
                </div>
              </div>

              {/* Success/Error Messages - Mobile Responsive */}
              {message.text && (
                <div className={`p-3 sm:p-4 rounded-lg border ${
                  message.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-400'
                }`}>
                  <div className="flex items-start">
                    {message.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <span className="text-sm font-medium block">{message.text}</span>
                      {message.type === 'success' && (
                        <p className="text-xs sm:text-sm mt-1">
                          Redirecting to dashboard in 2 seconds...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button - Mobile First Design */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="w-full sm:flex-1 py-2.5 sm:py-3 px-4 text-sm sm:text-base border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-1 py-2.5 sm:py-3 px-4 text-sm sm:text-base bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Upload className="w-4 h-4 mr-2" />
                      <span>Upload Track</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
}