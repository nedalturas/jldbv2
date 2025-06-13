import React, { useEffect, useRef } from 'react';

function CompanyModal({ company, open, onClose }) {
  const modalRef = useRef(null);

  const getCityCoverage = (company) => {
    const cities = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Al-Ain'];
    return cities
      .filter((city) => {
        const value = company?.[city];
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

  useEffect(() => {
    if (window.$ && modalRef.current) {
      window.$(modalRef.current).modal({
        closable: false,
        onHidden: onClose,
        transition: 'fade up',
        offset: 0,
      });
    }
  }, []);

  useEffect(() => {
    if (window.$ && modalRef.current) {
      const $modal = window.$(modalRef.current);
      if (open) {
        $modal.modal('show');
      } else {
        $modal.modal('hide');
      }
    }
  }, [open]);

  return (
    <div ref={modalRef} className="ui top aligned modal">
      <div className="header">
        <i className="building icon"></i>
        {company?.['Company Name'] || 'Company Details'}
      </div>
      <div className="content">
        <div className="ui relaxed list">
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
        <div className="ui negative button" onClick={onClose}>
          <i className="times icon"></i>
          Close
        </div>
      </div>
    </div>
  );
}

export default CompanyModal;
