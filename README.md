# LabelLift - Music Distribution Dashboard

A modern, responsive music distribution platform built with Next.js and Tailwind CSS. This application provides artists with a comprehensive dashboard to manage their music uploads, track performance, and monitor distribution across various platforms.

## 🎵 Features Implemented

### ✅ Core Requirements
- **Login Page**: Mock authentication with localStorage session management
- **Dashboard Page**: Interactive table displaying tracks with search and filtering
- **Track Upload Page**: Form with validation for adding new tracks
- **Track Details Page**: Dynamic routing with detailed track information
- **Responsive Design**: Mobile-friendly interface for all screen sizes

### ✅ Bonus Features
- **Search & Filter**: Real-time search by title, artist, or genre with status/genre filters
- **Theme Switcher**: Dark/light mode toggle with localStorage persistence
- **Session Persistence**: Login state maintained across browser sessions

## 🛠️ Technology Stack

- **Framework**: Next.js 15.0.3 (Pages Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **API**: Next.js API Routes
- **Storage**: localStorage (session & theme persistence)

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hisaiii/lable_lift_assignment.git
   cd lable_lift_assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Application Structure

```
lable_lift_assignment/
├── pages/
│   ├── api/
│   │   ├── tracks.js           # Main tracks API endpoint
│   │   └── tracks/[id].js      # Individual track API
│   ├── track/
│   │   └── [id].js             # Dynamic track details page
│   ├── _app.js                 # App configuration
│   ├── index.js                # Home page (redirects)
│   ├── login.js                # Authentication page
│   ├── dashboard.js            # Main dashboard
│   └── upload.js               # Track upload form
├── components/
│   └── Layout.js               # Shared layout component
├── styles/
│   └── globals.css             # Global styles
└── README.md
```

## 🎯 Key Features Walkthrough

### Authentication Flow
- **Demo Login**: Any username/password combination works
- **Session Management**: Login state persisted in localStorage
- **Route Protection**: Automatic redirects for unauthenticated users

### Dashboard Functionality
- **Statistics Cards**: Track count, published tracks, total plays, revenue
- **Search & Filters**: Real-time filtering by multiple criteria
- **Responsive Table**: Optimized for mobile and desktop viewing
- **Status Indicators**: Color-coded track status badges

### Track Management
- **Upload Form**: Comprehensive validation with error handling
- **File Information**: Mock file details (format, bitrate, size)
- **Distribution Status**: Platform-specific publication status
- **Social Integration**: Artist social media links

### User Experience
- **Dark/Light Theme**: System preference detection with manual toggle
- **Loading States**: Smooth transitions and loading indicators
- **Error Handling**: User-friendly error messages
- **Mobile Responsive**: Touch-friendly interface on all devices

## 🔧 API Endpoints

### GET `/api/tracks`
Returns all tracks with optional search and filter parameters:
- `search`: Search by title, artist, or genre
- `status`: Filter by track status
- `genre`: Filter by music genre

### POST `/api/tracks`
Creates a new track with required fields:
- `title`: Track title
- `artistName`: Artist name
- `releaseDate`: Release date
- `genre`: Music genre

### GET `/api/tracks/[id]`
Returns detailed information for a specific track including:
- Basic track information
- File details (format, bitrate, size)
- Distribution status
- Social media links
- Lyrics (if available)

## 🎨 Design Philosophy

- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Optimized loading and minimal re-renders
- **Consistency**: Unified design language throughout the application

## 📊 Mock Data

The application includes realistic sample data:
- 5 sample tracks across different genres
- Varied track statuses (Published, Under Review, Draft)
- Performance metrics (plays, revenue)
- Distribution platform information

## 🚀 Production Considerations

For a production deployment, consider:
- Replace localStorage with secure authentication (JWT, OAuth)
- Implement real file upload with cloud storage (AWS S3, Cloudinary)
- Add database integration (PostgreSQL, MongoDB)
- Implement real-time analytics
- Add email notifications and user management
- Include payment processing for revenue tracking

## 📝 Development Notes

- **No External CDN Dependencies**: All icons and styling are self-contained
- **TypeScript Ready**: Easy migration path to TypeScript
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Progressive Enhancement**: Works without JavaScript for basic functionality

## 🐛 Known Limitations (Demo Mode)

- File upload is simulated (no actual file processing)
- Audio playback is disabled (mock functionality)
- Download functionality is placeholder
- Social media links are example URLs

## 🔮 Future Enhancements

- [ ] Real audio file processing and playback
- [ ] Advanced analytics dashboard
- [ ] Batch upload functionality
- [ ] Revenue tracking and payments
- [ ] Artist collaboration features
- [ ] Mobile app development
- [ ] Integration with major streaming platforms APIs

---

**Built with ❤️ for the LabelLift Frontend Assessment**

*This project demonstrates proficiency in React, Next.js, responsive design, and modern web development practices.*