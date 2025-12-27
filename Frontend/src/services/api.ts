const API_URL = 'http://localhost:8000';

export const api = {
  // Equipment
  fetchEquipment: async () => {
    const res = await fetch(`${API_URL}/equipment/`);
    if (!res.ok) throw new Error('Failed to fetch equipment');
    return res.json();
  },

  createEquipment: async (data: any) => {
    const res = await fetch(`${API_URL}/equipment/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create equipment');
    return res.json();
  },

  // Teams
  fetchTeams: async () => {
    const res = await fetch(`${API_URL}/teams/`);
    if (!res.ok) throw new Error('Failed to fetch teams');
    return res.json();
  },
  
  createTeam: async (data: any) => {
    const res = await fetch(`${API_URL}/teams/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Requests
  fetchRequests: async () => {
    const res = await fetch(`${API_URL}/requests/`);
    if (!res.ok) throw new Error('Failed to fetch requests');
    return res.json();
  },

  createRequest: async (data: any) => {
    const res = await fetch(`${API_URL}/requests/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to create request');
    }
    return res.json();
  },

  updateRequestState: async (id: string, state: string) => {
    const res = await fetch(`${API_URL}/requests/${id}/state?state=${state}`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Failed to update state');
    return res.json();
  },
};
