import { company } from '@/data/mockData'
import { WhatsappIcon } from '@/components/shared/WhatsappIcon'

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${company.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 inline-flex items-center gap-2 ps-2 pe-2 sm:pe-4 py-2 rounded-full text-white font-semibold bg-gradient-to-br from-[#25D366] to-[#0F8A52] ring-1 ring-white/30 shadow-lg shadow-emerald-700/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-700/40 hover:brightness-105 active:scale-95"
    >
      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15">
        <WhatsappIcon size={18} className="transition-transform duration-300 group-hover:scale-110" />
      </span>
      <span className="text-sm hidden sm:inline pe-1">Chat on WhatsApp</span>
    </a>
  )
}
