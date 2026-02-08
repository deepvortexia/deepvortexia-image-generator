"use client";

export default function ToolsPreview() {
  return (
    <div className="tools-preview-section" role="region" aria-label="Available and upcoming AI tools">
      <h3 className="tools-preview-title">Complete AI Ecosystem</h3>
      <div className="tools-preview-grid" role="list">
        <div className="tool-card tool-card-active" role="listitem">
          <span className="tool-icon" aria-hidden="true">🖼️</span>
          <span className="tool-name">Image Gen</span>
          <span className="tool-status" aria-label="Currently available">Available Now</span>
        </div>
        
        <div className="tool-card tool-card-soon" role="listitem">
          <span className="tool-icon" aria-hidden="true">😀</span>
          <span className="tool-name">Emoticons</span>
          <span className="tool-status" aria-label="Coming in the future">Available</span>
        </div>
        
        <div className="tool-card tool-card-soon" role="listitem">
          <span className="tool-icon" aria-hidden="true">💬</span>
          <span className="tool-name">AI Chat</span>
          <span className="tool-status" aria-label="Coming in the future">Coming Soon</span>
        </div>
        
        <div className="tool-card tool-card-soon" role="listitem">
          <span className="tool-icon" aria-hidden="true">✨</span>
          <span className="tool-name">More Tools</span>
          <span className="tool-status" aria-label="Currently in development">In Development</span>
        </div>
      </div>
    </div>
  );
}
