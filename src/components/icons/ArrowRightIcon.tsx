import type { ComponentPropsWithRef } from "react";

export function ArrowRightIcon({ className }: ComponentPropsWithRef<"svg">) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M5 13.0002H16.17L11.29 17.8802C10.9 18.2702 10.9 18.9102 11.29 19.3002C11.68 19.6902 12.31 19.6902 12.7 19.3002L19.29 12.7102C19.68 12.3202 19.68 11.6902 19.29 11.3002L12.71 4.70021C12.32 4.31021 11.69 4.31021 11.3 4.70021C10.91 5.09021 10.91 5.72022 11.3 6.11022L16.17 11.0002H5C4.45 11.0002 4 11.4502 4 12.0002C4 12.5502 4.45 13.0002 5 13.0002Z" />
    </svg>
  );
}
