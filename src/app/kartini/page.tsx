"use client";

import { useEffect, useState } from "react";

export default function KartiniPage() {
  const [showContent, setShowContent] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showQuote, setShowQuote] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const fullText = "Selamat Hari Kartini, Sugar ✨";

  // Typing animation
  useEffect(() => {
    setShowContent(true);
    const timer = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i <= fullText.length) {
          setTypedText(fullText.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => setShowQuote(true), 600);
          setTimeout(() => setShowMessage(true), 1400);
          setTimeout(() => setShowSignature(true), 2200);
        }
      }, 70);
      return () => clearInterval(interval);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="kartini-page">

      {/* Main content */}
      <div className="kartini-content">
        {/* Title with typing effect */}
        <h1 className={`kartini-title ${showContent ? "visible" : ""}`}>
          {typedText}
          <span className="cursor">|</span>
        </h1>

        {/* Subtitle */}
        <p className={`kartini-subtitle ${showQuote ? "visible" : ""}`}>
          21 April 2026
        </p>

        {/* Decorative divider */}
        <div className={`divider ${showQuote ? "visible" : ""}`}>
          <span className="divider-dot" />
          <span className="divider-line" />
          <span className="divider-dot" />
        </div>

        {/* Personal message */}
        <div className={`personal-message ${showMessage ? "visible" : ""}`}>
          <p>
            for Sugar,
          </p>
          <p>
            Maaf telat soalnya mepet wkwk, selamat hari kartini ya buat kamu, 
            makasih udah berjuang sejauh ini!
          </p>
          <p>
            You so much matter for everyone around you, including me, 
            by yourself, tanpa perlu jadi orang lain.
          </p>
          <p>
            Every single things that you did is meaningful more than you think, 
            so dont ever think to underestimate yourself, ya?
          </p>
          <p className="message-closing">
            Selamat Hari Kartini, sayang. Tetep jadi kamu. Yang udah cukup. 
            Yang selalu cukup. 🌸
          </p>
        </div>

        {/* Signature */}
        <div className={`signature ${showSignature ? "visible" : ""}`}>
          <p>with love,</p>
          <p className="signature-name">Koala 💛</p>
        </div>
      </div>

      {/* Decorative bottom ornament */}
      <div className={`ornament-bottom ${showSignature ? "visible" : ""}`}>
        <span className="ornament-line" />
        <span className="ornament-flower">🌿</span>
        <span className="ornament-line" />
      </div>

      <style jsx>{`
        .kartini-page {
          min-height: 100vh;
          background: var(--brand-bg);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          position: relative;
          overflow: hidden;
        }

        /* Ornaments */
        .ornament-top, .ornament-bottom {
          display: flex;
          align-items: center;
          gap: 1rem;
          opacity: 0;
          transform: scale(0.8);
          transition: all 1s ease;
          z-index: 1;
        }

        .ornament-top.visible, .ornament-bottom.visible {
          opacity: 1;
          transform: scale(1);
        }

        .ornament-line {
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--brand-warm), transparent);
        }

        .ornament-flower {
          font-size: 1.5rem;
          animation: sway 3s ease-in-out infinite;
        }

        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }

        /* Content */
        .kartini-content {
          max-width: 600px;
          text-align: center;
          z-index: 1;
          margin: 2rem 0;
        }

        .kartini-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.8rem, 5vw, 2.8rem);
          color: var(--brand-text);
          margin-bottom: 0.5rem;
          line-height: 1.3;
          min-height: 2.5em;
        }

        .cursor {
          animation: blink 0.8s step-end infinite;
          color: var(--brand-warm);
          font-weight: 300;
        }

        @keyframes blink {
          50% { opacity: 0; }
        }

        .kartini-subtitle {
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          color: var(--brand-muted);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 2rem;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.8s ease;
        }

        .kartini-subtitle.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Quote */
        .kartini-quote {
          font-family: 'DM Serif Display', serif;
          font-style: italic;
          font-size: clamp(1.3rem, 3.5vw, 1.8rem);
          color: var(--brand-accent);
          margin: 1.5rem auto;
          max-width: 500px;
          line-height: 1.5;
          opacity: 0;
          transform: translateY(20px);
          transition: all 1s ease;
        }

        .kartini-quote.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .quote-mark {
          color: var(--brand-warm);
          font-size: 1.4em;
        }

        .kartini-quote footer {
          font-family: 'Inter', sans-serif;
          font-style: normal;
          font-size: 0.8rem;
          color: var(--brand-muted);
          margin-top: 0.5rem;
          letter-spacing: 0.05em;
        }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin: 2rem 0;
          opacity: 0;
          transition: opacity 1s ease;
        }

        .divider.visible {
          opacity: 1;
        }

        .divider-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--brand-warm);
        }

        .divider-line {
          width: 40px;
          height: 1px;
          background: var(--brand-border);
        }

        /* Personal message */
        .personal-message {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          color: var(--brand-secondary);
          line-height: 1.8;
          text-align: left;
          opacity: 0;
          transform: translateY(20px);
          transition: all 1s ease;
        }

        .personal-message.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .personal-message p {
          margin-bottom: 1rem;
        }

        .personal-message strong {
          color: var(--brand-warm);
          font-weight: 600;
        }

        .personal-message em {
          color: var(--brand-accent);
        }

        .message-closing {
          font-family: 'DM Serif Display', serif;
          font-size: 1.15rem;
          color: var(--brand-text);
          text-align: center;
          margin-top: 1.5rem;
        }

        /* Signature */
        .signature {
          margin-top: 2.5rem;
          font-family: 'DM Serif Display', serif;
          color: var(--brand-muted);
          font-size: 0.95rem;
          opacity: 0;
          transform: translateY(15px);
          transition: all 0.8s ease;
        }

        .signature.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .signature-name {
          font-size: 1.4rem;
          color: var(--brand-warm);
          margin-top: 0.25rem;
        }

        /* Mobile */
        @media (max-width: 640px) {
          .kartini-page {
            padding: 3rem 1.25rem;
          }

          .personal-message {
            text-align: center;
            font-size: 0.95rem;
          }

          .ornament-line {
            width: 40px;
          }
        }
      `}</style>
    </main>
  );
}
