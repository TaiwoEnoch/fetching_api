import { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

const RepositoryList = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const reposPerPage = 6; // 3 rows of 3 repos each

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.github.com/users/TaiwoEnoch/repos', {
          headers: {
            Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
          }
        });
        setRepos(response.data);
      } catch (error) {
        setError('Error fetching repositories');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter repositories based on search term
  const filteredRepos = repos.filter(repo => 
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = filteredRepos.slice(indexOfFirstRepo, indexOfLastRepo);
  const totalPages = Math.ceil(filteredRepos.length / reposPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="spinner border-t-4 border-b-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div></div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-4">{error}</div>;
  }

  return (
    <div className="repository-list p-4">
      <div className='py-10'>
        <h1 className='text-center text-2xl font-extrabold text-gray-400'>Fetch Github Repositories</h1>
      </div>
      <div className='mb-14 w-full text-center'>
        <input 
          type="text" 
          className="search-bar p-2 border border-gray-500 rounded w-[500px]" 
          placeholder="Search repositories..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {currentRepos.map(repo => (
          <div key={repo.id} className="card bg-white p-4 mb-4 rounded shadow-md">
            <h3 className="repo-name font-bold text-xl text-gray-400">{repo.name}</h3>
            <p className="repo-description text-gray-700">{repo.description || 'No description provided'}</p>
            <a href={repo.html_url} className="repo-link text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">View on GitHub</a>
          </div>
        ))}
      </div>
      <div className="pagination flex justify-center mt-4">
        <button 
          onClick={handlePreviousPage} 
          disabled={currentPage === 1}
          className="px-4 py-2 mx-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
        >
          &lt;
        </button>
        <button 
          onClick={handleNextPage} 
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default RepositoryList;
