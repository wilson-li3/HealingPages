interface Props {
  fillTop?: string;
  fillBottom?: string;
  flip?: boolean;
}

export default function WavyDivider({ fillTop = '#0A1628', fillBottom = '#132238', flip = false }: Props) {
  return (
    <div
      className="absolute left-0 right-0 w-full overflow-hidden pointer-events-none z-[3]"
      style={{
        height: '80px',
        ...(flip ? { top: 0, transform: 'rotate(180deg)' } : { bottom: 0 }),
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <path
          d="M0 40C240 70 480 10 720 40C960 70 1200 10 1440 40V80H0Z"
          fill={fillBottom}
        />
        <path
          d="M0 45C200 65 400 15 720 45C1040 75 1240 20 1440 45V80H0Z"
          fill={fillBottom}
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
