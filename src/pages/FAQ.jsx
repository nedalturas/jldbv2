import { useEffect, useState, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './faq.module.css'

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
      <div className={styles['faq-container']}>
        {/* Progress Bar */}
        <div className={styles['faq-progress']}>
          <div
            className={styles['faq-progress-bar']}
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Mobile Toggle */}
        <div className={styles['faq-mobile-toggle']}>
          <button
            className="ui button fluid" // Keep Fomantic UI classes
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className="bars icon"></i>
            {activeDoc ? formatDocName(activeDoc) : 'Select Document'}
          </button>
        </div>

        <div className={styles['faq-content']}>
          {/* Sidebar */}
          <div className={`${styles['faq-sidebar']} ${mobileMenuOpen ? styles.open : ''}`}>
            {docs.map(doc => (
              <a
                key={doc}
                className={`${styles['faq-menu-item']} ${doc === activeDoc ? styles.active : ''}`}
                onClick={() => handleDocSelect(doc)}
              >
                {formatDocName(doc)}
              </a>
            ))}
          </div>

          {/* Main Content */}
          <div
            ref={contentRef}
            className={styles['faq-main']}
          >
            {loadingDoc ? (
              <div className="ui active loader"></div> // Keep Fomantic UI classes
            ) : (
              <div className={styles['markdown-content']}>
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        {/* Scroll Progress Indicator */}
        {scrollProgress > 0 && (
          <div className="faq-scroll-info">
            {scrollProgress}% {/* This is content, not a class name */}
          </div>
        )}
      </div>
    </>
  );
}

export default FAQ;
