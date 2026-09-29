import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../store/slices/postsSlice';
import { getMediaUrl } from '../api';
import Loading from '../components/Loading';

const PostDetailPage = () => {
  const { id } = useParams();
  const { posts, status } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  useEffect(() => { if (status === 'idle') dispatch(fetchPosts()); }, [dispatch, status]);
  const post = posts.find((item) => item._id === id);
  if (status === 'idle' || status === 'loading') return <Loading />;
  if (!post) return <div className="post-detail"><p>Post not found</p><Link to="/" className="back-btn">Back to Home</Link></div>;
  return (
    <article className="post-detail">
      <h1>{post.title}</h1>
      <p className="detail-meta">By {post.author?.name || 'Unknown writer'} &middot; {new Date(post.createdAt).toLocaleDateString()}</p>
      {post.image && <img className="post-hero-image" src={getMediaUrl(post.image)} alt={`Cover for ${post.title}`} />}
      <p className="post-body">{post.body}</p>
      <Link to="/" className="back-btn">Back to Home</Link>
    </article>
  );
};
export default PostDetailPage;
