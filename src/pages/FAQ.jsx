import { useEffect, useState, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

function FAQ() {
  const [docs, setDocs] = useState([]);
  const [activeDoc, setActiveDoc] = useState('');
  const [content, setContent] = useState('');
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
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
        setActiveDoc(data[0]);
      })
      .catch(err => console.error('Error loading manifest:', err));
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
      .then(setContent)
      .catch(err => {
        console.error(`Error loading /docs/${activeDoc}:`, err);
        setContent('⚠️ Failed to load content.');
      })
      .finally(() => setLoadingDoc(false));
  }, [activeDoc]);

  // Scroll handler
  const handleScroll = useCallback(() => {
    if (!contentRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const totalScrollable = scrollHeight - clientHeight;

    if (totalScrollable > 0) {
      const progress = Math.round((scrollTop / totalScrollable) * 100);
      setScrollProgress(progress);
    }
  }, []);

  // Setup scroll listener
  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    element.addEventListener('scroll', handleScroll, { passive: true });
    return () => element.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleDocSelect = (doc) => {
    setActiveDoc(doc);
    setMobileMenuOpen(false);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };

  const formatDocName = (doc) => {
    return doc.replace('.md', '').replace(/-/g, ' ');
  };

  return (
    <>
      <style>{`
        .faq-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .faq-progress {
          height: 3px;
          background: #f0f0f0;
          position: relative;
        }
        
        .faq-progress-bar {
          height: 100%;
          background: #2185d0;
          transition: width 0.1s ease;
        }
        
        .faq-content {
          flex: 1;
          display: flex;
          overflow: hidden;
        }
        
        .faq-sidebar {
          width: 280px;
          background: #f8f9fa;
          border-right: 1px solid #dee2e6;
          overflow-y: auto;
        }
        
        .faq-main {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
        }
        
        .faq-menu-item {
          display: block;
          padding: 0.75rem 1rem;
          color: #495057;
          text-decoration: none;
          border-bottom: 1px solid #e9ecef;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .faq-menu-item:hover {
          background: #e9ecef;
          color: #495057;
          text-decoration: none;
        }
        
        .faq-menu-item.active {
          background: #2185d0;
          color: white;
        }
        
        .faq-mobile-toggle {
          display: none;
          padding: 1rem;
          background: #f8f9fa;
          border-bottom: 1px solid #dee2e6;
        }
        
        .faq-scroll-info {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 12px;
          z-index: 1000;
        }
        
        @media (max-width: 768px) {
          .faq-mobile-toggle {
            display: block;
          }
          
          .faq-sidebar {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 100%;
            z-index: 100;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }
          
          .faq-sidebar.open {
            transform: translateX(0);
          }
          
          .faq-main {
            padding: 1rem;
          }
          
          .faq-content {
            position: relative;
          }
        }
        
        .markdown-content h1 { margin-top: 0; }
        .markdown-content h2, .markdown-content h3 { margin-top: 2rem; }
        .markdown-content p { margin-bottom: 1rem; line-height: 1.6; }
        .markdown-content pre { 
          background: #f8f9fa; 
          padding: 1rem; 
          border-radius: 4px; 
          overflow-x: auto; 
        }
      `}</style>

      <div className="faq-container">
        {/* Progress Bar */}
        <div className="faq-progress">
          <div
            className="faq-progress-bar"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Mobile Toggle */}
        <div className="faq-mobile-toggle">
          <button
            className="ui button fluid"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className="bars icon"></i>
            {activeDoc ? formatDocName(activeDoc) : 'Select Document'}
          </button>
        </div>

        <div className="faq-content">
          {/* Sidebar */}
          <div className={`faq-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
            {docs.map(doc => (
              <a
                key={doc}
                className={`faq-menu-item ${doc === activeDoc ? 'active' : ''}`}
                onClick={() => handleDocSelect(doc)}
              >
                {formatDocName(doc)}
              </a>
            ))}
          </div>

          {/* Main Content */}
          <div
            ref={contentRef}
            className="faq-main"
          >
            {loadingDoc ? (
              <div className="ui active loader"></div>
            ) : (
              <div className="markdown-content">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        {/* Scroll Progress Indicator */}
        {scrollProgress > 0 && (
          <div className="faq-scroll-info">
            {scrollProgress}%
          </div>
        )}
      </div>
    </>
  );
}

export default FAQ;
