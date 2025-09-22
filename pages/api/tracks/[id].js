// Mock database - in real app, this would be a database
const tracks = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artistName: 'Luna Rodriguez',
    releaseDate: '2024-09-15',
    genre: 'Pop',
    status: 'Published',
    duration: '3:45',
    plays: 12450,
    revenue: 85.32,
    description: 'A dreamy pop ballad that captures the essence of late-night contemplation and urban solitude.',
    lyrics: 'Walking through the city lights...\nDreaming of a different life...\nUnderneath the starry sky...\nWondering if I could fly...',
    fileSize: '8.2 MB',
    format: 'MP3',
    bitrate: '320 kbps',
    uploadDate: '2024-09-10',
    distributedTo: ['Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music'],
    socialLinks: {
      instagram: '@luna_rodriguez_music',
      twitter: '@lunamusic',
      spotify: 'https://open.spotify.com/artist/luna_rodriguez'
    }
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
    revenue: 62.15,
    description: 'An energetic electronic track with pulsating beats and synthetic melodies that transport you to a neon-lit dance floor.',
    lyrics: 'Feel the electric pulse...\nRunning through your veins...\nSynth waves crash around us...\nIn this digital maze...',
    fileSize: '9.7 MB',
    format: 'MP3',
    bitrate: '320 kbps',
    uploadDate: '2024-09-05',
    distributedTo: ['Pending Review'],
    socialLinks: {
      instagram: '@neon_collective',
      twitter: '@neoncollective',
      spotify: 'https://open.spotify.com/artist/neon_collective'
    }
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
    revenue: 103.89,
    description: 'A heartfelt acoustic folk song that tells a story of love, loss, and redemption through simple yet profound lyrics.',
    lyrics: 'Strumming on my old guitar...\nSinging songs from the heart...\nMemories of what we had...\nBefore we fell apart...',
    fileSize: '7.9 MB',
    format: 'MP3',
    bitrate: '320 kbps',
    uploadDate: '2024-08-30',
    distributedTo: ['Spotify', 'Apple Music', 'Bandcamp', 'SoundCloud'],
    socialLinks: {
      instagram: '@jamesmitchell_music',
      twitter: '@jmitchellmusic',
      spotify: 'https://open.spotify.com/artist/james_mitchell'
    }
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
    revenue: 0,
    description: 'High-energy EDM track with massive bass drops and festival-ready beats designed to make crowds go wild.',
    lyrics: 'Are you ready for the drop...\nFeel the bass in your soul...\nHands up, touch the sky...\nLet the music take control...',
    fileSize: '12.8 MB',
    format: 'MP3',
    bitrate: '320 kbps',
    uploadDate: '2024-08-25',
    distributedTo: ['Not Yet Distributed'],
    socialLinks: {
      instagram: '@djthunder_official',
      twitter: '@djthunder',
      spotify: 'https://open.spotify.com/artist/dj_thunder'
    }
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
    revenue: 156.47,
    description: 'Nostalgic indie rock anthem with jangly guitars and introspective lyrics that capture the essence of modern wanderlust.',
    lyrics: 'We are the wanderers...\nSearching for our place...\nIn this concrete jungle...\nTrying to find some space...',
    fileSize: '9.2 MB',
    format: 'MP3',
    bitrate: '320 kbps',
    uploadDate: '2024-08-20',
    distributedTo: ['Spotify', 'Apple Music', 'Bandcamp', 'Deezer'],
    socialLinks: {
      instagram: '@thewanderers_band',
      twitter: '@wanderersband',
      spotify: 'https://open.spotify.com/artist/the_wanderers'
    }
  }
];

export default function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  switch (method) {
    case 'GET':
      const track = tracks.find(t => t.id === id);
      
      if (!track) {
        return res.status(404).json({ error: 'Track not found' });
      }

      res.status(200).json({ track });
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}