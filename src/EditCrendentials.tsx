import { useState } from 'react';
import validator from 'validator';

interface EditCredentialsProps {
  username: string;
  email: string;
  phoneNumber: string;
  role: 'stadium_owner' | 'normal_user';
  onSave: (data: {
    username: string;
    email: string;
    phoneNumber: string;
    role: 'stadium_owner' | 'normal_user';
  }) => void;
}

export function EditCredentials({
  username,
  email,
  phoneNumber,
  role,
  onSave,
}: EditCredentialsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(username);
  const [editEmail, setEditEmail] = useState(email);
  const [editPhone, setEditPhone] = useState(phoneNumber);
  const [editRole, setEditRole] = useState<'stadium_owner' | 'normal_user'>(
    role,
  );
  const [errors, setErrors] = useState<string | null>(null);

  const validate = (): boolean => {
    const u = validator.trim(editUsername);
    const e = validator.trim(editEmail);
    const p = validator.trim(editPhone);

    if (!validator.isLength(u, { min: 3, max: 30 })) {
      setErrors('Username must be 3–30 characters.');
      return false;
    }
    if (!validator.isAlphanumeric(u, 'en-US', { ignore: '_-' })) {
      setErrors(
        'Username can only contain letters, numbers, hyphens, and underscores.',
      );
      return false;
    }
    if (!validator.isEmail(e)) {
      setErrors('Please enter a valid email address.');
      return false;
    }
    if (!validator.isMobilePhone(p, 'any')) {
      setErrors('Please enter a valid phone number.');
      return false;
    }
    return true;
  };

  const handleStartEdit = () => {
    setEditUsername(username);
    setEditEmail(email);
    setEditPhone(phoneNumber);
    setEditRole(role);
    setErrors(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      username: validator.trim(editUsername),
      email: validator.trim(editEmail),
      phoneNumber: validator.trim(editPhone),
      role: editRole,
    });

    setIsEditing(false);
    setErrors(null);
  };

  return isEditing ? (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={editUsername}
          onChange={(e) => setEditUsername(e.target.value)}
          required
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ marginTop: '0.75rem' }}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={editEmail}
          onChange={(e) => setEditEmail(e.target.value)}
          required
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ marginTop: '0.75rem' }}>
        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          type="text"
          value={editPhone}
          onChange={(e) => setEditPhone(e.target.value)}
          required
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ marginTop: '0.75rem' }}>
        <fieldset>
          <legend>Role</legend>
          <label>
            <input
              type="radio"
              name="role"
              value="stadium_owner"
              checked={editRole === 'stadium_owner'}
              onChange={() => setEditRole('stadium_owner')}
            />
            Stadium Owner
          </label>
          <label style={{ marginLeft: '1.5rem' }}>
            <input
              type="radio"
              name="role"
              value="normal_user"
              checked={editRole === 'normal_user'}
              onChange={() => setEditRole('normal_user')}
            />
            Normal User
          </label>
        </fieldset>
      </div>

      {errors && <p style={{ color: 'red', marginTop: '0.5rem' }}>{errors}</p>}

      <div style={{ marginTop: '1.25rem' }}>
        <button type="submit">Save Changes</button>
        <button
          type="button"
          onClick={handleCancel}
          style={{ marginLeft: '0.5rem' }}
        >
          Cancel
        </button>
      </div>
    </form>
  ) : (
    <div>
      <p>
        <strong>Username:</strong> {username}
      </p>
      <p>
        <strong>Email:</strong> {email}
      </p>
      <p>
        <strong>Phone:</strong> {phoneNumber}
      </p>
      <p>
        <strong>Role:</strong>{' '}
        {role === 'stadium_owner' ? 'Stadium Owner' : 'Normal User'}
      </p>
      <button onClick={handleStartEdit} style={{ marginTop: '1rem' }}>
        Edit Credentials
      </button>
    </div>
  );
}
