// Mock database - in real app, this would be a database
let tracks = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artistName: 'Luna Rodriguez',
    releaseDate: '2024-09-15',
    genre: 'Pop',
    status: 'Published',
    duration: '3:45',
    plays: 12450,
    revenue: 85.32
  },
  {
    id: '2',
    title: 'Electric Pulse',
    artistName: 'Neon Collective',
    releaseDate: '2024-09-10',
    genre: 'Electronic',
    status: 'Under Review',
    duration: '4:12',
    plays: 8930,
    revenue: 62.15
  },
  {
    id: '3',
    title: 'Acoustic Soul',
    artistName: 'James Mitchell',
    releaseDate: '2024-09-05',
    genre: 'Folk',
    status: 'Published',
    duration: '3:28',
    plays: 15670,
    revenue: 103.89
  },
  {
    id: '4',
    title: 'Bass Drop',
    artistName: 'DJ Thunder',
    releaseDate: '2024-08-30',
    genre: 'EDM',
    status: 'Draft',
    duration: '5:33',
    plays: 0,
    revenue: 0
  },
  {
    id: '5',
    title: 'Indie Vibes',
    artistName: 'The Wanderers',
    releaseDate: '2024-08-25',
    genre: 'Indie Rock',
    status: 'Published',
    duration: '4:01',
    plays: 22100,
    revenue: 156.47
  }
];

export default function handler(req, res) {
  const { method, query } = req;

  switch (method) {
    case 'GET':
      // Handle search and filter
      let filteredTracks = [...tracks];
      
      if (query.search) {
        const searchTerm = query.search.toLowerCase();
        filteredTracks = filteredTracks.filter(track =>
          track.title.toLowerCase().includes(searchTerm) ||
          track.artistName.toLowerCase().includes(searchTerm) ||
          track.genre.toLowerCase().includes(searchTerm)
        );
      }

      if (query.status && query.status !== 'all') {
        filteredTracks = filteredTracks.filter(track =>
          track.status.toLowerCase() === query.status.toLowerCase()
        );
      }

      if (query.genre && query.genre !== 'all') {
        filteredTracks = filteredTracks.filter(track =>
          track.genre.toLowerCase() === query.genre.toLowerCase()
        );
      }

      res.status(200).json({
        tracks: filteredTracks,
        totalTracks: tracks.length,
        filteredCount: filteredTracks.length
      });
      break;

    case 'POST':
      // Add new track
      const { title, artistName, releaseDate, genre } = req.body;

      if (!title || !artistName || !releaseDate || !genre) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const newTrack = {
        id: (tracks.length + 1).toString(),
        title,
        artistName,
        releaseDate,
        genre,
        status: 'Draft',
        duration: '0:00',
        plays: 0,
        revenue: 0
      };

      tracks.unshift(newTrack); // Add to beginning of array
      res.status(201).json({ track: newTrack, message: 'Track uploaded successfully!' });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}