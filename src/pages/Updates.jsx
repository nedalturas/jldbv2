import { useEffect, useState, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './faq.module.css';

function Updates() {
  const [docs, setDocs] = useState([]);
  const [activeDoc, setActiveDoc] = useState('');
  const [content, setContent] = useState('');
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contentRef = useRef(null);

  // Load manifest.json
  useEffect(() => {
    fetch('/docs/manifest.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load manifest');
        return res.json();
      })
      .then(data => {
        setDocs(data);
        if (data.length > 0) {
          setActiveDoc(data[0]);
        }
      })
      .catch(err => {
        console.error('Error loading manifest:', err);
        setContent('⚠️ Failed to load documentation.');
      });
  }, []);

  // Load active markdown file
  useEffect(() => {
    if (!activeDoc) return;
    setLoadingDoc(true);
    
    fetch(`/docs/${activeDoc}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load doc');
        return res.text();
      })
      .then(content => {
        setContent(content);
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
        }
      })
      .catch(err => {
        console.error(`Error loading /docs/${activeDoc}:`, err);
        setContent('⚠️ Failed to load content.');
      })
      .finally(() => setLoadingDoc(false));
  }, [activeDoc]);

  const handleDocSelect = useCallback((doc) => {
    setActiveDoc(doc);
    setMobileMenuOpen(false);
  }, []);

  const formatDocName = useCallback((doc) => {
    return doc.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <div className="ui container">
      {/* Mobile Header */}
      <div className={`${styles.mobileHeader} ui menu`}>
        <div className="item">
          <button 
            className={`ui basic icon button ${styles.menuToggle}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <i className={`${mobileMenuOpen ? 'times' : 'bars'} icon`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      <div className={`ui left sidebar vertical menu ${mobileMenuOpen ? 'visible' : ''} ${styles.mobileSidebar}`}>
        <div className="item">
          <div className="header">Documentation</div>
        </div>
        <div className="ui divider"></div>
        {docs.map(doc => (
          <a
            key={doc}
            className={`item ${activeDoc === doc ? 'active' : ''}`}
            onClick={() => handleDocSelect(doc)}
          >
            <i className="file text outline icon"></i>
            {formatDocName(doc)}
          </a>
        ))}
      </div>

      {/* Overlay for mobile menu */}
      <div 
        className={`${styles.overlay} ${mobileMenuOpen ? styles.visible : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div className={`ui stackable grid ${styles.mainGrid}`}>
        {/* Desktop Sidebar */}
        <div className={`four wide column ${styles.sidebarColumn}`}>
          <div className={`ui vertical fluid tabular menu ${styles.desktopSidebar}`}>
            <div className="item">
              <div className="ui small header">
                <i className="book icon"></i>
                Documentation
              </div>
            </div>
            <div className="ui divider"></div>
            {docs.map(doc => (
              <a
                key={doc}
                className={`item ${activeDoc === doc ? 'active' : ''}`}
                onClick={() => handleDocSelect(doc)}
              >
                <i className="file text outline icon"></i>
                {formatDocName(doc)}
              </a>
            ))}
          </div>
        </div>
        
        {/* Content Area */}
        <div className={`twelve wide stretched column ${styles.contentColumn}`}>
          <div className={`ui segment ${styles.contentSegment}`} ref={contentRef}>
            <div className="ui header">
              <i className="file text icon"></i>
              <div className="content">
                {formatDocName(activeDoc)}
                <div className="sub header">Documentation</div>
              </div>
            </div>
            
            <div className="ui divider"></div>
            
            {loadingDoc ? (
              <div className="ui active centered inline loader"></div>
            ) : (
              <div className={`${styles.markdownContent} ui basic segment`}>
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Updates;