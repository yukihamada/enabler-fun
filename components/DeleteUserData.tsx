import { useState } from 'react';
import axios from 'axios';

const DeleteUserData = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete('/api/deleteUserData', { data: { id: userId } });
      setSuccess('User data deleted successfully');
    } catch (error) {
      setError('Failed to delete user data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Delete User Data</h1>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'Deleting...' : 'Delete'}
      </button>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
};

export default DeleteUserData;

