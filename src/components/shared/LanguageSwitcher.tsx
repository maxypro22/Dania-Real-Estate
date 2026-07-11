import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ className, iconOnly }: { className?: string; iconOnly?: boolean }) {
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
      title={isAr ? t('header.switchToEn') : t('header.switchToAr')}
      className={cn(
        'flex items-center rounded-full border border-border text-sm font-medium text-ink hover:bg-surface-low transition-colors',
        iconOnly ? 'justify-center w-9 h-9 shrink-0' : 'gap-1.5 px-3 py-1.5',
        className
      )}
    >
      <Globe size={iconOnly ? 16 : 14} />
      {!iconOnly && <span>{isAr ? t('header.switchToEn') : t('header.switchToAr')}</span>}
    </button>
  )
}
