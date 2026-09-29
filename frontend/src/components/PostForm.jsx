import { useEffect, useState } from 'react';
import { getMediaUrl } from '../api';

const PostForm = ({ initialData = { title: '', body: '' }, onSubmit, buttonText = 'Submit', disabled = false }) => {
  const [formData, setFormData] = useState({ title: initialData.title || '', body: initialData.body || '', imageFile: null, removeImage: false });
  const [preview, setPreview] = useState(getMediaUrl(initialData.image));
  const [fileError, setFileError] = useState('');
  useEffect(() => () => { if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview); }, [preview]);
  const handleChange = (event) => setFormData((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  const handleImage = (event) => {
    const file = event.target.files[0];
    setFileError('');
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) { setFileError('Choose a JPG, PNG, WebP, or GIF image.'); event.target.value = ''; return; }
    if (file.size > 5 * 1024 * 1024) { setFileError('Image must be 5 MB or smaller.'); event.target.value = ''; return; }
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setFormData((previous) => ({ ...previous, imageFile: file, removeImage: false }));
  };
  const removeImage = () => {
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    setPreview(null);
    setFormData((previous) => ({ ...previous, imageFile: null, removeImage: Boolean(initialData.image) }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const succeeded = await onSubmit(formData);
    if (succeeded && !initialData._id) setFormData({ title: '', body: '', imageFile: null, removeImage: false });
  };
  return (
    <form onSubmit={handleSubmit} className="post-form">
      <div className="form-group"><label htmlFor="title">Title</label><input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required maxLength="200" autoFocus /></div>
      <div className="form-group"><label htmlFor="body">Content</label><textarea id="body" name="body" value={formData.body} onChange={handleChange} required rows="6" /></div>
      <div className="form-group"><label htmlFor="image">Cover image <span className="optional-label">Optional</span></label><input className="file-input" type="file" id="image" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImage} /><p className="field-help">JPG, PNG, WebP, or GIF. Maximum 5 MB.</p>{fileError && <p className="field-error" role="alert">{fileError}</p>}{preview && <div className="image-preview"><img src={preview} alt="Selected cover preview" /><button type="button" className="remove-image-btn" onClick={removeImage}>Remove image</button></div>}</div>
      <button type="submit" className="submit-btn" disabled={disabled || Boolean(fileError)}>{disabled ? 'Saving...' : buttonText}</button>
    </form>
  );
};
export default PostForm;
