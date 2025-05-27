import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

function FAQ() {
  const [docs, setDocs] = useState([]);
  const [activeDoc, setActiveDoc] = useState('');
  const [content, setContent] = useState('');
  const [loadingDoc, setLoadingDoc] = useState(false);

  // Load manifest.json
  useEffect(() => {
    fetch('/docs/manifest.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load manifest');
        return res.json();
      })
      .then(data => {
        setDocs(data);
        setActiveDoc(data[0]); // default to first doc
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

  return (
    <div className="ui container">
      <div className="ui grid">
        <div className="four wide column">
          <div className="ui secondary vertical pointing menu">
            {docs.map(doc => (
              <a
                key={doc}
                className={`item ${doc === activeDoc ? 'active' : ''}`}
                onClick={() => setActiveDoc(doc)}
                style={{ cursor: 'pointer' }}
              >
                {doc.replace('.md', '').replace(/-/g, ' ')}
              </a>
            ))}
          </div>
        </div>

        <div className="twelve wide column">
          <div className="ui segment">
            {loadingDoc ? (
              <div className="ui active inverted dimmer">
                <div className="ui text loader">Loading document...</div>
              </div>
            ) : (
              <ReactMarkdown>{content}</ReactMarkdown>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default FAQ;

