import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, addPost, updatePost, deletePost } from '../store/slices/postsSlice';
import PostForm from '../components/PostForm';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import { getMediaUrl } from '../api';

const AdminPage = ({ adminMode = false }) => {
  const dispatch = useDispatch();
  const { posts, status, mutationStatus, error } = useSelector((state) => state.posts);
  const user = useSelector((state) => state.auth.user);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => { dispatch(fetchPosts()); }, [dispatch]);

  const handleAddPost = async (postData) => {
    const result = await dispatch(addPost(postData));
    if (!result.error) setFormOpen(false);
    return !result.error;
  };
  const handleUpdatePost = async (postData) => {
    const result = await dispatch(updatePost({ id: editingId, postData }));
    if (!result.error) { setEditingId(null); setFormOpen(false); }
    return !result.error;
  };
  const handleDeletePost = async () => {
    const result = await dispatch(deletePost(deleteTarget._id));
    if (!result.error) setDeleteTarget(null);
  };
  const openCreate = () => { setEditingId(null); setFormOpen(true); };
  const openEdit = (id) => { setEditingId(id); setFormOpen(true); };
  const closeForm = () => { if (mutationStatus !== 'loading') { setEditingId(null); setFormOpen(false); } };
  const postToEdit = editingId ? posts.find((post) => post._id === editingId) : null;
  const visiblePosts = adminMode ? posts : posts.filter((post) => (post.author?._id || post.author) === user.id);

  if (status === 'loading') return <Loading />;

  return (
    <div className="admin-page"><div className="container">
      <div className="dashboard-heading">
        <div><p className="eyebrow">{adminMode ? 'Administrator' : 'Writer studio'}</p><h1>{adminMode ? 'Manage all stories' : `Welcome, ${user.name}`}</h1></div>
        <div className="dashboard-actions"><p>{adminMode ? 'Review, edit, or remove any story published on the site.' : 'Draft a new story or manage what you have published.'}</p>{!adminMode && <button className="primary-btn" onClick={openCreate}>+ New story</button>}</div>
      </div>
      {error && <div className="alert" role="alert">{error}</div>}

      <div className="admin-section">
        <div className="section-title-row"><h2>{adminMode ? 'All Posts' : 'Manage Posts'}</h2>{adminMode && <span className="count-badge">{visiblePosts.length} total</span>}</div>
        {visiblePosts.length === 0 ? <div className="empty-state"><h3>No published stories</h3><p>{adminMode ? 'No one has published a story yet.' : 'Your posts will appear here after publishing.'}</p></div> : (
          <div className="posts-list">{visiblePosts.map((post) => (
            <div key={post._id} className="admin-post-card">
              {post.image && <img className="admin-post-image" src={getMediaUrl(post.image)} alt="" />}
              {adminMode && <p className="admin-author">By {post.author?.name || 'Unknown writer'}</p>}
              <h3>{post.title}</h3>
              <p>{post.body.length > 100 ? `${post.body.substring(0, 100)}...` : post.body}</p>
              <div className="post-actions"><button onClick={() => openEdit(post._id)} className="edit-btn">Edit</button><button onClick={() => setDeleteTarget(post)} className="delete-btn">Delete</button></div>
            </div>
          ))}</div>
        )}
      </div>

      {formOpen && <Modal title={editingId ? 'Edit story' : 'Create a new story'} eyebrow={adminMode ? 'Administrator' : 'Writer studio'} onClose={closeForm} size="large"><PostForm key={editingId || 'new'} initialData={postToEdit || { title: '', body: '' }} onSubmit={editingId ? handleUpdatePost : handleAddPost} buttonText={editingId ? 'Save changes' : 'Publish story'} disabled={mutationStatus === 'loading'} /></Modal>}
      {deleteTarget && <Modal title="Delete this story?" eyebrow="Please confirm" onClose={() => mutationStatus !== 'loading' && setDeleteTarget(null)}><p className="modal-copy">&quot;{deleteTarget.title}&quot; will be permanently removed. This action cannot be undone.</p><div className="confirm-actions"><button className="cancel-btn" onClick={() => setDeleteTarget(null)} disabled={mutationStatus === 'loading'}>Keep story</button><button className="delete-confirm-btn" onClick={handleDeletePost} disabled={mutationStatus === 'loading'}>{mutationStatus === 'loading' ? 'Deleting...' : 'Delete story'}</button></div></Modal>}
    </div></div>
  );
};

export default AdminPage;
