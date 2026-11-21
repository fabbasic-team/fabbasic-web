import Link from "next/link";
import { StoreSettings } from "@/types";

export default function AnnouncementBar({ settings }: { settings: StoreSettings }) {
  if (!settings.announcement_active || !settings.announcement_text) {
    return null;
  }

  const content = (
    <div className="bg-navy-deep text-ivory text-xs tracking-luxury uppercase py-2 px-4 text-center font-medium border-b border-navy-light/40 flex items-center justify-center gap-3">
      <span className="text-gold/80 text-[10px] hidden sm:inline">&lt;&lt;</span>
      <span className="truncate">{settings.announcement_text}</span>
      <span className="text-gold/80 text-[10px] hidden sm:inline">&gt;&gt;</span>
    </div>
  );

  if (settings.announcement_link) {
    return (
      <Link href={settings.announcement_link} className="block hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
