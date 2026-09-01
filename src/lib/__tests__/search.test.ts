import { describe, it, expect } from 'vitest'
import { properties } from '@/data/mockData'
import {
  emptyFilters, filterProperties, filtersToQuery, paramsToFilters,
  similarProperties, typeCounts, availableTypes, bedOptions, bathOptions,
  priceBounds, areaBounds, pricePresets, bedCounts, amenityCounts,
} from '@/lib/search'

describe('property search filters', () => {
  it('returns every listing when nothing is set', () => {
    expect(filterProperties(emptyFilters)).toHaveLength(properties.length)
  })

  it('narrows by type, bedrooms, and price together', () => {
    const out = filterProperties({
      ...emptyFilters, types: ['apartment'], beds: ['2'], maxPrice: 6500,
    })
    expect(out.length).toBeGreaterThan(0)
    for (const p of out) {
      expect(p.type).toBe('apartment')
      expect(p.bedrooms).toBe(2)
      expect(p.price).toBeLessThanOrEqual(6500)
    }
  })

  it('matches free text across title, area, and amenities — every word must hit', () => {
    const hits = filterProperties({ ...emptyFilters, q: 'sadd studio' })
    expect(hits.length).toBeGreaterThan(0)
    for (const p of hits) {
      const hay = [p.title, p.location, p.district, ...p.amenities].join(' ').toLowerCase()
      expect(hay).toContain('sadd')
      expect(hay).toContain('studio')
    }
    expect(filterProperties({ ...emptyFilters, q: 'zzzz-nothing' })).toHaveLength(0)
  })

  it('sorts by price in both directions', () => {
    const asc = filterProperties({ ...emptyFilters, sort: 'price-asc' })
    const desc = filterProperties({ ...emptyFilters, sort: 'price-desc' })
    expect(asc[0].price).toBeLessThanOrEqual(asc[asc.length - 1].price)
    expect(desc[0].price).toBe(asc[asc.length - 1].price)
  })

  it('counts categories ignoring the type filter, so chips stay switchable', () => {
    const withType = typeCounts({ ...emptyFilters, types: ['villa'] })
    const without = typeCounts(emptyFilters)
    expect(withType).toEqual(without)
    expect(without.apartment).toBeGreaterThan(0)
  })

  it('round-trips through the URL, keeping defaults out of the query string', () => {
    expect(filtersToQuery(emptyFilters)).toBe('')
    const f = {
      ...emptyFilters, q: 'Al Sadd', types: ['villa' as const], beds: ['4', '5'],
      minPrice: 5000, maxPrice: 20000, furnishing: 'furnished' as const, sort: 'price-asc' as const,
    }
    const back = paramsToFilters(new URLSearchParams(filtersToQuery(f).slice(1)))
    expect(back).toEqual(f)
  })

  it('ignores junk query values instead of throwing', () => {
    const f = paramsToFilters(new URLSearchParams('type=dragon-lair&sort=whatever&min=-5'))
    expect(f.types).toEqual([])
    expect(f.sort).toBe(emptyFilters.sort)
    expect(f.minPrice).toBeNull()
  })

  it('puts premium units first under the default "Featured" sort', () => {
    const out = filterProperties(emptyFilters)
    const firstOrdinary = out.findIndex((p) => !p.premium)
    const lastPremium = out.map((p) => Boolean(p.premium)).lastIndexOf(true)
    expect(firstOrdinary).toBeGreaterThan(0)
    expect(lastPremium).toBeLessThan(firstOrdinary)
  })

  it('sorts by bedrooms both ways, with unit-less listings last', () => {
    const asc = filterProperties({ ...emptyFilters, sort: 'beds-asc' })
    const withBeds = asc.filter((p) => p.bedrooms !== null)
    expect(withBeds[0].bedrooms).toBe(0)
    // Staff blocks and shops carry no bedroom count — they sink to the bottom.
    expect(asc.slice(withBeds.length).every((p) => p.bedrooms === null)).toBe(true)

    const desc = filterProperties({ ...emptyFilters, sort: 'beds-desc' })
    expect(desc[0].bedrooms).toBe(Math.max(...withBeds.map((p) => p.bedrooms ?? 0)))
  })

  it('suggests same-type listings first and never the listing itself', () => {
    const source = properties.find((p) => p.type === 'apartment')!
    const similar = similarProperties(source)
    expect(similar).toHaveLength(3)
    expect(similar.map((s) => s.id)).not.toContain(source.id)
    expect(similar[0].type).toBe('apartment')
  })
})

