import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Building2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/shared/Reveal'
import { ScrollRevealText } from '@/components/shared/ScrollRevealText'
import { StackedCards } from '@/components/shared/StackedCards'
import { company, companyPhones } from '@/data/mockData'
import { usePageSchema } from '@/components/shared/seo-context'
import { contactPageSchema } from '@/lib/seo'
import { Ltr } from '@/components/shared/Ltr'
import { store } from '@/cms/store'

// ─── Component ───────────────────────────────────────────────────────────────

export function ContactPage() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  // ContactPage structured data (per content spec).
  usePageSchema([contactPageSchema()])

  const propertyTypes = t('contact.form.propertyTypes', { returnObjects: true }) as string[]
  const neighborhoods = t('contact.form.neighborhoods', { returnObjects: true }) as string[]
  const segments = t('contact.segments.items', { returnObjects: true }) as Array<{ title: string; desc: string; href?: string; action?: string }>
  const cardMeta = t('contact.cards.items', { returnObjects: true }) as Array<{ label: string; desc: string }>
  const contactCards = [
    // All three lines, each its own tel: link (`links` beats `value` in the card).
    { icon: <Phone size={20} />, label: cardMeta[0]?.label ?? '', desc: cardMeta[0]?.desc ?? '', value: '', href: undefined as string | undefined, ltr: true, links: companyPhones() },
    { icon: <MessageCircle size={20} />, label: cardMeta[1]?.label ?? '', desc: cardMeta[1]?.desc ?? '', value: company.whatsappDisplay, href: `https://wa.me/${company.whatsapp}`, ltr: true },
    { icon: <Mail size={20} />, label: cardMeta[2]?.label ?? '', desc: cardMeta[2]?.desc ?? '', value: company.email, href: `mailto:${company.email}`, ltr: true },
    { icon: <MapPin size={20} />, label: cardMeta[3]?.label ?? '', desc: cardMeta[3]?.desc ?? '', value: isAr ? company.addressAr : company.address, href: 'https://maps.google.com/?q=Al+Muftah+Plaza+Building,+Al+Rayyan+Road,+Doha,+Qatar', ltr: false },
    { icon: <Clock size={20} />, label: cardMeta[4]?.label ?? '', desc: cardMeta[4]?.desc ?? '', value: isAr ? `${company.hoursAr}\n${company.hoursSatAr}\nالجمعة: مغلق — مراقبة واتساب لمتطلبات الشركات العاجلة` : `${company.hours}\n${company.hoursSat}\nFri: Closed — Active WhatsApp Monitoring for urgent corporate requirements`, href: undefined as string | undefined, ltr: false },
  ]

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    type: propertyTypes[0] ?? '',
    area: neighborhoods[0] ?? '',
    message: '',
  })
  const [sent, setSent] = useState(false)
  // When a browser blocks the WhatsApp popup, window.open returns null. We keep
  // the URL here and surface a direct link instead of a false "success" state.
  const [blockedUrl, setBlockedUrl] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Capture the enquiry into the CMS inbox (local DB today, Supabase later) so
    // it is visible in the dashboard Messages panel.
    void store.addMessage({
      id: (crypto.randomUUID?.() ?? `${Date.now()}-${Math.round(Math.random() * 1e9)}`),
      name: form.name,
      phone: form.phone,
      email: form.email,
      type: form.type,
      area: form.area,
      message: form.message,
      createdAt: Date.now(),
      read: false,
    })
    // This is a static site with no backend, so the form cannot POST anywhere.
    // Hand the lead off to the company WhatsApp with every field prefilled — that
    // way the inquiry is actually delivered instead of being silently discarded.
    const lines = [
      `New rental inquiry — ${company.name} website`,
      '',
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      `Property type: ${form.type}`,
      `Preferred area: ${form.area}`,
      `Message: ${form.message}`,
    ]
    const waUrl = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`
    const win = window.open(waUrl, '_blank', 'noopener,noreferrer')
    if (win) {
      setBlockedUrl(null)
      setSent(true)
    } else {
      // Popup blocked — do not claim success; show a link the user can tap.
      setBlockedUrl(waUrl)
    }
  }

  return (
    <>
      <title>Contact Dania Real Estate Qatar | Call or WhatsApp Leasing Desk</title>
      <meta name="description" content="Contact Dania Real Estate Doha for verified properties for rent in Qatar. Connect with our leasing desk via Call or WhatsApp for apartments, family villas, storefront shops, and staff housing." />
      {/* ── S1: Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-forest text-white py-16 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: text + CTAs */}
            <div>
              <Reveal direction="up">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                  {t('contact.hero.h1')}
                </h1>
              </Reveal>
              <Reveal direction="up" delay={100}>
                <ScrollRevealText className="text-lime text-lg font-semibold mb-4" text={t('contact.hero.subtitle')} />
              </Reveal>
              <Reveal direction="up" delay={200}>
                <ScrollRevealText
                  className="text-white/70 text-sm leading-relaxed mb-8"
                  text={isAr
                    ? 'هل أنت مستعد لتسهيل بحثك عن العقار؟ سواء كنت تبحث عن شقة حديثة أو فيلا فاخرة أو سكن للعمال أو محل تجاري، فريقنا هنا لمساعدتك.'
                    : 'Ready to streamline your property search? Whether you are looking for a modern low-rise apartment in downtown Doha, a spacious family compound villa, a certified workforce staff accommodation layout, or a high-footfall commercial shop location, our leasing desk is fully active and ready to help. At Dania Real Estate, we strip away the guesswork from the local market. Connect with our certified area specialists right now to receive unedited interior walk-through videos, verified floor plan drawings, and transparent municipality lease conditions structured exactly around your target monthly budget and preferred move-in window.'}
                />
              </Reveal>
              <Reveal direction="up" delay={300}>
                <div className="flex flex-row flex-wrap gap-2 sm:gap-4">
                  <a
                    href={`tel:${company.phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center justify-center gap-2 bg-lime text-forest font-bold px-6 py-3 rounded-full text-sm hover:bg-white transition-colors"
                  >
                    <Phone size={15} />
                    {isAr ? 'اتصل بمكتب الإيجار: ' : 'Call Leasing Desk: '}<Ltr>{company.phone}</Ltr>
                  </a>
                  <a
                    href={`https://wa.me/${company.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-whatsapp text-white font-bold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
                  >
                    <MessageCircle size={15} />
                    {isAr ? 'دردشة مباشرة عبر واتساب' : 'Direct WhatsApp Chat'}
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Right: property image */}
            <Reveal direction="left" delay={200}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  src="/about-dania-real-estate-qatar.webp"
                  alt="Dania Real Estate leasing team ready to assist with verified property rentals in Doha Qatar."
                  width={1334}
                  height={2000}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-forest/25" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── S2: Contact Info Cards ────────────────────────────────────────── */}
      <section className="py-14 bg-surface-low">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-2">{t('contact.cards.h2')}</h2>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <ScrollRevealText
              className="text-ink-muted text-sm mb-10 max-w-2xl"
              text={isAr
                ? 'تواصل مع مقرنا المؤسسي مباشرة عبر أي من قنوات التواصل الآمنة المُدارة لدينا:'
                : 'Connect with our corporate headquarters directly through any of our managed secure communication access points:'}
            />
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {contactCards.map((card, i) => (
              <Reveal key={card.label} direction="up" delay={i * 80}>
                <div className="bg-white rounded-2xl border border-border p-6 h-full flex flex-col gap-4 linear-card">
                  <div className="w-11 h-11 bg-lime rounded-xl flex items-center justify-center text-forest shrink-0">
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1">{card.label}</p>
                    {'links' in card && card.links ? (
                      <span className="flex flex-col gap-0.5">
                        {card.links.map((l) => (
                          <a key={l.tel} href={l.tel} className="text-forest text-sm font-medium hover:underline leading-relaxed">
                            <Ltr>{l.display}</Ltr>
                          </a>
                        ))}
                      </span>
                    ) : card.href ? (
                      <a
                        href={card.href}
                        target={card.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="text-forest text-sm font-medium hover:underline leading-relaxed"
                      >
                        {card.ltr ? <Ltr>{card.value}</Ltr> : card.value}
                      </a>
                    ) : (
                      <p className="text-ink text-sm leading-relaxed whitespace-pre-line">{card.ltr ? <Ltr>{card.value}</Ltr> : card.value}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── S2b: Office location map ─────────────────────────────────────── */}
      <section className="bg-surface-low pb-14">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <div className="overflow-hidden rounded-2xl border border-border bg-white">
              <iframe
                src={company.mapEmbedUrl}
                title={isAr ? 'موقع مكتب دانية للعقارات على خرائط جوجل' : 'Dania Real Estate office location on Google Maps'}
                width="600"
                height="450"
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="block h-[400px] w-full border-0 sm:h-[450px]"
              />
            </div>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="inline-flex items-center gap-2 text-sm text-ink-muted">
                <MapPin size={16} className="text-lime shrink-0" />
                {isAr ? company.addressAr : company.address}
              </p>
              <a
                href={company.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-forest px-5 py-2.5 text-sm font-bold text-forest transition-colors hover:bg-forest hover:text-white"
              >
                <MapPin size={15} />
                {isAr ? 'الاتجاهات على خرائط جوجل' : 'Direction On Google Map'}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── S3: Inquiry Form ─────────────────────────────────────────────── */}
      <section className="bg-surface-low py-14">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <div className="bg-white rounded-2xl border border-border p-8 max-w-3xl mx-auto">
                {sent ? (
                  <div className="text-center py-10">
                    <div className="w-14 h-14 bg-lime rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send size={24} className="text-forest" />
                    </div>
                    <h3 className="text-xl font-bold text-ink mb-2">{isAr ? 'تم إرسال الاستفسار!' : 'Inquiry Submitted!'}</h3>
                    <p className="text-ink-muted mb-1 text-sm max-w-sm mx-auto">
                      {isAr
                        ? 'يتم توجيه جميع الاستفسارات الرقمية النشطة إلى وكلاء محليين معتمدين — توقع رداً رسمياً خلال ساعتي عمل.'
                        : 'All active digital inquiries are routed to certified local agents — expect a formal response within 2 business hours.'}
                    </p>
                    <p className="text-sm text-ink-muted mt-3">
                      {isAr ? 'للحصول على قوائم فورية ومعاينات فيديو مباشرة:' : 'For immediate listings and live video previews:'}{' '}
                      <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-forest font-medium hover:underline">
                        <Ltr>{company.whatsappDisplay}</Ltr>
                      </a>
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="mt-6 border border-border text-ink px-6 py-2 rounded-full text-sm font-medium hover:bg-surface-low transition-colors"
                    >
                      {isAr ? 'إرسال استفسار آخر' : 'Send Another Inquiry'}
                    </button>
                  </div>
                ) : blockedUrl ? (
                  <div className="text-center py-10">
                    <div className="w-14 h-14 bg-lime rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle size={24} className="text-forest" />
                    </div>
                    <h3 className="text-xl font-bold text-ink mb-2">{isAr ? 'خطوة أخيرة' : 'One last step'}</h3>
                    <p className="text-ink-muted mb-5 text-sm max-w-sm mx-auto">
                      {isAr
                        ? 'حظر متصفحك النافذة المنبثقة لواتساب. اضغط الزر أدناه لإرسال استفسارك مباشرةً — لم يُرسل بعد.'
                        : "Your browser blocked the WhatsApp popup, so your inquiry hasn't been sent yet. Tap the button below to send it directly."}
                    </p>
                    <a
                      href={blockedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => { setBlockedUrl(null); setSent(true) }}
                      className="inline-flex items-center justify-center gap-2 bg-whatsapp text-white font-bold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
                    >
                      <MessageCircle size={16} />
                      {isAr ? 'إرسال عبر واتساب' : 'Send via WhatsApp'}
                    </a>
                    <div>
                      <button
                        onClick={() => setBlockedUrl(null)}
                        className="mt-6 border border-border text-ink px-6 py-2 rounded-full text-sm font-medium hover:bg-surface-low transition-colors"
                      >
                        {isAr ? 'العودة إلى النموذج' : 'Back to form'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <h2 className="text-xl font-bold text-ink mb-1">{t('contact.form.h2')}</h2>
                      <p className="text-ink-muted text-sm">
                        {t('contact.form.subtitle')}
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium text-ink-muted mb-1">{t('contact.form.name')} <span className="text-red-500">*</span></label>
                        <input
                          id="contact-name"
                          required
                          type="text"
                          autoComplete="name"
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          placeholder={t('contact.form.namePlaceholder')}
                          className="w-full px-4 py-3 rounded-xl border border-border text-ink bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-phone" className="block text-sm font-medium text-ink-muted mb-1">{t('contact.form.phone')} <span className="text-red-500">*</span></label>
                        <input
                          id="contact-phone"
                          required
                          type="tel"
                          autoComplete="tel"
                          value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                          placeholder={t('contact.form.phonePlaceholder')}
                          className="w-full px-4 py-3 rounded-xl border border-border text-ink bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-ink-muted mb-1">{t('contact.form.email')} <span className="text-red-500">*</span></label>
                      <input
                        id="contact-email"
                        required
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder={t('contact.form.emailPlaceholder')}
                        className="w-full px-4 py-3 rounded-xl border border-border text-ink bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-type" className="block text-sm font-medium text-ink-muted mb-1">{t('contact.form.propertyType')}</label>
                        <select
                          id="contact-type"
                          value={form.type}
                          onChange={e => setForm({ ...form, type: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border text-ink bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
                        >
                          {propertyTypes.map(pt => <option key={pt}>{pt}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="contact-area" className="block text-sm font-medium text-ink-muted mb-1">{t('contact.form.neighborhood')}</label>
                        <select
                          id="contact-area"
                          value={form.area}
                          onChange={e => setForm({ ...form, area: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border text-ink bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
                        >
                          {neighborhoods.map(n => <option key={n}>{n}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium text-ink-muted mb-1">{t('contact.form.message')} <span className="text-red-500">*</span></label>
                      <textarea
                        id="contact-message"
                        required
                        rows={4}
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        placeholder={t('contact.form.messagePlaceholder')}
                        className="w-full px-4 py-3 rounded-xl border border-border text-ink bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/20 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-forest text-white py-4 rounded-full font-bold text-base hover:bg-forest/90 transition-colors"
                    >
                      <Send size={16} />
                      {t('contact.form.submit')}
                    </button>

                    <p className="text-xs text-ink-muted text-center">
                      {isAr
                        ? '⚡ التزام دانية بالاستجابة: يتم توجيه جميع الاستفسارات الرقمية النشطة المقدمة عبر منصتنا الآمنة إلى وكلاء محليين معتمدين، مع ضمان رد رسمي خلال ساعتي عمل. للحصول على قوائم فورية ومعاينات فيديو مباشرة، استخدم بوابة الإيجار عبر واتساب.'
                        : '⚡ Dania Response Commitment: All active digital inquiries submitted through our secure platform are routed to certified local agents, guaranteeing a formal response within 2 business hours. For immediate structural listings and live video previews, use our real-time WhatsApp leasing gateway.'}
                    </p>
                  </form>
                )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── S4: Specialized Leasing Segments ─────────────────────────────── */}
      <section className="py-14">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-2">{t('contact.segments.h2')}</h2>
          </Reveal>
          {/* Mobile: Pitch-style stacked deck */}
          <div className="lg:hidden max-w-md mx-auto mt-8">
            <StackedCards
              items={segments.map((seg, i) => {
                const forest = i === 0
                return (
                  <div key={seg.title} className={`rounded-3xl border p-6 min-h-[248px] flex flex-col shadow-xl shadow-forest/10 ${forest ? 'bg-forest border-forest' : 'bg-white border-border'}`}>
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${forest ? 'bg-lime/20' : 'bg-lime'}`}>
                      <Building2 size={22} className={forest ? 'text-lime' : 'text-forest'} />
                    </div>
                    <h3 className={`font-bold text-xl mb-2 ${forest ? 'text-lime' : 'text-ink'}`}>{seg.title}</h3>
                    <p className={`text-sm leading-relaxed flex-1 ${seg.href ? 'mb-5 ' : ''}${forest ? 'text-white/75' : 'text-ink-muted'}`}>{seg.desc}</p>
                    {seg.href && (
                      <Link to={seg.href} className={`inline-flex items-center gap-1.5 font-semibold text-sm mt-auto ${forest ? 'text-lime' : 'text-forest'}`}>
                        {seg.action} <ArrowRight size={15} className="rtl:-scale-x-100" />
                      </Link>
                    )}
                  </div>
                )
              })}
            />
          </div>

          <div className="hidden lg:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {segments.map((seg, i) => (
              <Reveal key={seg.title} direction="up" delay={i * 80}>
                {seg.href ? (
                  <Link to={seg.href} className="group bg-white rounded-2xl border border-border p-6 flex flex-col gap-3 h-full block linear-card">
                    <div className="w-10 h-10 bg-lime rounded-xl flex items-center justify-center text-forest shrink-0">
                      <Building2 size={18} />
                    </div>
                    <h3 className="font-bold text-ink">{seg.title}</h3>
                    <p className="text-ink-muted text-sm flex-1">{seg.desc}</p>
                    {seg.action && (
                      <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-forest">
                        {seg.action}
                        <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    )}
                  </Link>
                ) : (
                  <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-3 h-full linear-card">
                    <div className="w-10 h-10 bg-lime rounded-xl flex items-center justify-center text-forest shrink-0">
                      <Building2 size={18} />
                    </div>
                    <h3 className="font-bold text-ink">{seg.title}</h3>
                    <p className="text-ink-muted text-sm flex-1">{seg.desc}</p>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── S5: Office / Location ─────────────────────────────────────────── */}
      <section className="bg-surface-low py-14">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="bg-white rounded-2xl border border-border p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
            <Reveal direction="up" className="shrink-0">
              <div className="w-14 h-14 bg-lime rounded-2xl flex items-center justify-center text-forest">
                <MapPin size={26} />
              </div>
            </Reveal>
            <div className="flex-1">
              <Reveal direction="up">
                <h2 className="text-2xl font-bold text-ink mb-3">{isAr ? 'زيارة دانية للعقارات في الدوحة' : 'Visit Dania Real Estate in Doha'}</h2>
              </Reveal>
              <Reveal direction="up" delay={80}>
                <ScrollRevealText
                  className="text-ink-muted text-sm mb-5 max-w-2xl"
                  text={isAr
                    ? 'إذا كنت تفضل إجراء استشارة وجهاً لوجه بشأن استراتيجية نقل القوى العاملة أو خطط التوسع التجاري أو اتفاقيات الإيجار العائلي طويل الأمد، يسعدنا استقبالك في مقرنا الرئيسي بالدوحة.'
                    : 'If you prefer to conduct a face-to-face consultation regarding your corporate workforce relocation strategy, commercial expansion plans, or long-term family leasing agreements, you are welcome to visit our primary Doha headquarters.'}
                />
              </Reveal>
              <Reveal direction="up" delay={160}>
                <div className="bg-surface-low rounded-xl p-5 mb-6 space-y-2">
                  <p className="text-sm font-bold text-ink">{isAr ? 'دانية للعقارات قطر' : 'Dania Real Estate Qatar'}</p>
                  <p className="text-sm text-ink-muted">{isAr ? company.addressAr : company.address}</p>
                  <p className="text-xs text-ink-muted pt-1">
                    {isAr
                      ? 'يقع بشكل استراتيجي على امتداد الممر التجاري البارز في الريان، مما يوفر وصولاً مباشراً للعملاء القادمين من وسط الدوحة والأحياء الغربية.'
                      : 'Strategically located along the prominent Al Rayyan commercial corridor, offering direct access for clients coming from both central Doha and the western suburban belts.'}
                  </p>
                </div>
              </Reveal>
              <Reveal direction="up" delay={240}>
                <div className="flex gap-4 flex-wrap">
                  <a
                    href={`tel:${company.phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-2 bg-forest text-white font-semibold px-5 py-2.5 rounded-full text-sm hover:bg-forest/90 transition-colors"
                  >
                    <Phone size={14} />
                    {isAr ? 'اتصل بمكتب الاستقبال الآن' : 'Call Reception Desk Now'}
                  </a>
                  <a
                    href={`https://wa.me/${company.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-whatsapp text-white font-semibold px-5 py-2.5 rounded-full text-sm hover:opacity-90 transition-opacity"
                  >
                    <MessageCircle size={14} />
                    {isAr ? 'مشاركة موقعنا عبر واتساب' : 'WhatsApp Route Location Pin'}
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── S6: Final CTA ─────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <Reveal direction="up">
            <div className="bg-lime rounded-3xl px-5 py-10 sm:px-8 sm:py-12 md:px-14 md:py-16 text-center">
              <h2 className="text-2xl md:text-3xl font-extrabold text-forest mb-4">
                {t('contact.cta.h2')}
              </h2>
              <ScrollRevealText className="text-forest/80 max-w-2xl mx-auto mb-8 text-sm leading-relaxed" text={t('contact.cta.subtitle')} />

              <div className="flex flex-row flex-wrap gap-2 sm:gap-4 justify-center">
                <a
                  href={`https://wa.me/${company.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-whatsapp text-white font-bold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-sm hover:opacity-90 transition-opacity"
                >
                  <MessageCircle size={16} />
                  {t('contact.cta.primary')}
                </a>
                <a
                  href={`tel:${company.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 bg-forest text-white font-bold px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-full text-sm hover:bg-forest/90 transition-colors"
                >
                  <Phone size={16} />
                  {t('contact.cta.secondary')}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
