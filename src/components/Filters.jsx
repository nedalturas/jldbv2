import React, { useState, useEffect } from 'react';

function Filters({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [serviceTypes, setServiceTypes] = useState([]);

  useEffect(() => {
    // Initialize dropdowns when component mounts
    if (typeof window !== 'undefined' && window.$) {
      window.$('.ui.dropdown').dropdown();
    }

    // Fetch data to get unique service types
    fetch('https://opensheet.vercel.app/1aAOwWOLyUdbT2a3F4IBTHDPnXBlBH240OFtIKom5H9Q/Sheet1')
      .then(res => res.json())
      .then(data => {
        // Get unique service types by splitting and flattening
        const allServices = data
          .map(item => item['Service Type']?.split(',').map(s => s.trim()))
          .flat()
          .filter(Boolean);
        const uniqueServices = [...new Set(allServices)].sort();
        setServiceTypes(uniqueServices);
      });
  }, []);

  const handleFilterChange = () => {
    onFilterChange({
      searchTerm,
      selectedCity: selectedCity === 'all' ? '' : selectedCity,
      selectedService: selectedService === 'all' ? '' : selectedService
    });
  };

  useEffect(() => {
    handleFilterChange();
  }, [searchTerm, selectedCity, selectedService]);

  return (
    <div className="ui container" style={{ marginTop: '4em' }}>
      <div className="ui form">
        <div className="three fields">

          <div className="field">
            <label>Select City</label>
            <select
              className="ui search dropdown"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="all">All Cities</option>
              <option value="Dubai">Dubai</option>
              <option value="Abu Dhabi">Abu Dhabi</option>
              <option value="Sharjah">Sharjah</option>
              <option value="Ajman">Ajman</option>
              <option value="Al-Ain">Al-Ain</option>
            </select>
          </div>



          <div className="field">
            <label>Select Service</label>
            <select
              className="ui search dropdown"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <option value="all">All Services</option>
              {serviceTypes.map((service, index) => (
                <option key={index} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>


          <div className="field">
            <label>Search Company</label>
            <div className="ui icon input">
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="search icon"></i>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Filters;
