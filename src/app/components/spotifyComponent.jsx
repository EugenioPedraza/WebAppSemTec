'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getNowPlaying, getUserProfile, getTopTracks, getSavedAlbums, getTopArtists } from '../lib/spotify';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import React from "react";
import { Avatar, Card, CardBody, Image, Button, Slider } from '@nextui-org/react'; // Importar Avatar de NextUI

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
        console.log('CHEQUEO Session:', session);
        try {
          const trackResponse = await getNowPlaying(session.accessToken);
          console.log('CHEQUEO Now Playing Response:', trackResponse);
          setTrack(trackResponse.data);

          const profileResponse = await getUserProfile(session.accessToken);
          console.log('CHEQUEO Profile Response:', profileResponse);
          setProfile(profileResponse.data);

          const topTracksResponse = await getTopTracks(session.accessToken);
          console.log('CHEQUEO Top Tracks Response:', topTracksResponse);
          setTopTracks(topTracksResponse.data.items);

          const savedAlbumsResponse = await getSavedAlbums(session.accessToken);
          console.log('CHEQUEO Saved Albums Response:', savedAlbumsResponse);
          setSavedAlbums(savedAlbumsResponse.data.items);

          const topArtistsResponse = await getTopArtists(session.accessToken);
          console.log('CHEQUEO Top Artists Response:', topArtistsResponse);
          setTopArtists(topArtistsResponse.data.items);

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

  const genreData = {
    labels: Object.keys(genreCounts),
    datasets: [
      {
        label: 'Number of Artists',
        data: Object.values(genreCounts),
        backgroundColor: "rgba(30, 215, 96, 1)",
        borderColor: "rgba(30, 215, 96, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: "20px" }}>

        <Card style={{ backgroundColor: '#363636', flex: 1, marginRight: '10px' }}>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: "300px", padding: "20px" }}>
              <div style={{ flex: 1, padding: "20px" }}>
                {/* Profile and now playing track */}
                {profile ? (
                  <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <h2 style={{ color: "#FFFFFF", marginBottom: "10px" }}>
                      <strong>{profile.display_name}</strong>
                    </h2>
                    <p style={{ color: "#FFFFFF", fontSize: "14px", marginBottom: "10px" }}>Email: {profile.email}</p>
                    <img
                      src={profile.images[0]?.url}
                      alt="Profile picture"
                      width="100"
                      style={{
                        borderRadius: "50%",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        display: "block",
                        margin: "0 auto",
                      }}
                    />
                  </div>
                ) : (
                  <p style={{ textAlign: "center", color: "#FFFFFF" }}>Loading profile...</p>
                )}

                {track ? (
                  <p style={{ textAlign: "center", color: "#FFFFFF", margin: "20px 0" }}>Now playing: <strong>{track.item.name}</strong></p>
                ) : (
                  <p style={{ textAlign: "center", color: "#FFFFFF", margin: "20px 0" }}>No track playing</p>
                )}

                <h3 style={{ textAlign: "center", color: "#FFFFFF", borderBottom: "1px solid #ddd", paddingBottom: "10px", marginBottom: "10px" }}>
                  <strong>Top Tracks</strong>
                </h3>
                {topTracks.length > 0 ? (
                  <ul style={{ paddingLeft: "20px", listStyleType: "none", maxHeight: "200px", overflowY: "auto" }}>
                    {topTracks.map((track) => (
                      <li key={track.id} style={{ marginBottom: "8px", color: "#FFFFFF" }}>
                        <span style={{ fontWeight: "bold" }}>{track.name}</span> by {track.artists[0].name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "#FFFFFF" }}>No top tracks available</p>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card style={{ backgroundColor: '#363636', flex: 1, marginLeft: '10px' }}>
          <CardBody>
            <div style={{ minWidth: "300px", padding: "20px" }}>
              <h3 style={{ textAlign: 'center', color: '#FFFFFF', marginBottom: '10px', fontWeight: 'bold' }}>Saved Albums</h3>
              {savedAlbums.length > 0 ? (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {savedAlbums.map((album) => (
                    <div key={album.album.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', justifyContent: 'space-between' }}>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <h4 style={{ color: "#FFFFFF", marginBottom: "5px" }}>
                          <strong>{album.album.name}</strong>
                        </h4>
                        <p style={{ color: "#FFFFFF", fontSize: "14px" }}>Artist: {album.album.artists[0].name}</p>
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
                <p style={{ textAlign: "center", color: "#FFFFFF" }}>No saved albums available</p>
              )}
            </div>
          </CardBody>
        </Card>

      </div>

      <div style={{ marginTop: "20px" }}>
       <h3 style={{ textAlign: 'center', color: '#FFFFFF', marginBottom: '10px', fontWeight: 'bold' }}>
          Genre Counts
        </h3>
        <div style={{ width: '80%', margin: '0 auto' }}>
          <Bar 
            data={genreData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: {
                    color: '#FFFFFF' // Cambia el color de las etiquetas de la leyenda
                  }
                }
              },
              scales: {
                x: {
                  ticks: {
                    color: '#FFFFFF' // Cambia el color de las etiquetas del eje x
                  },
                  grid: {
                    color: '#FFFFFF' // Cambia el color de las líneas de la cuadrícula del eje x
                  }
                },
                y: {
                  ticks: {
                    color: '#FFFFFF' // Cambia el color de las etiquetas del eje y
                  },
                  grid: {
                    color: '#FFFFFF' // Cambia el color de las líneas de la cuadrícula del eje y
                  }
                }
              }
            }}
            // Aquí defines el color de las barras
            plugins={{
              datalabels: {
                color: '#FFFFFF' // Cambia el color de las etiquetas de datos
              }
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: '20px', maxWidth: '100%', boxSizing: 'border-box' }}>
        <h3 style={{ textAlign: 'center', color: "#FFFFFF", marginBottom: '10px' }}>Top Artists</h3>
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          padding: '10px',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          {topArtists.length > 0 ? (
            topArtists.map((artist) => (
              <div key={artist.id} style={{ display: 'inline-block', textAlign: 'center', marginRight: '20px' }}>
                <Avatar
                  src={artist.images[0]?.url}
                  alt="Artist picture"
                  size="lg"
                  isBordered color="success"
                  className="w-20 h-20 text-large" // Ajustar el tamaño del avatar
                  css={{ marginBottom: "10px" }}
                />
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#777" }}>No top artists available</p>
          )}
        </div>
      </div>


    </div>
  );
}
