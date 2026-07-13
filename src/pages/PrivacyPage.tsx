import { useTranslation } from 'react-i18next'
import { Phone, Mail, MessageCircle, MapPin, ShieldCheck } from 'lucide-react'
import { Reveal } from '@/components/shared/Reveal'
import { Ltr } from '@/components/shared/Ltr'
import { company } from '@/data/mockData'
import { usePageSchema } from '@/components/shared/seo-context'
import { SITE_ORIGIN } from '@/lib/seo'

// ─── Bilingual policy content ────────────────────────────────────────────────
interface Sec { h: string; p: string[] }

const SECTIONS: { en: Sec; ar: Sec }[] = [
  {
    en: {
      h: 'Introduction',
      p: [
        'Dania Real Estate ("we", "us", or "our") is a property management company based in Doha, Qatar. We are committed to protecting the privacy and personal information of every tenant, corporate client, and visitor who interacts with our website and leasing services.',
        'This Privacy Policy explains what information we collect, how we use and safeguard it, and the rights you have over your data when you browse our website or contact us about apartments, villas, shops, studios, or staff accommodation for rent in Qatar.',
      ],
    },
    ar: {
      h: 'مقدمة',
      p: [
        'شركة دانية للعقارات ("نحن" أو "الشركة") هي شركة لإدارة العقارات مقرها الدوحة، قطر. نلتزم بحماية خصوصية والمعلومات الشخصية لكل مستأجر وعميل من الشركات وزائر يتفاعل مع موقعنا الإلكتروني وخدماتنا الإيجارية.',
        'توضّح سياسة الخصوصية هذه المعلومات التي نجمعها، وكيفية استخدامها وحمايتها، والحقوق التي تملكها بشأن بياناتك عند تصفح موقعنا أو التواصل معنا بخصوص الشقق أو الفلل أو المحلات أو الاستوديوهات أو سكن الموظفين للإيجار في قطر.',
      ],
    },
  },
  {
    en: {
      h: 'Information We Collect',
      p: [
        'When you submit an enquiry through our contact form, we collect the details you provide voluntarily: your name, phone number, email address, preferred property type, preferred area or neighborhood, and the content of your message.',
        'We may also automatically collect limited technical information such as your browser type, device, and general usage patterns to help us improve the performance of our website. We do not collect sensitive personal data, and we never request financial or bank account details through this website.',
      ],
    },
    ar: {
      h: 'المعلومات التي نجمعها',
      p: [
        'عند إرسال استفسار عبر نموذج التواصل، نجمع البيانات التي تقدّمها طوعاً: اسمك، ورقم هاتفك، وبريدك الإلكتروني، ونوع العقار المفضّل، والمنطقة أو الحي المفضّل، ومحتوى رسالتك.',
        'قد نجمع أيضاً معلومات تقنية محدودة بشكل تلقائي مثل نوع المتصفح والجهاز وأنماط الاستخدام العامة لمساعدتنا في تحسين أداء موقعنا. لا نجمع بيانات شخصية حساسة، ولا نطلب أبداً تفاصيل الحسابات المالية أو المصرفية عبر هذا الموقع.',
      ],
    },
  },
  {
    en: {
      h: 'How We Use Your Information',
      p: [
        'We use the information you provide solely to respond to your rental enquiries, arrange property viewings, share verified listings that match your requirements, and provide leasing support and follow-up.',
        'We may use your contact details to communicate about the status of your enquiry and to send property options relevant to your request. We do not use your information for unsolicited marketing without your consent.',
      ],
    },
    ar: {
      h: 'كيفية استخدام معلوماتك',
      p: [
        'نستخدم المعلومات التي تقدّمها حصراً للرد على استفساراتك الإيجارية، وترتيب معاينات العقارات، ومشاركة القوائم الموثّقة التي تطابق متطلباتك، وتقديم الدعم والمتابعة في عملية الإيجار.',
        'قد نستخدم بيانات التواصل الخاصة بك لإبلاغك بحالة استفسارك ولإرسال خيارات عقارية ذات صلة بطلبك. لا نستخدم معلوماتك لأغراض تسويقية غير مرغوب فيها دون موافقتك.',
      ],
    },
  },
  {
    en: {
      h: 'WhatsApp and Direct Communication',
      p: [
        'Our website connects you directly with our leasing desk through WhatsApp, phone, and email. When you choose to contact us via WhatsApp, your message and phone number are handled by WhatsApp under its own privacy terms, in addition to being received by our team.',
        'Details you send through the contact form are prepared as a message so our agents can respond quickly. We treat every conversation as confidential and use it only to assist with your property request.',
      ],
    },
    ar: {
      h: 'واتساب والتواصل المباشر',
      p: [
        'يربطك موقعنا مباشرةً بمكتب الإيجار لدينا عبر واتساب والهاتف والبريد الإلكتروني. عند اختيارك التواصل معنا عبر واتساب، تتم معالجة رسالتك ورقم هاتفك من قِبل واتساب وفقاً لشروط الخصوصية الخاصة به، بالإضافة إلى استلامها من قِبل فريقنا.',
        'يتم تجهيز البيانات التي ترسلها عبر نموذج التواصل على شكل رسالة ليتمكن وكلاؤنا من الرد بسرعة. نتعامل مع كل محادثة بسرية تامة ونستخدمها فقط لمساعدتك في طلبك العقاري.',
      ],
    },
  },
  {
    en: {
      h: 'Cookies and Local Storage',
      p: [
        "Our website uses your browser's local storage to remember your language preference (English or Arabic) so your experience stays consistent between visits. This information stays on your device and is not used to identify you personally.",
        'We may use privacy-friendly analytics to understand how visitors use our site. You can clear this data at any time through your browser settings.',
      ],
    },
    ar: {
      h: 'ملفات تعريف الارتباط والتخزين المحلي',
      p: [
        'يستخدم موقعنا التخزين المحلي في متصفحك لتذكّر لغتك المفضّلة (العربية أو الإنجليزية) للحفاظ على تجربة متسقة بين الزيارات. تبقى هذه المعلومات على جهازك ولا تُستخدم للتعرّف على هويتك شخصياً.',
        'قد نستخدم أدوات تحليل تحترم الخصوصية لفهم كيفية استخدام الزوار لموقعنا. يمكنك مسح هذه البيانات في أي وقت من خلال إعدادات المتصفح.',
      ],
    },
  },
  {
    en: {
      h: 'Data Sharing and Disclosure',
      p: [
        'We do not sell, rent, or trade your personal information to third parties. We may share your details only with property owners or trusted partners strictly to fulfil the rental enquiry you initiated, or where required to comply with Qatari law and legitimate legal requests.',
      ],
    },
    ar: {
      h: 'مشاركة البيانات والإفصاح عنها',
      p: [
        'نحن لا نبيع معلوماتك الشخصية أو نؤجّرها أو نتاجر بها لأطراف ثالثة. قد نشارك بياناتك فقط مع مالكي العقارات أو الشركاء الموثوقين وحصراً لتلبية الاستفسار الإيجاري الذي بدأته، أو عند الحاجة للامتثال للقوانين القطرية والطلبات القانونية المشروعة.',
      ],
    },
  },
  {
    en: {
      h: 'Data Security and Retention',
      p: [
        'We apply reasonable technical and organizational measures to protect your information against unauthorized access, loss, or misuse. While no method of transmission over the internet is completely secure, we continually work to safeguard the data you entrust to us.',
        'We retain enquiry information only for as long as necessary to serve your request and to meet our legitimate business and legal obligations. When it is no longer needed, we take steps to delete or anonymize it.',
      ],
    },
    ar: {
      h: 'أمن البيانات والاحتفاظ بها',
      p: [
        'نطبّق تدابير تقنية وتنظيمية معقولة لحماية معلوماتك من الوصول غير المصرّح به أو الفقدان أو سوء الاستخدام. ومع أنه لا توجد وسيلة نقل عبر الإنترنت آمنة تماماً، فإننا نعمل باستمرار على حماية البيانات التي تأتمننا عليها.',
        'نحتفظ بمعلومات الاستفسار فقط للمدة اللازمة لخدمة طلبك والوفاء بالتزاماتنا التجارية والقانونية المشروعة. وعندما لم تعد هناك حاجة إليها، نتخذ خطوات لحذفها أو جعلها مجهولة الهوية.',
      ],
    },
  },
  {
    en: {
      h: 'Your Rights',
      p: [
        'You have the right to request access to the personal information we hold about you, to ask for corrections, and to request that we delete your data where there is no legal or business requirement to keep it.',
        'To exercise any of these rights, contact us using the details below and we will respond promptly.',
      ],
    },
    ar: {
      h: 'حقوقك',
      p: [
        'يحق لك طلب الاطّلاع على المعلومات الشخصية التي نحتفظ بها عنك، وطلب تصحيحها، وطلب حذف بياناتك في الحالات التي لا يوجد فيها التزام قانوني أو تجاري بالاحتفاظ بها.',
        'لممارسة أي من هذه الحقوق، تواصل معنا عبر التفاصيل الواردة أدناه وسنرد عليك في أقرب وقت.',
      ],
    },
  },
  {
    en: {
      h: 'Third-Party Links and Children’s Privacy',
      p: [
        'Our website may contain links to external platforms such as WhatsApp, Google Maps, Facebook, and Instagram. These services operate under their own privacy policies, and we are not responsible for their practices — we encourage you to review them separately.',
        'Our services are intended for adults seeking rental properties. We do not knowingly collect personal information from children. If you believe a child has provided us with data, please contact us so we can remove it.',
      ],
    },
    ar: {
      h: 'روابط الأطراف الثالثة وخصوصية الأطفال',
      p: [
        'قد يحتوي موقعنا على روابط لمنصات خارجية مثل واتساب وخرائط جوجل وفيسبوك وإنستغرام. تعمل هذه الخدمات وفقاً لسياسات الخصوصية الخاصة بها، ولسنا مسؤولين عن ممارساتها — وننصحك بمراجعتها بشكل منفصل.',
        'خدماتنا موجّهة للبالغين الباحثين عن عقارات للإيجار. نحن لا نجمع عن قصد معلومات شخصية من الأطفال. وإذا كنت تعتقد أن طفلاً قد زوّدنا ببيانات، يُرجى التواصل معنا لإزالتها.',
      ],
    },
  },
  {
    en: {
      h: 'Changes to This Policy',
      p: [
        'We may update this Privacy Policy from time to time to reflect changes in our services or legal requirements. Any updates will be posted on this page with a revised date. We encourage you to review it periodically to stay informed about how we protect your information.',
      ],
    },
    ar: {
      h: 'التعديلات على هذه السياسة',
      p: [
        'قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر لتعكس التغييرات في خدماتنا أو المتطلبات القانونية. سيتم نشر أي تحديثات على هذه الصفحة مع تاريخ منقّح. وننصحك بمراجعتها دورياً للبقاء على اطّلاع بكيفية حمايتنا لمعلوماتك.',
      ],
    },
  },
]

export function PrivacyPage() {
  const { i18n } = useTranslation()
  const isAr = i18n.language === 'ar'

  usePageSchema([
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${SITE_ORIGIN}/privacy-policy/#webpage`,
      url: `${SITE_ORIGIN}/privacy-policy/`,
      name: 'Privacy Policy | Dania Real Estate Qatar',
      description:
        'How Dania Real Estate collects, uses, and protects your personal information when you enquire about properties for rent in Doha, Qatar.',
      isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
      publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      inLanguage: isAr ? 'ar' : 'en',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: isAr ? 'الرئيسية' : 'Home', item: `${SITE_ORIGIN}/` },
        { '@type': 'ListItem', position: 2, name: isAr ? 'سياسة الخصوصية' : 'Privacy Policy', item: `${SITE_ORIGIN}/privacy-policy/` },
      ],
    },
  ])

  const updated = isAr ? 'آخر تحديث: يوليو 2026' : 'Last updated: July 2026'

  return (
    <>
      <title>Privacy Policy | Dania Real Estate Qatar</title>
      <meta
        name="description"
        content="Read the Dania Real Estate privacy policy. Learn how we collect, use, and protect your personal information when you enquire about properties for rent in Doha, Qatar."
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-forest text-white py-16 md:py-20">
        <div className="max-w-[880px] mx-auto px-6">
          <Reveal direction="up">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-lime mb-5">
              <ShieldCheck size={15} />
              {isAr ? 'خصوصيتك تهمّنا' : 'Your privacy matters'}
            </div>
          </Reveal>
          <Reveal direction="up" delay={80}>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </h1>
          </Reveal>
          <Reveal direction="up" delay={160}>
            <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-2xl">
              {isAr
                ? 'في دانية للعقارات، نحرص على حماية بياناتك بنفس العناية التي نقدّم بها خدماتنا العقارية. تشرح هذه الصفحة كيف نتعامل مع معلوماتك عند استخدامك لموقعنا في الدوحة، قطر.'
                : 'At Dania Real Estate, we protect your data with the same care we bring to our property services. This page explains how we handle your information when you use our website in Doha, Qatar.'}
            </p>
          </Reveal>
          <Reveal direction="up" delay={240}>
            <p className="text-white/50 text-xs mt-5">{updated}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Policy body ───────────────────────────────────────────────────── */}
      <section className="bg-surface-low py-14 md:py-16">
        <div className="max-w-[880px] mx-auto px-6">
          <div className="bg-white rounded-2xl border border-border p-6 md:p-10 space-y-10">
            {SECTIONS.map((sec, i) => {
              const s = isAr ? sec.ar : sec.en
              return (
                <Reveal key={i} direction="up" delay={Math.min(i, 4) * 40}>
                  <article>
                    <h2 className="text-xl md:text-2xl font-bold text-ink mb-3 flex items-baseline gap-3">
                      <span className="text-lime text-base font-bold">{String(i + 1).padStart(2, '0')}</span>
                      {s.h}
                    </h2>
                    <div className="space-y-3">
                      {s.p.map((para, j) => (
                        <p key={j} className="text-ink-muted text-sm md:text-[15px] leading-relaxed">{para}</p>
                      ))}
                    </div>
                  </article>
                </Reveal>
              )
            })}

            {/* Contact section — uses live company details */}
            <Reveal direction="up">
              <article className="border-t border-border pt-8">
                <h2 className="text-xl md:text-2xl font-bold text-ink mb-3 flex items-baseline gap-3">
                  <span className="text-lime text-base font-bold">{String(SECTIONS.length + 1).padStart(2, '0')}</span>
                  {isAr ? 'تواصل معنا' : 'Contact Us'}
                </h2>
                <p className="text-ink-muted text-sm md:text-[15px] leading-relaxed mb-5">
                  {isAr
                    ? 'إذا كانت لديك أي أسئلة حول سياسة الخصوصية هذه أو ترغب في ممارسة أي من حقوقك، يُرجى التواصل مع دانية للعقارات عبر:'
                    : 'If you have any questions about this Privacy Policy or wish to exercise any of your rights, please contact Dania Real Estate at:'}
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 rounded-xl bg-surface-low px-4 py-3 text-sm text-ink hover:text-forest transition-colors">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime text-forest shrink-0"><Phone size={16} /></span>
                    <Ltr>{company.phone}</Ltr>
                  </a>
                  <a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl bg-surface-low px-4 py-3 text-sm text-ink hover:text-forest transition-colors">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime text-forest shrink-0"><MessageCircle size={16} /></span>
                    <Ltr>{company.whatsappDisplay}</Ltr>
                  </a>
                  <a href={`mailto:${company.email}`} className="flex items-center gap-3 rounded-xl bg-surface-low px-4 py-3 text-sm text-ink hover:text-forest transition-colors">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime text-forest shrink-0"><Mail size={16} /></span>
                    <Ltr>{company.email}</Ltr>
                  </a>
                  <div className="flex items-center gap-3 rounded-xl bg-surface-low px-4 py-3 text-sm text-ink">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime text-forest shrink-0"><MapPin size={16} /></span>
                    <span>{isAr ? company.addressAr : company.address}</span>
                  </div>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
