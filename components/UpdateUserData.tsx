import { useState } from 'react';
import axios from 'axios';

const UpdateUserData = ({ userId }: { userId: string }) => {
  const [data, setData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.put('/api/updateUserData', { id: userId, data });
      setSuccess('User data updated successfully');
    } catch (error) {
      setError('Failed to update user data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Update User Data</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={data.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
};

export default UpdateUserData;

