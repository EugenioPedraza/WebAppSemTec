'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getNowPlaying, getUserProfile, getTopTracks, getSavedAlbums, getTopArtists } from '../lib/spotify'; // Asegúrate de importar la nueva función
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

export default function SpotifyComponent() {
  const { data: session } = useSession();
  const [track, setTrack] = useState(null);
  const [profile, setProfile] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [savedAlbums, setSavedAlbums] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [genreCounts, setGenreCounts] = useState({});

  useEffect(() => {
    async function fetchSpotifyData() {
      if (session && session.accessToken) {
        console.log('CHEQUEO Session:', session); // Log para verificar el token
        try {
          // Fetch now playing track
          const trackResponse = await getNowPlaying(session.accessToken);
          console.log('CHEQUEO Now Playing Response:', trackResponse); // Log the response
          setTrack(trackResponse.data);

          // Fetch user profile
          const profileResponse = await getUserProfile(session.accessToken);
          console.log('CHEQUEO Profile Response:', profileResponse); // Log the response
          setProfile(profileResponse.data);

          // Fetch user's top tracks
          const topTracksResponse = await getTopTracks(session.accessToken);
          console.log('CHEQUEO Top Tracks Response:', topTracksResponse); // Log the response
          setTopTracks(topTracksResponse.data.items);

          // Fetch user's saved albums
          const savedAlbumsResponse = await getSavedAlbums(session.accessToken);
          console.log('CHEQUEO Saved Albums Response:', savedAlbumsResponse); // Log the response
          setSavedAlbums(savedAlbumsResponse.data.items);

          // Fetch user's top artists
          const topArtistsResponse = await getTopArtists(session.accessToken); // Solicitar los artistas
          console.log('CHEQUEO Top Artists Response:', topArtistsResponse); // Log the response
          setTopArtists(topArtistsResponse.data.items); // Guardar los artistas en el estado

          // Contar géneros
          const genreMap = {};
          topArtistsResponse.data.items.forEach(artist => {
            artist.genres.forEach(genre => {
              genreMap[genre] = (genreMap[genre] || 0) + 1;
            });
          });
          setGenreCounts(genreMap);

        } catch (error) {
          console.error("Error fetching Spotify data:", error);
        }
      }
    }
    fetchSpotifyData();
  }, [session]);

  // Preparar los datos para el gráfico
  const genreData = {
    labels: Object.keys(genreCounts),
    datasets: [
      {
        label: 'Number of Artists',
        data: Object.values(genreCounts),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: "600px", fontFamily: "Arial, sans-serif", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
        <div style={{ flex: 1, padding: "20px" }}>
          {/* Profile and now playing track */}
          {profile ? (
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <h2 style={{ color: "#333", marginBottom: "10px" }}>
                <strong>{profile.display_name}</strong>
              </h2>
              <p style={{ color: "#555", fontSize: "14px", marginBottom: "10px" }}>Email: {profile.email}</p>
              <img
                src={profile.images[0]?.url}
                alt="Profile picture"
                width="100"
                style={{
                  borderRadius: "50%",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  display: "block",
                  margin: "0 auto", // Ensures the image is centered horizontally
                }}
              />
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "#777" }}>Loading profile...</p>
          )}

          {track ? (
            <p style={{ textAlign: "center", color: "#333", margin: "20px 0" }}>Now playing: <strong>{track.item.name}</strong></p>
          ) : (
            <p style={{ textAlign: "center", color: "#777", margin: "20px 0" }}>No track playing</p>
          )}

          <h3 style={{ textAlign: "center", color: "#333", borderBottom: "1px solid #ddd", paddingBottom: "10px", marginBottom: "10px" }}>
            <strong>Top Tracks</strong>
          </h3>
          {topTracks.length > 0 ? (
            <ul style={{ paddingLeft: "20px", listStyleType: "none" }}>
              {topTracks.map((track) => (
                <li key={track.id} style={{ marginBottom: "8px", color: "#333" }}>
                  <span style={{ fontWeight: "bold" }}>{track.name}</span> by {track.artists[0].name}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#777" }}>No top tracks available</p>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "600px", display: 'flex', flexDirection: 'column', width: "100%", fontFamily: "Arial, sans-serif", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9", marginTop: "20px" }}>
        <h3 style={{ textAlign: 'center', color: '#333', marginBottom: '10px' }}>Saved Albums</h3>
        
        {savedAlbums.length > 0 ? (
          <div>
            {savedAlbums.map((album) => (
              <div key={album.album.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <h4 style={{ color: "#333", marginBottom: "5px" }}>
                    <strong>{album.album.name}</strong>
                  </h4>
                  <p style={{ color: "#555", fontSize: "14px" }}>Artist: {album.album.artists[0].name}</p>
                </div>
                <img
                  src={album.album.images[0]?.url}
                  alt="Album cover"
                  width="100"
                  style={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    display: "block",
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#777" }}>No saved albums available</p>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: "600px", fontFamily: "Arial, sans-serif", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
      <h3 style={{ textAlign: 'center', color: '#333', marginBottom: '10px' }}>Top Artists</h3>
        
        {topArtists.length > 0 ? (
          <div>
            {topArtists.map((artist) => (
              <div key={artist.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <h4 style={{ color: "#333", marginBottom: "5px" }}>
                    <strong>{artist.name}</strong>
                  </h4>
                  <p style={{ color: "#555", fontSize: "14px" }}>Followers: {artist.followers.total}</p>
                  <p style={{ color: "#555", fontSize: "14px" }}>
                    Genres: {artist.genres.join(', ') || 'No genres available'}
                  </p>
                </div>
                <img
                  src={artist.images[0]?.url}
                  alt="Artist picture"
                  width="100"
                  style={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    display: "block",
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#777" }}>No top artists available</p>
        )}
      </div>

      <div style={{border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9"}}>
        <h3 style={{ textAlign: 'center', color: '#333', marginBottom: '10px' }}>Genre Counts</h3>
        <div style={{ width: '80%', margin: '0 auto' }}>
          <Bar 
            data={genreData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      </div>
      
    </div>
  );
}
