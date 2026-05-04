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
        'Username can only contain letters, numbers, hyphens, underscores.',
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

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Username
          </label>
          <input
            type="text"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            value={editPhone}
            onChange={(e) => setEditPhone(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
        <div>
          <fieldset>
            <legend className="text-sm font-medium text-gray-300 mb-2">
              Role
            </legend>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="stadium_owner"
                  checked={editRole === 'stadium_owner'}
                  onChange={() => setEditRole('stadium_owner')}
                  className="accent-emerald-500 w-4 h-4"
                />
                <span className="text-gray-300">Stadium Owner</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="normal_user"
                  checked={editRole === 'normal_user'}
                  onChange={() => setEditRole('normal_user')}
                  className="accent-emerald-500 w-4 h-4"
                />
                <span className="text-gray-300">Normal User</span>
              </label>
            </div>
          </fieldset>
        </div>
        {errors && <p className="text-red-400 text-sm">{errors}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold transition-all"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  // View mode
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Username</span>
          <span className="text-white font-medium">{username}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Email</span>
          <span className="text-white font-medium">{email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Phone</span>
          <span className="text-white font-medium">{phoneNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Role</span>
          <span className="text-white font-medium">
            {role === 'stadium_owner' ? 'Stadium Owner' : 'Normal User'}
          </span>
        </div>
      </div>
      <button
        onClick={handleStartEdit}
        className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold transition-all"
      >
        Edit Credentials
      </button>
    </div>
  );
}
