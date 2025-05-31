import React, { useEffect, useState } from 'react';

function DataTable({ filters }) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      'https://opensheet.vercel.app/1aAOwWOLyUdbT2a3F4IBTHDPnXBlBH240OFtIKom5H9Q/Sheet1'
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setFilteredData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load sheet data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!filters) return;

    let filtered = data;

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item['Company Name']?.toLowerCase().includes(searchLower) ||
          item['Service Type']?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.selectedCity) {
      filtered = filtered.filter(
        (item) =>
          item[filters.selectedCity] === '✓' ||
          item[filters.selectedCity] === '✔' ||
          item[filters.selectedCity] === 'TRUE' ||
          item[filters.selectedCity] === true ||
          item[filters.selectedCity] === '1'
      );
    }

    if (filters.selectedService) {
      filtered = filtered.filter((item) =>
        item['Service Type']
          ?.split(',')
          .map((s) => s.trim())
          .includes(filters.selectedService)
      );
    }

    setFilteredData(filtered);
  }, [filters, data]);

  const getCityCoverage = (company) => {
    const cities = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Al-Ain'];
    return cities
      .filter((city) => {
        const value = company[city];
        return (
          value === '✓' ||
          value === '✔' ||
          value === 'TRUE' ||
          value === true ||
          value === '1'
        );
      })
      .join(', ');
  };

  const handleWhatsAppClick = (whatsappLink) => {
    if (!whatsappLink) return;

    window.open(whatsappLink, '_blank');
  };

  const handleViewDetails = (company) => {
    const modalContent = `
      <div class="header">${company['Company Name']}</div>
      <div class="content">
        <div class="description">
          <p><strong>Service Types:</strong> ${company['Service Type'] || 'N/A'
      }</p>
          <p><strong>Coverage:</strong> ${getCityCoverage(company)}</p>
          <p><strong>Status:</strong> ${company.Status}</p>
          ${company['WhatsApp Number']
        ? `<p><strong>WhatsApp:</strong> ${company['WhatsApp Number']}</p>`
        : ''
      }
        </div>
      </div>
    `;

    const $modal = window.$('<div>').addClass('ui modal').html(modalContent);
    window.$('body').append($modal);
    $modal.modal('show');
  };

  if (loading) {
    return (
      <div className="ui container" style={{ marginTop: '4em' }}>
        <div className="ui active loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ui container" style={{ marginTop: '4em' }}>
        <div className="ui negative message">
          <div className="header">Error loading data</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!filteredData || filteredData.length === 0) {
    return (
      <div className="ui container" style={{ marginTop: '4em' }}>
        <div className="" style={{
          width: '100%',
          minHeight: '250px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '4em 2em'
        }}>
          <div className="ui icon header" style={{
            color: '#999',
            marginBottom: '2em',
            fontSize: '2.5em'
          }}>
            <i className="sad tear icon" style={{
              color: 'var(--company-color)',
              fontSize: '4em',
              marginBottom: '0.5em'
            }}></i>
            <div className="content" style={{ fontSize: '1.5em', fontWeight: 'normal' }}>
              No Results Found
              <div className="sub header" style={{
                fontSize: '0.4em',
                color: '#666',
                marginTop: '1em',
                lineHeight: '1.5'
              }}>
                We couldn't find any companies matching your search criteria.
                <br />
                Try adjusting your filters or search terms.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ui container" style={{ marginTop: '4em' }}>
      <table className="ui fixed single line selectable striped padded table">
        <thead style={{ backgroundColor: '#fff !important' }}>
          <tr>
            <th className='four wide'>Company Name</th>
            <th className='two wide'>Coverage</th>
            <th className='three wide'>Service Types</th>
            <th className='two wide'>Status</th>
            <th className='three wide' >Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item['Company Name']}</td>
              <td>{getCityCoverage(item)}</td>
              <td>{item['Service Type'] || 'N/A'}</td>
              <td>
                <div
                  className={`ui ${item.Status === 'Active' ? 'green' : 'red'
                    } circular basic mini label `}
                >
                  {item.Status}
                </div>
              </td>
              <td>

                <div className="mini ui vertical animated button"
                  tabIndex={0}
                  onClick={() => handleViewDetails(item)}>

                  <div className="hidden content">View</div>
                  <div className="visible content">
                    <i className="eye icon"></i>
                  </div>

                </div>

                {item['Whatsapp'] && (

                  <div className="mini ui animated button"
                    onClick={() => handleWhatsAppClick(item['Whatsapp'])}
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <div className="visible content">
                      <i className="whatsapp icon" style={{ fontWeight: 'bolder' }}></i>
                    </div>
                    <div className="hidden content">Chat</div>
                  </div>

                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;

