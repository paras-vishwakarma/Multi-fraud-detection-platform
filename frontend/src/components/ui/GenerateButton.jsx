import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function GenerateButton({
  children = "Generate",
  hue = 190,
  isGenerating: controlledIsGenerating,
  className = "",
  onClick,
  to,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const isGenerating =
    controlledIsGenerating !== undefined
      ? controlledIsGenerating
      : isFocused || isHovered;

  const handleClick = (e) => {
    setIsFocused(true);
    if (to) {
      navigate(to);
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className="relative inline-block group">
      <style>{`
        .gen-btn {
          --border-radius: 9999px;
          --padding: 4px;
          --transition: 0.35s;
          --button-color: #0891B2;
          --highlight-color-hue: ${hue}deg;

          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          overflow: hidden;

          padding: 0.75rem 1.6rem;
          font-family: "Inter", "Segoe UI", system-ui, sans-serif;
          font-size: 0.875rem;
          font-weight: 700;

          color: #ffffff;
          background: linear-gradient(135deg, #0891B2 0%, #06B6D4 100%);

          border: solid 1px rgba(255, 255, 255, 0.3);
          border-radius: var(--border-radius);
          cursor: pointer;

          box-shadow:
            inset 0px 1px 1px rgba(255, 255, 255, 0.4),
            inset 0px -1px 2px rgba(0, 0, 0, 0.2),
            0px 4px 16px rgba(6, 182, 212, 0.35);

          transition:
            box-shadow var(--transition),
            border-color var(--transition),
            background var(--transition),
            transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gen-btn:hover {
          transform: translateY(-2px);
          border-color: #22D3EE;

          box-shadow:
            0 0 24px rgba(6, 182, 212, 0.55),
            inset 0 1px 2px rgba(255, 255, 255, 0.6),
            0 6px 22px rgba(8, 145, 178, 0.45);
        }

        .gen-btn:active {
          transform: translateY(1px) scale(0.98);
        }

        /* ── Sweeping Light Beam Shine ── */
        .gen-btn::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;

          background: linear-gradient(
            115deg,
            transparent 15%,
            rgba(255, 255, 255, 0.5) 45%,
            rgba(255, 255, 255, 0.7) 50%,
            rgba(255, 255, 255, 0.5) 55%,
            transparent 85%
          );

          opacity: 0;
          transform: translateX(-120%);
          transition: opacity 0.3s ease;
        }

        .gen-btn:hover::after,
        .gen-btn[data-generating="true"]::after {
          opacity: 1;
          animation: gen-shine 1.4s ease infinite;
        }

        @keyframes gen-shine {
          0% {
            transform: translateX(-120%);
          }
          60%, 100% {
            transform: translateX(120%);
          }
        }

        /* ── Sparkle Icon ── */
        .gen-btn-svg {
          width: 18px;
          height: 18px;
          fill: #ffffff;
          transition: transform 0.3s ease, filter 0.3s ease;
          filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.8));
        }

        .gen-btn:hover .gen-btn-svg,
        .gen-btn[data-generating="true"] .gen-btn-svg {
          animation: gen-sparkle-spin 2s ease infinite;
          filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.95));
        }

        @keyframes gen-sparkle-spin {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.2) rotate(15deg);
            opacity: 0.9;
          }
        }

        /* ── Letter Wave Animation ── */
        .gen-btn-letter {
          position: relative;
          display: inline-block;
          color: #ffffff;
          transition: color 0.3s ease, text-shadow 0.3s ease, transform 0.3s ease;
        }

        .gen-btn[data-generating="true"] .gen-btn-letter {
          animation: gen-letter-wave 1.4s ease-in-out infinite;
        }

        @keyframes gen-letter-wave {
          0%, 100% {
            transform: translateY(0);
            text-shadow: none;
            color: #ffffff;
          }
          50% {
            transform: translateY(-2px);
            color: #ffffff;
            text-shadow:
              0 0 8px rgba(34, 211, 238, 0.9),
              0 0 16px rgba(6, 182, 212, 0.7);
          }
        }
      `}</style>

      <button
        type="button"
        className={`gen-btn ${className}`}
        data-generating={isGenerating}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onClick={handleClick}
        {...props}
      >
        <svg
          className="gen-btn-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
          />
        </svg>

        <span className="flex">
          {String(children)
            .split("")
            .map((letter, i) => (
              <span
                key={i}
                className="gen-btn-letter"
                style={{ animationDelay: `${i * 0.045}s` }}
              >
                {letter === " " ? "\u00A0" : letter}
              </span>
            ))}
        </span>
      </button>
    </div>
  );
}

export default GenerateButton;
