'use client';

import { useEffect, useState } from 'react'

interface NotificationProps {
  show: boolean
  onClose: () => void
}

export const Notification = ({ show, onClose }: NotificationProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000) // Auto-close after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="notification-container">
      <div className="notification">
        <div className="notification-icon">✅</div>
        <div className="notification-content">
          <div className="notification-title">Payment Successful!</div>
          <div className="notification-message">Your credits have been added to your account.</div>
        </div>
        <button className="notification-close" onClick={onClose}>×</button>
      </div>

      <style jsx>{`
        .notification-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 2000;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .notification {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border: 2px solid rgba(212, 175, 55, 0.5);
          border-radius: 12px;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          min-width: 300px;
          max-width: 400px;
        }

        .notification-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .notification-content {
          flex: 1;
        }

        .notification-title {
          font-family: 'Orbitron', sans-serif;
          color: #D4AF37;
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .notification-message {
          color: #ccc;
          font-size: 0.875rem;
        }

        .notification-close {
          background: transparent;
          border: none;
          color: #999;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          flex-shrink: 0;
          transition: color 0.3s ease;
        }

        .notification-close:hover {
          color: #D4AF37;
        }

        @media (max-width: 480px) {
          .notification-container {
            top: 10px;
            right: 10px;
            left: 10px;
          }

          .notification {
            min-width: auto;
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
