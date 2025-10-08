import { useState } from 'react'
import './App.css'
import { anonymizeUrl } from './utils/urlAnonymizer'
import { styles } from './utils/styles'
import avatarImage from './assets/avatar.png'

function App() {
  const [inputLink, setInputLink] = useState("");
  const [anonymizedLink, setAnonymizedLink] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [removedDataItems, setRemovedDataItems] = useState<string[]>([]);
  const [isDark, setIsDark] = useState(false);

  const handleAnonymizeLink = async () => {
    setError("");
    setCopied(false);
    
    if (!inputLink) {
      setError("Please enter a link");
      return;
    }

    try {
      const result = await anonymizeUrl(inputLink);
      setAnonymizedLink(result.url);
      setRemovedDataItems(result.removedData);
    } catch (err) {
      setError("Invalid URL. Please enter a valid link.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(anonymizedLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setError("Failed to copy to clipboard");
      });
  };

  return (
    <div className={`${styles.container} ${isDark ? styles.containerDark : ''}`}>
      {/* Theme Toggle */}
      <button 
        onClick={() => setIsDark(!isDark)} 
        className={styles.themeToggle}
        aria-label="Toggle theme"
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      <div className={`${styles.card} ${isDark ? styles.cardDark : ''}`}>
        {/* Bubbles Character Section */}
        <div className={styles.bubblesSection}>
          <div className={styles.bubblesImage}>
            <img 
              src={avatarImage} 
              alt="Bubbles from Powerpuff Girls" 
              className={styles.bubblesImageElement} 
            />
          </div>
          <div className={styles.speechBubble}>
            <div className={styles.speechBubblePointer}></div>
            <p className={styles.speechBubbleText}>
              Hi! I'm Bubbles! I'll help you remove tracking information from your links to protect your privacy!
            </p>
          </div>
        </div>
        
        {/* Input Section */}
        <div className={styles.formSection}>
          <label htmlFor="link-input" className={`${styles.label} ${isDark ? styles.labelDark : ''}`}>
            Paste your link:
          </label>
          <div className={styles.inputContainer}>
            <div className={styles.inputIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.iconSvg} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <input
              id="link-input"
              type="text"
              value={inputLink}
              onChange={(e) => setInputLink(e.target.value)}
              placeholder="https://socialmedia.com/..."
              className={`${styles.input} ${isDark ? styles.inputDark : ''}`}
            />
          </div>
        </div>
        
        {/* Anonymize Button */}
        <button
          onClick={handleAnonymizeLink}
          className={styles.primaryButton}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={styles.buttonIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Anonymize Link
        </button>
        
        {/* Error Message */}
        {error && (
          <div className={`${styles.errorContainer} ${isDark ? styles.errorContainerDark : ''}`}>
            <div className={styles.errorContent}>
              <svg xmlns="http://www.w3.org/2000/svg" className={styles.errorIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}
        
        {/* Results Section */}
        {anonymizedLink && (
          <div className={`${styles.resultContainer} ${isDark ? styles.resultContainerDark : ''}`}>
            <h3 className={`${styles.resultTitle} ${isDark ? styles.resultTitleDark : ''}`}>
              Your anonymized link is ready!
            </h3>
            
            <div className={styles.resultSection}>
              <label className={`${styles.resultLabel} ${isDark ? styles.resultLabelDark : ''}`}>
                Anonymized Link:
              </label>
              <div className={styles.copyContainer}>
                <input
                  type="text"
                  readOnly
                  value={anonymizedLink}
                  className={`${styles.copyInput} ${isDark ? styles.copyInputDark : ''}`}
                />
                <button
                  onClick={copyToClipboard}
                  className={`${styles.copyButton} ${isDark ? styles.copyButtonDark : ''}`}
                >
                  {copied ? (
                    <span className={styles.copyButtonContent}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={styles.copyIconSuccess} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </span>
                  ) : (
                    <span className={styles.copyButtonContent}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={styles.copyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy
                    </span>
                  )}
                </button>
              </div>
            </div>
            
            {/* Removed Tracking Information */}
            {removedDataItems.length > 0 && (
              <div className={styles.trackingSection}>
                <h4 className={`${styles.trackingTitle} ${isDark ? styles.trackingTitleDark : ''}`}>
                  Removed tracking information:
                </h4>
                <ul className={`${styles.trackingList} ${isDark ? styles.trackingListDark : ''}`}>
                  {removedDataItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* Footer */}
        <div className={`${styles.footer} ${isDark ? styles.footerDark : ''}`}>
          <p>Your privacy matters. No links or data are stored on our servers.</p>
        </div>
      </div>
    </div>
  );
}

export default App