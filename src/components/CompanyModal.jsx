import React from 'react';

// Constants
const CITIES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Al-Ain'];
const TRUTHY_VALUES = ['✓', '✔', 'TRUE', true, '1'];

function CompanyModal({ company, open, onClose }) {
  const getCityCoverage = (company) => {
    return CITIES
      .filter((city) => {
        const value = company?.[city];
        return TRUTHY_VALUES.includes(value);
      })
      .join(', ');
  };

  if (!open) return null;

  

  return (
    <div 
      className="ui dimmer modals page transition visible active"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1001,
        backgroundColor: 'rgba(0,0,0,0.85)',
      }}
    >
      <div 
        className="ui top aligned modal transition visible active"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          margin: '1rem auto',
          maxWidth: '500px',
          top: '10%',
          height: 'auto',
        }}
      >
        <div className="header">
          <i className="building icon" style={{ color: 'var(--company-color)'}}></i>
          {company?.['Company Name'] || 'Company Details'}
        </div>
        <div className="content">
          <div className="ui very relaxed list">
            <div className="item">
              <i className="cogs blue icon"></i>
              <div className="content">
                <div className="header">Service Types</div>
                <div className="description">{company?.['Service Type'] || 'N/A'}</div>
              </div>
            </div>
            <div className="item">
              <i className="map marker alternate green icon"></i>
              <div className="content">
                <div className="header">Coverage</div>
                <div className="description">{getCityCoverage(company) || 'N/A'}</div>
              </div>
            </div>
            <div className="item">
              <i className="check circle teal icon"></i>
              <div className="content">
                <div className="header">Status</div>
                <div className="description">{company?.Status || 'N/A'}</div>
              </div>
            </div>
            {company?.['WhatsApp Number'] && (
              <div className="item">
                <i className="whatsapp green icon"></i>
                <div className="content">
                  <div className="header">WhatsApp</div>
                  <div className="description">{company['WhatsApp Number']}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="actions">
          <div className="ui negative mini button" onClick={onClose}>
            <i className="times icon"></i>
            Close
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyModal;