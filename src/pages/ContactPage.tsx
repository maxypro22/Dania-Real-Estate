import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Building2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/shared/Reveal'
import { company } from '@/data/mockData'
import { usePageSchema } from '@/components/shared/Seo'
import { contactPageSchema } from '@/lib/seo'

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
    { icon: <Phone size={20} />, label: cardMeta[0]?.label ?? '', desc: cardMeta[0]?.desc ?? '', value: company.phone, href: `tel:${company.phone.replace(/\s/g, '')}` },
    { icon: <MessageCircle size={20} />, label: cardMeta[1]?.label ?? '', desc: cardMeta[1]?.desc ?? '', value: company.whatsappDisplay, href: `https://wa.me/${company.whatsapp}` },
    { icon: <Mail size={20} />, label: cardMeta[2]?.label ?? '', desc: cardMeta[2]?.desc ?? '', value: company.email, href: `mailto:${company.email}` },
    { icon: <MapPin size={20} />, label: cardMeta[3]?.label ?? '', desc: cardMeta[3]?.desc ?? '', value: company.address, href: 'https://maps.google.com/?q=Al+Muftah+Plaza+Building,+Al+Rayyan+Road,+Doha,+Qatar' },
    { icon: <Clock size={20} />, label: cardMeta[4]?.label ?? '', desc: cardMeta[4]?.desc ?? '', value: isAr ? 'الأحد–الخميس: 8:00 ص – 5:00 م (توقيت قطر)\nالجمعة والسبت: مغلق — مراقبة واتساب لمتطلبات الشركات العاجلة' : 'Sun–Thu: 8:00 AM – 5:00 PM (Qatar Standard Time)\nFri & Sat: Closed — Active WhatsApp Monitoring for urgent corporate requirements', href: undefined as string | undefined },
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
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
                <p className="text-lime text-lg font-semibold mb-4">
                  {t('contact.hero.subtitle')}
                </p>
              </Reveal>
              <Reveal direction="up" delay={200}>
                <p className="text-white/70 text-sm leading-relaxed mb-8">
                  {isAr
                    ? 'هل أنت مستعد لتسهيل بحثك عن العقار؟ سواء كنت تبحث عن شقة حديثة أو فيلا فاخرة أو سكن للعمال أو محل تجاري، فريقنا هنا لمساعدتك.'
                    : 'Ready to streamline your property search? Whether you are looking for a modern low-rise apartment in downtown Doha, a spacious family compound villa, a certified workforce staff accommodation layout, or a high-footfall commercial shop location, our leasing desk is fully active and ready to help. At Dania Real Estate, we strip away the guesswork from the local market. Connect with our certified area specialists right now to receive unedited interior walk-through videos, verified floor plan drawings, and transparent municipality lease conditions structured exactly around your target monthly budget and preferred move-in window.'}
                </p>
              </Reveal>
              <Reveal direction="up" delay={300}>
                <div className="flex flex-row flex-wrap gap-2 sm:gap-4">
                  <a
                    href={`tel:${company.phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center justify-center gap-2 bg-lime text-forest font-bold px-6 py-3 rounded-full text-sm hover:bg-white transition-colors"
                  >
                    <Phone size={15} />
                    {isAr ? `اتصل بمكتب الإيجار: ${company.phone}` : `Call Leasing Desk: ${company.phone}`}
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
            <p className="text-ink-muted text-sm mb-10 max-w-2xl">
              {isAr
                ? 'تواصل مع مقرنا المؤسسي مباشرة عبر أي من قنوات التواصل الآمنة المُدارة لدينا:'
                : 'Connect with our corporate headquarters directly through any of our managed secure communication access points:'}
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {contactCards.map((card, i) => (
              <Reveal key={card.label} direction="up" delay={i * 80}>
                <div className="bg-white rounded-2xl border border-border p-6 h-full flex flex-col gap-4">
                  <div className="w-11 h-11 bg-lime rounded-xl flex items-center justify-center text-forest shrink-0">
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-1">{card.label}</p>
                    {card.href ? (
                      <a
                        href={card.href}
                        target={card.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="text-forest text-sm font-medium hover:underline leading-relaxed"
                      >
                        {card.value}
                      </a>
                    ) : (
                      <p className="text-ink text-sm leading-relaxed whitespace-pre-line">{card.value}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
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
                        {company.whatsappDisplay}
                      </a>
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="mt-6 border border-border text-ink px-6 py-2 rounded-full text-sm font-medium hover:bg-surface-low transition-colors"
                    >
                      {isAr ? 'إرسال استفسار آخر' : 'Send Another Inquiry'}
                    </button>
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
                        <label className="block text-sm font-medium text-ink-muted mb-1">{t('contact.form.name')} <span className="text-red-500">*</span></label>
                        <input
                          required
                          type="text"
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          placeholder={t('contact.form.namePlaceholder')}
                          className="w-full px-4 py-3 rounded-xl border border-border text-ink bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink-muted mb-1">{t('contact.form.phone')} <span className="text-red-500">*</span></label>
                        <input
                          required
                          type="tel"
                          value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                          placeholder={t('contact.form.phonePlaceholder')}
                          className="w-full px-4 py-3 rounded-xl border border-border text-ink bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ink-muted mb-1">{t('contact.form.email')} <span className="text-red-500">*</span></label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder={t('contact.form.emailPlaceholder')}
                        className="w-full px-4 py-3 rounded-xl border border-border text-ink bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-ink-muted mb-1">{t('contact.form.propertyType')}</label>
                        <select
                          value={form.type}
                          onChange={e => setForm({ ...form, type: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border text-ink bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
                        >
                          {propertyTypes.map(pt => <option key={pt}>{pt}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink-muted mb-1">{t('contact.form.neighborhood')}</label>
                        <select
                          value={form.area}
                          onChange={e => setForm({ ...form, area: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border text-ink bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
                        >
                          {neighborhoods.map(n => <option key={n}>{n}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ink-muted mb-1">{t('contact.form.message')} <span className="text-red-500">*</span></label>
                      <textarea
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {segments.map((seg, i) => (
              <Reveal key={seg.title} direction="up" delay={i * 80}>
                {seg.href ? (
                  <Link to={seg.href} className="group bg-white rounded-2xl border border-border p-6 flex flex-col gap-3 h-full hover:border-lime transition-colors block">
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
                  <div className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-3 h-full">
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
                <p className="text-ink-muted text-sm mb-5 max-w-2xl">
                  {isAr
                    ? 'إذا كنت تفضل إجراء استشارة وجهاً لوجه بشأن استراتيجية نقل القوى العاملة أو خطط التوسع التجاري أو اتفاقيات الإيجار العائلي طويل الأمد، يسعدنا استقبالك في مقرنا الرئيسي بالدوحة.'
                    : 'If you prefer to conduct a face-to-face consultation regarding your corporate workforce relocation strategy, commercial expansion plans, or long-term family leasing agreements, you are welcome to visit our primary Doha headquarters.'}
                </p>
              </Reveal>
              <Reveal direction="up" delay={160}>
                <div className="bg-surface-low rounded-xl p-5 mb-6 space-y-2">
                  <p className="text-sm font-bold text-ink">{isAr ? 'دانية للعقارات قطر' : 'Dania Real Estate Qatar'}</p>
                  <p className="text-sm text-ink-muted">{company.address}</p>
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
              <p className="text-forest/80 max-w-2xl mx-auto mb-8 text-sm leading-relaxed">
                {t('contact.cta.subtitle')}
              </p>
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
