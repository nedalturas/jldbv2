import { useEffect, useState, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import './faq.module.css'; // Import the external CSS file
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
    <div className="ui container"> {/* Center the content */}
    <div className="faq-container">
      {/* Scroll progress bar */}
      <div className="faq-progress">
        <div className="faq-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      <div className="ui grid stackable faq-content-wrapper">
        {/* Mobile menu button */}
        <div className="ui mobile only grid faq-mobile-toggle">
          <div className="column">
            <button
              className={`ui icon button ${mobileMenuOpen ? 'active' : ''}`}
              aria-label="Toggle navigation menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              Menu
              <i className="bars icon"></i>
            </button>
          </div>
        </div>

        {/* Sidebar */}
        {/* The 'hidden' class is removed here and controlled by CSS for responsiveness */}
        <div className={`ui five wide tablet three wide computer column faq-sidebar ${mobileMenuOpen ? 'visible-mobile' : ''}`}>
          <div className="ui vertical fluid tabular menu">
            {docs.map((doc, index) => (
              <a
                key={index}
                className={`item ${activeDoc === doc ? 'active' : ''}`}
                onClick={() => handleDocSelect(doc)}
              >
                {formatDocName(doc)}
              </a>
            ))}
          </div>
        </div>

        {/* Main content */}
        {/* The 'hidden' class is removed here and controlled by CSS for responsiveness */}
        <div className="ui eleven wide tablet thirteen wide computer column faq-main-content">
          <div className="faq-content-area" ref={contentRef}>
            {loadingDoc ? (
              <div className="ui active dimmer">
                <div className="ui loader"></div>
              </div>
            ) : (
              <div className="ui basic segment">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
    </div>
  );
}

export default FAQ