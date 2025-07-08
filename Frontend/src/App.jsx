import { useState } from 'react';
import './index.css';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    // Add user prompt to chat history
    const userMessage = { type: 'user', content: prompt };
    setChatHistory(prev => [...prev, userMessage]);
    
    setThinking(true);
    setShowImage(false);
    setShowFull(false);
    
    // Clear the input field
    const currentPrompt = prompt;
    setPrompt('');

    const res = await fetch('/output.json');
    const data = await res.json();

    setTimeout(() => {
      setThinking(false);
      
      // Add bot response to chat history
      const botMessage = { 
        type: 'bot', 
        content: data.final_result,
        fullOutput: data.full_output_text,
        showChainButton: data.show_chain_button,
        imageUrl: data.image_url
      };
      setChatHistory(prev => [...prev, botMessage]);
      
      setShowImage(true);
    }, 10000); // simulate 10 seconds of analysis
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="container">
      <div className={`left-panel ${showImage ? 'show' : ''}`}>
        {showImage && chatHistory.length > 0 && chatHistory[chatHistory.length - 1].imageUrl && (
          <img src={chatHistory[chatHistory.length - 1].imageUrl} alt="Flood Risk Map" className="flood-image" />
        )}
      </div>

      <div className={`right-panel ${showImage ? 'shifted' : ''}`}>
        <h1>LLM Flood Risk Analysis</h1>

        {/* Chat History */}
        <div className="chat-history">
          {chatHistory.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              {message.type === 'user' ? (
                <div className="user-message">
                  <span className="message-label">You:</span>
                  <div className="message-content">{message.content}</div>
                </div>
              ) : (
                <div className="bot-message">
                  <span className="message-label">🤖 Analysis:</span>
                  <div className="message-content">
                    <pre>{message.content}</pre>
                    {message.showChainButton && (
                      <button 
                        onClick={() => setShowFull(showFull === index ? null : index)} 
                        className="toggle-btn-inline"
                      >
                        {showFull === index ? 'Hide Full Analysis' : 'View Full Analysis'}
                      </button>
                    )}
                    {showFull === index && (
                      <pre className="full-log-inline">
                        {message.fullOutput}
                      </pre>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {thinking && (
          <div className="thinking-box">
            <p>Analyzing... Please wait.</p>
            <p className="dot-animation">⏳</p>
          </div>
        )}

        {/* Input Section */}
        <div className="input-section">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your prompt..."
            className="prompt-input"
          />
          <button onClick={handleSubmit} className="submit-btn">
            Analyze
          </button>
        </div>
      </div>
    </div>
  );
}