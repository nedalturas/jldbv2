import React, { useEffect, useState, useMemo } from 'react';
import CompanyModal from './CompanyModal';
import styles from './DataTable.module.css';

import 'bootstrap/dist/css/bootstrap.min.css';
// Constants
const CITIES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Al-Ain'];
const TRUTHY_VALUES = ['✓', '✔', 'TRUE', true, '1'];
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const MAX_VISIBLE_PAGES = 5;

function DataTable({ filters }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pagination states/
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

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
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load sheet data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.$) {
      window.$('.ui.dropdown').dropdown();
    }
  }, []);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (!filters || !data.length) return data;

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
      filtered = filtered.filter((item) =>
        TRUTHY_VALUES.includes(item[filters.selectedCity])
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

    return filtered;
  }, [filters, data]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData]);

  // Pagination calculations
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= MAX_VISIBLE_PAGES) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const getCityCoverage = (company) => {
    return CITIES
      .filter((city) => TRUTHY_VALUES.includes(company[city]))
      .join(', ');
  };

  const handleWhatsAppClick = (whatsappLink) => {
    if (!whatsappLink) return;
    window.open(whatsappLink, '_blank');
  };

  const handleViewDetails = (company) => {
    setSelectedCompany(company);
    setModalOpen(true);
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
      <div className="ui container" style={{ marginTop: '4em', marginBottom: '4em'}}>
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
    <>
      <div className="ui container" style={{ marginTop: '4em' }}>
        
       {/* Items per page selector and info */}
         <div className="ui borderless menu">

          <div className="item">
            <div className='value'>
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} items
            </div>

          </div>
          <div className="right menu">
            <select
              className="ui dropdown"
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            >
              {PAGE_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Table */}
        <div className="table-responsive">
          <table className={`table table-hover align-middle ${styles.boldHeaders}`}>
            <thead >
              <tr>
                <th>Company Name</th>
                <th >Coverage</th>
                <th>Service Types</th>
                <th >Status</th>
                <th >Actions</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {currentItems.map((item, index) => (
                <tr key={startIndex + index}>
                  <td>{item['Company Name']}</td>
                  <td>{getCityCoverage(item)}</td>
                  <td>{item['Service Type'] || 'N/A'}</td>
                  <td>
                    <div
                      className={`ui ${item.Status === 'Active' ? 'text-bg-success' : 'text-bg-danger'} badge rounded-pill`}
                    >
                      {item.Status}
                    </div>
                  </td>
                  <td>

                    <div className="btn-group">
                      <div className="btn btn-sm mini ui vertical animated button"
                        tabIndex={0}
                        onClick={() => handleViewDetails(item)}>
                        <div className="hidden content">View</div>
                        <div className="visible content">
                          <i className="eye icon"></i>
                        </div>
                      </div>

                      {item['Whatsapp'] && (
                        <div className="btn btn-sm mini ui animated button"
                          onClick={() => handleWhatsAppClick(item['Whatsapp'])}
                          style={{ backgroundColor: '#25D366' }}
                        >
                          <div className="visible content">
                            <i className="whatsapp icon" style={{ fontWeight: 'bolder' }}></i>
                          </div>
                          <div className="hidden content">Chat</div>
                        </div>
                      )}

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>


        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="ui center aligned container " style={{
            marginTop: '2em', marginBottom: '2em', cursor: 'pointer'
          }}>
            <div className="ui pagination selectable menu link">
              {/* Previous button */}
              <div
                className={`icon item ${currentPage === 1 ? 'disabled' : ''}`}
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              >
                <i className="left chevron icon"></i>
              </div>

              {/* First page */}
              {getPageNumbers()[0] > 1 && (
                <>
                  <div
                    className="item"
                    onClick={() => handlePageChange(1)}
                  >
                    1
                  </div>
                  {getPageNumbers()[0] > 2 && (
                    <div className="disabled item">...</div>
                  )}
                </>
              )}

              {/* Page numbers */}
              {getPageNumbers().map(page => (
                <div
                  key={page}
                  className={`item ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </div>
              ))}

              {/* Last page */}
              {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                <>
                  {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                    <div className="disabled item">...</div>
                  )}
                  <div
                    className="item"
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </div>
                </>
              )}

              {/* Next button */}
              <div
                className={`icon item ${currentPage === totalPages ? 'disabled' : ''}`}
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              >
                <i className="right chevron icon"></i>
              </div>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <CompanyModal
          company={selectedCompany}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}

export default DataTable;