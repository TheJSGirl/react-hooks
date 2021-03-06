/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

const API = 'http://hn.algolia.com/api/v1/search?query=';

function App() {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState('reactjs');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const searchInputRef = useRef();

  useEffect(() => {
    callAPI();
  }, []);

  const callAPI = async () => {
    if (search) {
      try {
        setLoading(true);
        const res = await axios.get(`${API}${search}`);
        setResults(res.data.hits);
        setLoading(false);
        setSearch('');
        searchInputRef.current.focus();
      } catch (err) {
        setErr(err.message);
      }
    }
  }

  const handleSearch = async (e) => {
    setSearch(e.target.value);
  }

  const handleKeyDown = async (e) => {
    if (e.keyCode === 13) {
      await callAPI();
    }
  }

  return (
    <div className="main-container">
      <div className="app">
        <div className="header">
          <h1>HACKER NEWS</h1>
        </div>
        <div className="container">
          <input
            type="text"
            placeholder={"search here"}
            value={search}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            ref={searchInputRef}
          />

          <button
            className="btn"
            onClick={async () => await callAPI()}
          ><span>SEARCH</span></button>
        </div>
        <br />
      </div>
      <div className="news-holder">
        {
          loading && !err ? <div class="lds-loader"><div></div><div></div><div></div></div> :
            (
              <ul>
                {
                  results.map((item) => (
                    item.title && item.url ? (
                      <li key={item.objectID}>
                        <a href={item.url}>{item.title}</a>
                      </li>
                    ) : null
                  ))
                }
              </ul>
            )
        }
      </div>

      {
        err && (
          <div class="error">{err}</div>
        )
      }

    </div>
  );
}

export default App;
