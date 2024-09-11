'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getNowPlaying, getUserProfile, getTopTracks } from '../lib/spotify'; // Add these helpers

export default function SpotifyComponent() {
  const { data: session } = useSession();
  const [track, setTrack] = useState(null);
  const [profile, setProfile] = useState(null);
  const [topTracks, setTopTracks] = useState([]);

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
        } catch (error) {
          console.error("Error fetching Spotify data:", error);
        }
      }
    }
    fetchSpotifyData();
  }, [session]);

  return (
    <div>
      {profile ? (
        <div>
          <h2>{profile.display_name}</h2>
          <p>Email: {profile.email}</p>
          <img src={profile.images[0]?.url} alt="Profile picture" width="100" />
        </div>
      ) : (
        <p>Loading profile...</p>
      )}

      {track ? <p>Now playing: {track.item.name}</p> : <p>No track playing</p>}

      <h3>Top Tracks:</h3>
      {topTracks.length > 0 ? (
        <ul>
          {topTracks.map((track) => (
            <li key={track.id}>{track.name} by {track.artists[0].name}</li>
          ))}
        </ul>
      ) : (
        <p>No top tracks available</p>
      )}
    </div>
  );
}
