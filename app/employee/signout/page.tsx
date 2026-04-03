'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SignOutPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setMessage('Camera access denied');
    }
  };

  const takeSelfie = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx?.drawImage(videoRef.current, 0, 0);
    
    const dataUrl = canvasRef.current.toDataURL('image/jpeg');
    setPhoto(dataUrl);
  };

  const handleSignOut = async () => {
    if (!photo) {
      setMessage('Please take a selfie first');
      return;
    }
    if (amount > 20000 || amount <= 0) {
      setMessage('Sign out amount must be between 1 and 20,000 UGX');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const res = await fetch('/api/employee/signout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          selfie: photo,
          signOutAmount: amount,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Signed out successfully! Received UGX ${amount}`);
        setTimeout(() => router.push('/employee'), 2000);
      } else {
        setMessage(data.error || 'Sign out failed');
      }
    } catch (err: any) {
      setMessage(err.message || 'Location or sign out error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Sign Out</h1>
        <p className="text-center text-gray-600 mb-8">8:00pm – 11:30pm EAT • Max UGX 20,000</p>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Sign Out Amount (UGX)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            max={20000}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-2xl font-semibold"
            placeholder="Max 20,000"
          />
          <p className="text-xs text-gray-500 mt-1">Maximum allowed: 20,000 UGX per sign-out</p>
        </div>

        <div className="mb-8">
          <video ref={videoRef} autoPlay playsInline className="w-full rounded-2xl" />
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={startCamera}
            className="flex-1 bg-gray-800 text-white py-3 rounded-2xl"
          >
            Start Camera
          </button>
          <button 
            onClick={takeSelfie}
            className="flex-1 bg-blue-600 text-white py-3 rounded-2xl"
          >
            Take Selfie
          </button>
        </div>

        {photo && (
          <div className="mb-6">
            <img src={photo} alt="Selfie" className="w-full rounded-2xl" />
          </div>
        )}

        <button 
          onClick={handleSignOut}
          disabled={loading || !photo || amount === 0}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white py-4 rounded-2xl text-lg font-semibold"
        >
          {loading ? 'Signing Out...' : 'Sign Out Now'}
        </button>

        {message && (
          <p className={`mt-4 text-center font-medium ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        <button 
          onClick={() => router.push('/employee')}
          className="mt-6 text-gray-500 underline w-full"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