describe('listing data integrity', () => {
  it('gives every listing a unique slug, a gallery, and an agent', () => {
    const slugs = new Set(properties.map((p) => p.slug))
    expect(slugs.size).toBe(properties.length)
    for (const p of properties) {
      expect(p.images.length).toBeGreaterThanOrEqual(4)
      expect(p.images[0]).toBe(p.image)
      expect(p.agent.whatsapp).toMatch(/^\d+$/)
      expect(p.amenities.length).toBeGreaterThan(0)
      expect(p.price).toBeGreaterThan(0)
    }
  })
})

describe('filter options derived from the data', () => {
  it('offers only property types that exist in the portfolio', () => {
    const offered = availableTypes()
    const actual = new Set(properties.map((p) => p.type))
    expect(offered.length).toBe(actual.size)
    for (const t of offered) expect(actual.has(t)).toBe(true)
  })

  it('offers only bedroom and bathroom counts that exist', () => {
    const beds = bedOptions()
    const actualBeds = new Set(
      properties.filter((p) => p.bedrooms !== null).map((p) => String(Math.min(p.bedrooms!, 7))),
    )
    expect(new Set(beds)).toEqual(actualBeds)

    const baths = bathOptions()
    const actualBaths = new Set(
      properties.filter((p) => p.bathrooms !== null).map((p) => String(Math.min(p.bathrooms!, 5))),
    )
    expect(new Set(baths)).toEqual(actualBaths)
  })

  it('scales the price slider to the cheapest and dearest live rent', () => {
    const { min, max, step } = priceBounds()
    const prices = properties.map((p) => p.price)
    expect(min).toBeLessThanOrEqual(Math.min(...prices))
    expect(max).toBeGreaterThanOrEqual(Math.max(...prices))
    expect(min % step).toBe(0)
    expect(max % step).toBe(0)
    // Snapped outwards, but never further than one step.
    expect(Math.min(...prices) - min).toBeLessThan(step)
  })

  it('scales the area slider to the smallest and largest unit', () => {
    const { min, max } = areaBounds()
    const areas = properties.map((p) => p.area)
    expect(min).toBeLessThanOrEqual(Math.min(...areas))
    expect(max).toBeGreaterThanOrEqual(Math.max(...areas))
  })

  it('builds price bands that ascend and every one of which returns results', () => {
    const bands = pricePresets()
    expect(bands.length).toBeGreaterThanOrEqual(3)
    let previous = 0
    for (const band of bands) {
      const hits = filterProperties({ ...emptyFilters, minPrice: band.min, maxPrice: band.max })
      expect(hits.length).toBeGreaterThan(0)
      expect(band.min ?? 0).toBeGreaterThanOrEqual(previous)
      previous = band.min ?? 0
    }
    expect(bands[0].min).toBeNull()
    expect(bands[bands.length - 1].max).toBeNull()
  })

  it('counts bedroom options against the other filters but not against beds', () => {
    const villasOnly = { ...emptyFilters, types: ['villa' as const] }
    const counts = bedCounts({ ...villasOnly, beds: ['4'] })
    expect(counts).toEqual(bedCounts(villasOnly))
    const villaBeds = properties.filter((p) => p.type === 'villa' && p.bedrooms === 4)
    expect(counts['4']).toBe(villaBeds.length)
  })

  it('zeroes an amenity count when the current filters rule it out', () => {
    const counts = amenityCounts({ ...emptyFilters, types: ['shop'] })
    expect(counts['Maid Room'] ?? 0).toBe(0)
    expect(counts['Glass Frontage']).toBeGreaterThan(0)
  })
})
