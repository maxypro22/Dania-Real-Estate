import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n, t } = useTranslation()
  const isAr = i18n.language === 'ar'

  const toggle = () => {
    const next = isAr ? 'en' : 'ar'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = next
  }

  return (
    <button
      onClick={toggle}
      aria-label={isAr ? 'Switch to English' : 'Switch to Arabic'}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm font-medium text-ink hover:bg-surface-low transition-colors',
        className
      )}
    >
      <Globe size={14} />
      <span>{isAr ? t('header.switchToEn') : t('header.switchToAr')}</span>
    </button>
  )
}
