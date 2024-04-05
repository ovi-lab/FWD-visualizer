const UserAvatar = ({ size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#000000"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3" />
    <circle cx="12" cy="10" r="3" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const HaruAvatar = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 950 950"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="128" y="103" width="255" height="255" rx="30" fill="#D9D9D9" />
    <rect x="146" y="120" width="220" height="220" rx="30" fill="black" />
    <circle cx="255.5" cy="230.5" r="87.5" fill="#C6FDAC" />
    <circle cx="256" cy="230" r="50" fill="black" />
    <rect x="566" y="103" width="255" height="255" rx="30" fill="#D9D9D9" />
    <rect x="584" y="120" width="220" height="220" rx="30" fill="black" />
    <circle cx="693.5" cy="230.5" r="87.5" fill="#C6FDAC" />
    <circle cx="694" cy="230" r="50" fill="black" />
    <rect x="383" y="201" width="183" height="59" fill="#A8A8A8" />
    <rect
      x="445"
      y="558"
      width="300"
      height="59"
      transform="rotate(-90 445 558)"
      fill="#8F8B8B"
    />
    <path
      d="M768 848C677.523 848 636.596 848 474.5 848C312.404 848 269.822 848 181 848C181 761.121 181 558 474.5 558C768 558 768 761.121 768 848Z"
      fill="#D9D9D9"
    />
  </svg>
);

export { UserAvatar, HaruAvatar };
