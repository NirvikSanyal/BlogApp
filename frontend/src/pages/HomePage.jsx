import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts } from '../store/slices/postsSlice';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';

const HomePage = () => {
  const dispatch = useDispatch();
  const { posts, status, error } = useSelector(state => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  if (status === 'loading') return <Loading />;
  if (status === 'failed') return <div className="error">Error: {error}</div>;

  return (
    <div className="home-page">
      <div className="container">
        <section className="hero">
          <p className="eyebrow">Ideas worth sharing</p>
          <h1>Stories, notes, and fresh perspectives.</h1>
          <p>Explore what our community is thinking—or sign in and add your own voice.</p>
        </section>
        <div className="posts-grid">
          {posts.length === 0 && <div className="empty-state"><h2>No stories yet</h2><p>Be the first writer to publish something.</p></div>}
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
