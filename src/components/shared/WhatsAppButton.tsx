import { MessageCircle } from 'lucide-react'
import { company } from '@/data/mockData'

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${company.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-50 overflow-hidden flex items-center gap-2 bg-whatsapp text-white font-semibold px-4 py-3 rounded-full shadow-lg"
    >
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[220%] aspect-square rounded-full bg-lime scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out" />
      <MessageCircle size={20} className="relative z-10 transition-colors duration-300 group-hover:text-forest" />
      <span className="text-sm hidden sm:inline relative z-10 transition-colors duration-300 group-hover:text-forest">Chat on WhatsApp</span>
    </a>
  )
}
