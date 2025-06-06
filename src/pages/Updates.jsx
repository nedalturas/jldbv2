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

  const CustomBlockquote = ({ children, ...props }) => {
    // Extract text content from react-markdown structure
    let textContent = '';
    
    if (Array.isArray(children)) {
      textContent = children.map(child => 
        typeof child === 'string' ? child : child?.props?.children || ''
      ).join('');
    }
    
    // Trim and get first line
    const firstLine = textContent.trim().split('\n')[0].trim();
    
    let className = styles.blockquoteDefault;
    let filteredChildren = children;
    
    // Check for special prefixes and filter them out
    if (firstLine.startsWith('[!INFO]')) {
      className = styles.blockquoteInfo;
      filteredChildren = filterPrefix(children, '[!INFO]');
    } else if (firstLine.startsWith('[!WARNING]')) {
      className = styles.blockquoteWarning;
      filteredChildren = filterPrefix(children, '[!WARNING]');
    } else if (firstLine.startsWith('[!SUCCESS]')) {
      className = styles.blockquoteSuccess;
      filteredChildren = filterPrefix(children, '[!SUCCESS]');
    }
    
    return (
      <blockquote className={className} {...props}>
        {filteredChildren}
      </blockquote>
    );
  };

  const filterPrefix = (children, prefix) => {
    if (!Array.isArray(children)) return children;
    
    return children.map((child, index) => {
      if (typeof child === 'string') {
        return child;
      }
      
      // Handle the paragraph element that contains the prefix
      if (child?.props?.children && typeof child.props.children === 'string') {
        const content = child.props.children.trim();
        if (content.startsWith(prefix)) {
          const newContent = content.replace(prefix, '').trim();
          return newContent ? {
            ...child,
            props: {
              ...child.props,
              children: newContent
            }
          } : null;
        }
      }
      
      return child;
    }).filter(Boolean);
  };

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
      <div className={styles.docsContainer}>
        {/* Mobile Header */}
        <header className={styles.mobileHeader}>
          <button
            className={styles.menuButton}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <i className={`${mobileMenuOpen ? 'times' : 'bars'} icon`}></i>
          </button>
        </header>

        {/* Mobile Sidebar */}
        <nav className={`${styles.sidebar} ${mobileMenuOpen ? styles.visible : ''}`}>
          <div className={styles.sidebarHeader}>
            <i className="book icon"></i>
            Updates
          </div>
          <div className={styles.sidebarDivider}></div>
          <div className={styles.sidebarContent}>
            {docs.map(doc => (
              <button
                key={doc}
                className={`${styles.sidebarItem} ${activeDoc === doc ? styles.active : ''}`}
                onClick={() => handleDocSelect(doc)}
              >
                {formatDocName(doc)}
              </button>
            ))}
          </div>
        </nav>

        {/* Overlay */}
        <div
          className={`${styles.overlay} ${mobileMenuOpen ? styles.visible : ''}`}
          onClick={() => setMobileMenuOpen(false)}
        />

        <main className={styles.mainContent} ref={contentRef}>
          <div className={styles.contentHeader}>
            <div className="ui breadcrumb">
              <a className={styles.contentTitle}>
                <a className="section" style={{ color: 'var(--company-color)'}}>Updates</a>
                <div className="divider"> / </div>
                <div className="active section">
                  {formatDocName(activeDoc)}
                </div>
              </a>
            </div>
          </div>

          <div className={styles.contentBody}>
            {loadingDoc ? (
              <div className={styles.loader}>
                <div className="ui active centered inline loader"></div>
              </div>
            ) : (
              <div className={styles.markdownContent}>
                <ReactMarkdown
                  components={{
                    blockquote: CustomBlockquote
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Updates;