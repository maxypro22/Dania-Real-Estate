import { useState, Fragment } from 'react'
import { Reveal } from './Reveal'

export interface ProcessStep {
  num: string
  h3: string
  desc: string
}

interface ProcessStepsProps {
  title: string
  steps: ProcessStep[]
  dark?: boolean
}

export function ProcessSteps({ title, steps, dark = false }: ProcessStepsProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  const isActive = (i: number) => hovered !== null && i <= hovered
  const isLineOn  = (i: number) => hovered !== null && i < hovered

  const textMain = dark ? 'text-white'    : 'text-ink'
  const textSub  = dark ? 'text-white/60' : 'text-ink-muted'

  return (
    <div className="max-w-[1280px] mx-auto px-6">
      <Reveal>
        <h2 className={`text-3xl md:text-4xl font-extrabold ${textMain} mb-16`}>{title}</h2>
      </Reveal>

      {/* ── Desktop: interactive horizontal timeline ── */}
      <div className="hidden lg:block">

        {/* Row 1: circles + connecting lines */}
        <div className="flex items-center mb-10">
          {steps.map((step, i) => (
            <Fragment key={step.num}>
              {/* Circle */}
              <div
                className="relative z-10 shrink-0 cursor-default"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-xl transition-all duration-300 ${
                  isActive(i)
                    ? dark
                      ? 'bg-lime text-forest shadow-[0_0_28px_6px_rgba(196,98,45,0.55)]'
                      : 'bg-lime text-white  shadow-[0_0_28px_6px_rgba(196,98,45,0.30)]'
                    : dark
                      ? 'border-2 border-white/20 text-white/30 bg-transparent'
                      : 'border-2 border-forest/20 text-ink/30 bg-surface-low'
                }`}>
                  {step.num}
                </div>
              </div>

              {/* Connecting line between circles */}
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-[2px] relative cursor-default overflow-hidden ${dark ? 'bg-white/10' : 'bg-border'}`}
                  onMouseEnter={() => setHovered(i + 1)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div
                    className="absolute inset-0 bg-lime origin-left transition-transform duration-500 ease-in-out"
                    style={{ transform: isLineOn(i) ? 'scaleX(1)' : 'scaleX(0)' }}
                  />
                </div>
              )}
            </Fragment>
          ))}
        </div>

        {/* Row 2: step titles + descriptions */}
        <div className="grid grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="pr-6 cursor-default"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <p className={`font-bold text-base mb-2 transition-colors duration-300 ${
                isActive(i) ? 'text-lime' : dark ? 'text-white/40' : 'text-ink/35'
              }`}>
                {step.h3}
              </p>
              <p className={`text-sm leading-relaxed ${textSub}`}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile / Tablet: vertical timeline ── */}
      <div className="lg:hidden">
        {steps.map((step, i) => (
          <Reveal key={step.num} delay={i * 100} direction="up">
            <div className="relative flex gap-5 pb-10 last:pb-0">

              {/* Vertical connecting line */}
              {i < steps.length - 1 && (
                <div
                  className="absolute left-8 top-16 bottom-0 w-0.5 rounded-full"
                  style={{ background: dark
                    ? 'linear-gradient(to bottom, rgba(196,98,45,0.6), rgba(196,98,45,0.1))'
                    : 'linear-gradient(to bottom, #2C100A, #C4622D)'
                  }}
                />
              )}

              {/* Circle */}
              <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center font-black text-xl shrink-0 ring-4 ${
                dark
                  ? 'bg-lime text-forest ring-lime/20'
                  : 'bg-forest text-lime  ring-lime-light'
              }`}>
                {step.num}
              </div>

              {/* Content */}
              <div className="pt-4">
                <h3 className={`font-bold text-base mb-1.5 ${textMain}`}>{step.h3}</h3>
                <p  className={`text-sm leading-relaxed ${textSub}`}>{step.desc}</p>
              </div>

            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
