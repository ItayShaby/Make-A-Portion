import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { updateUserProfile, uploadImage } from '../lib/db';
import './EditProfilePage.css';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    avatarUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState('');

  // Populate the form once the profile is available.
  useEffect(() => {
    if (profile) {
      setForm((prev) => ({
        ...prev,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        avatarUrl: profile.avatarUrl || '',
      }));
    }
  }, [profile]);

  const initial = (form.firstName || 'U')[0].toUpperCase();

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleAvatar(e) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setError('');
    setField('avatarUrl', URL.createObjectURL(file)); // instant local preview
    setUploadingAvatar(true);
    try {
      const url = await uploadImage('avatars', user.id, file);
      setField('avatarUrl', url); // real public URL (persists on save)
    } catch (err) {
      console.error('Avatar upload failed:', err);
      setError('Avatar upload failed. Please try a smaller image.');
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;
    setError('');
    setSaving(true);

    const fullName = [form.firstName.trim(), form.lastName.trim()].filter(Boolean).join(' ');

    // Build the Users patch. Only persist a real avatar URL — blob: previews
    // from the file picker aren't real URLs (real uploads come with Storage).
    const patch = {
      'full name': fullName,
      email: form.email.trim() || null,
    };
    if (form.avatarUrl && !form.avatarUrl.startsWith('blob:')) {
      patch.avatar_url = form.avatarUrl;
    }

    try {
      await updateUserProfile(user.id, patch);

      // Optional password change via Supabase Auth.
      if (form.password) {
        const { error: pwErr } = await supabase.auth.updateUser({ password: form.password });
        if (pwErr) throw pwErr;
      }

      await refreshProfile();
      navigate('/profile');
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError('Could not save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="edit-profile">
      <h1 className="edit-profile__title">Edit Profile</h1>

      <form className="edit-profile__form" onSubmit={handleSubmit}>
        {/* Profile picture */}
        <div className="edit-profile__avatar-row">
          {form.avatarUrl ? (
            <img className="edit-profile__avatar" src={form.avatarUrl} alt="Profile" />
          ) : (
            <div className="edit-profile__avatar edit-profile__avatar--placeholder">{initial}</div>
          )}
          <div className="edit-profile__avatar-actions">
            <button
              type="button"
              className="edit-profile__upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
            >
              {uploadingAvatar ? 'Uploading…' : 'Change photo'}
            </button>
            {form.avatarUrl && (
              <button
                type="button"
                className="edit-profile__remove-btn"
                onClick={() => setField('avatarUrl', '')}
              >
                Remove
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatar}
            />
          </div>
        </div>

        <div className="edit-profile__grid">
          <div className="edit-profile__field">
            <label className="edit-profile__label" htmlFor="ep-email">Email</label>
            <input
              className="edit-profile__input"
              id="ep-email"
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
            />
          </div>

          <div className="edit-profile__field">
            <label className="edit-profile__label" htmlFor="ep-first">First Name</label>
            <input
              className="edit-profile__input"
              id="ep-first"
              type="text"
              value={form.firstName}
              onChange={(e) => setField('firstName', e.target.value)}
            />
          </div>

          <div className="edit-profile__field">
            <label className="edit-profile__label" htmlFor="ep-last">Last Name</label>
            <input
              className="edit-profile__input"
              id="ep-last"
              type="text"
              value={form.lastName}
              onChange={(e) => setField('lastName', e.target.value)}
            />
          </div>

          <div className="edit-profile__field edit-profile__field--full">
            <label className="edit-profile__label" htmlFor="ep-password">New Password</label>
            <input
              className="edit-profile__input"
              id="ep-password"
              type="password"
              placeholder="Leave blank to keep current password"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
            />
          </div>
        </div>

        {error && <p className="edit-profile__error">{error}</p>}

        <div className="edit-profile__actions">
          <button type="button" className="edit-profile__cancel-btn" onClick={() => navigate('/profile')}>
            Cancel
          </button>
          <button type="submit" className="edit-profile__save-btn" disabled={saving || uploadingAvatar}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
