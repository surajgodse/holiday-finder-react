import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = 'OGkH00Y8nnUsmSAStrur8mMf02D7dd5R';

const HolidayFinder = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [year, setYear] = useState(new Date().getFullYear());
  const [holidays, setHolidays] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchHolidays();
    }
  }, [selectedCountry, year]);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://calendarific.com/api/v2/countries?api_key=${API_KEY}`);
      setCountries(response.data.response.countries);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setError('Failed to fetch countries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${selectedCountry}&year=${year}`);
      setHolidays(response.data.response.holidays);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      setError('Failed to fetch holidays. Please try again.');
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  };

  const getHolidayIcon = (types) => {
    if (types.includes('National holiday')) return '🇺🇸';
    if (types.includes('Religious')) return '🙏';
    if (types.includes('Observance')) return '👀';
    return '🎉';
  };

  const calculateCountdown = (date) => {
    const today = new Date();
    const holidayDate = new Date(date);
    const timeDiff = holidayDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff > 0 ? daysDiff : 0;
  };

  const handleSearch = () => {
    fetchHolidays();
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setHolidays([]);  // Clear holidays when country changes
  };

  const filteredHolidays = holidays.filter(holiday => {
    const holidayMonth = new Date(holiday.date.iso).getMonth() + 1;
    return (
      (!selectedMonth || holidayMonth === parseInt(selectedMonth)) &&
      (!selectedType || holiday.type.includes(selectedType))
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
<div className="holiday-finder">
      <h1 className="project-title">Global Holiday Explorer</h1>
      <h2 className="section-heading">Find Holidays Around the World</h2>
      <div className="controls">
        <select 
          value={selectedCountry} 
          onChange={handleCountryChange}
        >
          <option key="select-country" value="">United States</option>
          {countries.map(country => (
            <option key={country.iso2} value={country.iso2}>{country.country_name}</option>
          ))}
        </select>
        <select 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option key="all-months" value="">All months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={`month-${i + 1}`} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <select 
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option key="all-types" value="">All types</option>
          <option key="national-holiday" value="National holiday">National holiday</option>
          <option key="religious" value="Religious">Religious</option>
          <option key="observance" value="Observance">Observance</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="holiday-list">
        {filteredHolidays.map((holiday, index) => (
          <div key={`${holiday.date.iso}-${holiday.name}-${index}`} className="holiday-item">
            <span className="holiday-icon">{getHolidayIcon(holiday.type)}</span>
            <div className="holiday-info">
              <h3>{holiday.name}</h3>
              <p>{new Date(holiday.date.iso).toLocaleDateString()}</p>
              <p>{holiday.description}</p>
            </div>
            <div className="holiday-countdown">
              {calculateCountdown(holiday.date.iso)} days left
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HolidayFinder;