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

  // The compact header variant pairs the globe with the *target* language code
  // ("AR" while browsing English) so the control reads as a language switch at a
  // glance instead of an unlabelled icon. Fixed height + shrink-0 keep it aligned
  // with the WhatsApp/menu buttons beside it at every breakpoint.
  const targetCode = isAr ? 'EN' : 'AR'

  return (
    <button
      onClick={toggle}
      type="button"
      lang={isAr ? 'en' : 'ar'}
      aria-label={isAr ? 'Switch to English' : 'Switch to Arabic'}
      title={isAr ? t('header.switchToEn') : t('header.switchToAr')}
      className={cn(
        'inline-flex items-center justify-center rounded-full border border-border text-sm font-medium text-ink hover:bg-surface-low active:bg-surface-low transition-colors',
        iconOnly ? 'h-9 gap-1 px-2.5 shrink-0' : 'gap-1.5 px-3 py-1.5',
        className
      )}
    >
      <Globe size={iconOnly ? 16 : 14} className="shrink-0" />
      {iconOnly ? (
        <span className="text-xs font-bold leading-none tracking-wide">{targetCode}</span>
      ) : (
        <span>{isAr ? t('header.switchToEn') : t('header.switchToAr')}</span>
      )}
    </button>
  )
}
