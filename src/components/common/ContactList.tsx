import { company } from "@/content";

interface ContactListProps {
  // "light" for dark backgrounds (footer), "dark" for white backgrounds.
  tone?: "light" | "dark";
}

const icons = {
  address: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  email: "M4 6h16v12H4zM4 7l8 6 8-6",
};

export default function ContactList({ tone = "light" }: ContactListProps) {
  const link = tone === "light" ? "hover:text-accent" : "font-semibold text-brand hover:text-accent";

  return (
    <ul className="space-y-4 text-sm">
      <li className="flex gap-3">
        <Icon path={icons.address} />
        <span>{company.address}</span>
      </li>
      <li className="flex gap-3">
        <Icon path={icons.phone} />
        <a href={`tel:${company.phone}`} className={link}>{company.phone}</a>
      </li>
      <li className="flex gap-3">
        <Icon path={icons.email} />
        <a href={`mailto:${company.email}`} className={`break-all ${link}`}>{company.email}</a>
      </li>
    </ul>
  );
}

function Icon({ path }: { path: string }) {
  return (
    <svg className="mt-0.5 size-5 shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
      <path d={path} />
    </svg>
  );
}
