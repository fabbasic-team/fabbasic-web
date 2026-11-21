import Link from "next/link";
import { StoreSettings } from "@/types";

export default function AnnouncementBar({ settings }: { settings: StoreSettings }) {
  if (!settings.announcement_active || !settings.announcement_text) {
    return null;
  }

  const content = (
    <div className="bg-[#0B1530] text-ivory/90 text-[11px] sm:text-[11.5px] tracking-luxury uppercase py-2 sm:py-2.5 px-4 text-center font-medium border-b border-navy-light/30 flex items-center justify-center gap-3 select-none">
      <span className="text-gold/70 text-[10px] font-mono tracking-widest hidden sm:inline">&lt;&lt;</span>
      <span className="truncate">{settings.announcement_text}</span>
      <span className="text-gold/70 text-[10px] font-mono tracking-widest hidden sm:inline">&gt;&gt;</span>
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
