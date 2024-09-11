import axios from 'axios';

const API_BASE_URL = 'https://api.spotify.com/v1';

export async function getNowPlaying(token) {
  return axios.get(`${API_BASE_URL}/me/player/currently-playing`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getUserProfile(token) {
  return axios.get(`${API_BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getTopTracks(token) {
  return axios.get(`${API_BASE_URL}/me/top/tracks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


/*
import axios from 'axios';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;

// Get a refreshed access token
export const getAccessToken = async () => {
  const response = await axios.post(TOKEN_ENDPOINT, new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refresh_token,
  }), {
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return response.data;
};

// Fetch the user's currently playing track
// Modified function in lib/spotify.js
export const getNowPlaying = async () => {
  const { access_token } = await getAccessToken(); // Ensure this returns the right token
  try {
    const response = await axios.get(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (response.status === 204 || response.status > 400) {
      // 204 means no content, which can happen when no track is playing
      return null;
    }
    return response;
  } catch (error) {
    console.error('Error fetching now playing:', error);
    return null;
  }
};

// Fetch the user's top tracks
export const getTopTracks = async () => {
  const { access_token } = await getAccessToken();
  return axios.get(TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};
*/