import { Star as StarOutline } from "lucide-react";

export const FilledStar = ({ className = "h-4 w-4" }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.2 1 5.8L10 15.9 4.8 18.7l1-5.8L1.5 8.7l5.9-.9L10 1.5z" />
  </svg>
);
