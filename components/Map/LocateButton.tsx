function LocateButton() {
  return (
    <div className="absolute bottom-50 left-2 z-1000">
      <button className="bg-white rounded-full shadow-lg p-2">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          {/* Círculo central */}
          <circle cx="12" cy="12" r="4" />
          {/* Líneas */}
          <line x1="12" y1="2" x2="12" y2="6" /> {/* arriba */}
          <line x1="12" y1="18" x2="12" y2="22" /> {/* abajo */}
          <line x1="2" y1="12" x2="6" y2="12" /> {/* izquierda */}
          <line x1="18" y1="12" x2="22" y2="12" /> {/* derecha */}
        </svg>
      </button>
    </div>
  );
}

export default LocateButton;
