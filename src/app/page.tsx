import LoginButton from './components/loginButton';
import { NextUIProvider } from "@nextui-org/react";
import SpotifyComponent from './components/spotifyComponent';

export default function Home() {
  return (
    <NextUIProvider>
      <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'black', color: 'white' }}>
        <main style={{ padding: '40px' }}>
          <div style={{ position: 'absolute', top: '20px', right: '42%', display: 'flex', alignItems: 'center' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff' }}>Factorify</h1>
          </div>
          <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center' }}>
            <LoginButton />
          </div>
          <div style={{ marginTop: '60px' }}>
            <SpotifyComponent />
          </div>
        </main>
        <footer style={{ textAlign: 'center', padding: '20px' }}>
          <p>Este sitio web pertenece al Equipo 1. Cualquier ataque hacia un integrante se considerará como un ataque hacia todos.</p>
        </footer>
      </div>
    </NextUIProvider>
  );
}
