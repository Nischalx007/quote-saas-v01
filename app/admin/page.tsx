'use client';

import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [active, setActive] = useState(true);
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    const response = await fetch('/api/app-status');
    const result = await response.json();

    if (result.success) {
      setActive(result.active);
    }
  };

  const changeStatus = async (newStatus: boolean) => {
    if (!adminKey) {
      alert('Enter admin password first');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/app-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({
          active: newStatus,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || 'Could not update status');
        return;
      }

      setActive(result.active);

if (result.active) {
  window.location.href = '/';
  return;
}

alert('Service turned OFF');
    } catch {
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: 40 }}>
      <h1>Admin Control</h1>

      <p>
        Current status: <strong>{active ? 'ON' : 'OFF'}</strong>
      </p>

      <div style={{ marginTop: 25 }}>
        <label>Admin password</label>

        <input
          type="password"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          style={{
            display: 'block',
            width: '100%',
            padding: 10,
            marginTop: 8,
            marginBottom: 20,
          }}
        />
      </div>

      <button
        onClick={() => changeStatus(true)}
        disabled={loading}
        style={{ padding: '12px 20px', marginRight: 10 }}
      >
        Turn ON
      </button>

      <button
        onClick={() => changeStatus(false)}
        disabled={loading}
        style={{ padding: '12px 20px' }}
      >
        Turn OFF
      </button>
    </main>
  );
}