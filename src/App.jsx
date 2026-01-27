import { useEffect, useState } from "react";

function App() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchUsers = async () => {
    if (!query) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);
    setError("");
    setUsers([]);

    try {
      const res = await fetch(
        `https://api.github.com/search/users?q=${query}`
      );
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        setUsers(data.items);
      } else {
        setError("No users found");
      }
    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  const clearSearch = () => {
    setQuery("");
    setUsers([]);
    setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchUsers();
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col items-center p-6">
      <div className="w-full max-w-2xl bg-[#161b22] border border-gray-700 p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-white mb-4">
          GitHub User Finder
        </h1>

        <div className="flex gap-3">
          <input
            className="flex-1 border border-gray-700 bg-[#0d1117] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type username or name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
          />

          <button
            onClick={searchUsers}
            className="bg-[#238636] text-white p-3 rounded-lg hover:bg-[#2ea043]"
          >
            Search
          </button>
        </div>

        {loading && (
          <p className="mt-4 text-center text-white">Loading...</p>
        )}
        {error && (
          <p className="mt-4 text-center text-red-400">{error}</p>
        )}
      </div>

      {users.length > 0 && (
        <div className="w-full max-w-5xl flex justify-end mt-6">
          <button
            onClick={clearSearch}
            className="bg-gray-700 text-white px-6 py-2 rounded-full shadow-lg hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
      )}

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

function UserCard({ user }) {
  const [bio, setBio] = useState("");
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const res = await fetch(`https://api.github.com/users/${user.login}`);
      const data = await res.json();
      setBio(data.bio); // bio only if exists
    };

    const fetchRepos = async () => {
      const res = await fetch(
        `https://api.github.com/users/${user.login}/repos?sort=stars&per_page=3`
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setRepos(data);
      } else {
        setRepos([]);
      }
    };

    fetchUserDetails();
    fetchRepos();
  }, [user.login]);

  return (
    <div
      className="cursor-pointer bg-[#0d1117] border border-gray-700 rounded-2xl shadow-xl p-4 hover:bg-[#161b22] transition"
      onClick={() => window.open(user.html_url, "_blank")}
    >
      <img
        className="w-24 h-24 rounded-full mx-auto border border-gray-700"
        src={user.avatar_url}
        alt="avatar"
      />

      <h2 className="text-xl font-bold text-center text-white mt-2">
        {user.login}
      </h2>

      {bio && (
        <p className="text-center text-gray-300 mt-2">
          {bio}
        </p>
      )}

      {repos.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold text-white">Top Repos</h3>

          {repos.map((repo, index) => (
            <div key={repo.id} className="mt-2">
              <p className="text-sm text-gray-200">
                {index + 1}. {repo.name}
              </p>
              <a
                href={repo.html_url}
                target="_blank"
                className="text-sm text-blue-400 underline"
                rel="noreferrer"
              >
                View
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
