import { useEffect } from 'react';

export default function ConfettiEffect() {
  useEffect(() => {
    const createConfetti = () => {
      const confettiContainer = document.createElement('div');
      confettiContainer.style.position = 'fixed';
      confettiContainer.style.top = '0';
      confettiContainer.style.left = '0';
      confettiContainer.style.width = '100%';
      confettiContainer.style.height = '100%';
      confettiContainer.style.pointerEvents = 'none';
      confettiContainer.style.zIndex = '9999';
      document.body.appendChild(confettiContainer);

      const colors = ['#F8BBD0', '#F48FB1', '#A8C5A0', '#FFFFFF'];
      const createConfettiPiece = () => {
        const piece = document.createElement('div');
        const size = Math.random() * 10 + 5;
        piece.style.width = `${size}px`;
        piece.style.height = `${size}px`;
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.position = 'absolute';
        piece.style.borderRadius = '50%';
        piece.style.top = '-10px';
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        confettiContainer.appendChild(piece);

        // Remove after animation ends
        setTimeout(() => {
          piece.remove();
        }, 5000);
      };

      const animation = `
        @keyframes fall {
          to {
            transform: translateY(105vh) rotate(360deg);
          }
        }
      `;

      const style = document.createElement('style');
      style.textContent = animation;
      document.head.appendChild(style);

      // Create confetti pieces
      for (let i = 0; i < 100; i++) {
        setTimeout(createConfettiPiece, i * 20);
      }

      // Clean up after 5 seconds
      setTimeout(() => {
        confettiContainer.remove();
        style.remove();
      }, 5000);
    };

    createConfetti();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return null;
}