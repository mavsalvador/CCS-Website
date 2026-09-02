import React, { useEffect, useState } from 'react';
import '../styles/index.css';
import { Header } from "../components/Header.jsx";
import { parseWecapDate } from '../lib/wecapDates.js';

export const WecapCards = (props) =>{
  const issueDate = parseWecapDate(props.uploaded_at);
  const monthDay = issueDate
    ? `${issueDate.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${issueDate.toLocaleString('default', { day: 'numeric' })}`
    : '';
  const year = issueDate ? issueDate.getFullYear() : '';

      return (
            <a
              key={props.id}
              href={props.filePath}
              target="_blank"
              rel="noopener noreferrer"
              className="wecap-archive-card"
            >
            <span className="wecap-archive-accent" aria-hidden="true" />
            <div className="wecap-archive-date">
                <span>{monthDay}</span>
                <span>{year}</span>
            </div>
            <div className="wecap-archive-content">
                <h4 className="wecap-archive-title nice-font">
                  Wecap {props.file_name}
                </h4>
            <div className="wecap-archive-tags simple-font">
                <span>PDF</span>
              </div>
            </div>
          </a>
    );
}


export const Archive = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, index) => currentYear - index);

  const [wecapsResults, setWecapsResults] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);

  //useffect to load in all at first
  useEffect(() => {
    const fetchWecaps = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/wecaps-archive`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ years: selectedYears }),
        });

        if (!response.ok) {
          throw new Error(`Archive request failed with ${response.status}`);
        }

        const data = await response.json();
        const results = data.recent_wecaps || [];
        setWecapsResults(results);
      } catch (error) {
        console.error('Error fetching wecaps:', error);
        setWecapsResults([]);
      }
    };

    fetchWecaps();
  }, [apiUrl, selectedYears]);

  //function to fetch from backend here and get new array of objects if form submkitted
  function handleFilter(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const selectedYears = formData.getAll('years');
    console.log(selectedYears)

    setSelectedYears(selectedYears);
  }

  return (
    <div>
        <Header title="Wecap Archive" subtitle="See our previous editions"/>

      <div className="wecap-archive-page">
        <div className="mb-8">
          <h1 className="nice-font text-start text-3xl !font-bold p-4"> CCS Archive</h1>
          <hr className="gradient-line"/>
        </div>

        <div className="wecap-archive-layout">
          <aside className="wecap-archive-filter-panel">
            <h2 className="nice-font text-xl !font-normal">Filter by Year</h2>
            <p className="simple-font wecap-archive-filter-note">
              Select one or more years
            </p>

            <form onSubmit={handleFilter} className="wecap-archive-filter-form">
              <fieldset className="wecap-archive-filter-fieldset">
                <legend className="simple-font">Years</legend>
                <div className="wecap-year-grid">
                  {years.map((year) => (
                    <label key={year} className="wecap-year-option simple-font">
                      <input type="checkbox" name="years" value={year} />
                      <span>{year}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="wecap-filter-actions">
                <button type="submit" className="wecap-filter-button">
                  Apply Filters
                </button>
                <button type="reset" className="wecap-filter-button wecap-filter-button-secondary">
                  Clear
                </button>
              </div>
            </form>
          </aside>

          <section className="wecap-archive-results">
            <h2 className="nice-font text-xl !font-normal">Results</h2>
            <p className="simple-font mt-3 mb-3 !text-sm !text-[#725648]">
              Showing {wecapsResults.length ? `1 - ${wecapsResults.length}` : '0'} 
            </p>
            <div className="wecap-archive-list">
              {wecapsResults.map((wecap) => (
                <WecapCards
                  key={wecap.id}
                  id={wecap.id}
                  uploaded_at={wecap.uploaded_at}
                  filePath={`${apiUrl}/api/get-pdf/${wecap.id}`}
                  file_name={wecap.file_name}
                />
              ))}
            </div>
          </section>
          </div>  
        </div>
    </div>
  );
};
