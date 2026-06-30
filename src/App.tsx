import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'

// Code-split every page — only the current route's JS is loaded
const HomePage               = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })))
const AboutPage              = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })))
const WhyChooseUsPage        = lazy(() => import('@/pages/WhyChooseUsPage').then(m => ({ default: m.WhyChooseUsPage })))
const GalleryPage            = lazy(() => import('@/pages/GalleryPage').then(m => ({ default: m.GalleryPage })))
const ApartmentsPage         = lazy(() => import('@/pages/ApartmentsPage').then(m => ({ default: m.ApartmentsPage })))
const VillasPage             = lazy(() => import('@/pages/VillasPage').then(m => ({ default: m.VillasPage })))
const StaffAccommodationPage = lazy(() => import('@/pages/StaffAccommodationPage').then(m => ({ default: m.StaffAccommodationPage })))
const ShopsPage              = lazy(() => import('@/pages/ShopsPage').then(m => ({ default: m.ShopsPage })))
const StudiosPage            = lazy(() => import('@/pages/StudiosPage').then(m => ({ default: m.StudiosPage })))
const AreasPage              = lazy(() => import('@/pages/AreasPage').then(m => ({ default: m.AreasPage })))
const AreaDetailPage         = lazy(() => import('@/pages/AreaDetailPage').then(m => ({ default: m.AreaDetailPage })))
const FaqPage                = lazy(() => import('@/pages/FaqPage').then(m => ({ default: m.FaqPage })))
const ContactPage            = lazy(() => import('@/pages/ContactPage').then(m => ({ default: m.ContactPage })))

// Minimal blank shell shown while the route chunk loads
function PageLoader() {
  return <div className="min-h-screen bg-white" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about-company/" element={<AboutPage />} />
            <Route path="/about-company/why-choose-us/" element={<WhyChooseUsPage />} />
            <Route path="/about-company/gallery/" element={<GalleryPage />} />
            <Route path="/apartments-for-rent/" element={<ApartmentsPage filter="all" />} />
            <Route path="/apartments-for-rent/1-bedroom/" element={<ApartmentsPage filter="1-bedroom" />} />
            <Route path="/apartments-for-rent/2-bedroom/" element={<ApartmentsPage filter="2-bedroom" />} />
            <Route path="/apartments-for-rent/3-bedroom/" element={<ApartmentsPage filter="3-bedroom" />} />
            <Route path="/villas-for-rent/" element={<VillasPage filter="all" />} />
            <Route path="/villas-for-rent/standard-villas/" element={<VillasPage filter="standard" />} />
            <Route path="/villas-for-rent/compound-villas/" element={<VillasPage filter="compound" />} />
            <Route path="/staff-accommodation/" element={<StaffAccommodationPage />} />
            <Route path="/staff-accommodation/staff-villas/" element={<StaffAccommodationPage />} />
            <Route path="/shops-for-rent/" element={<ShopsPage />} />
            <Route path="/studio-partition-rentals/" element={<StudiosPage filter="all" />} />
            <Route path="/studio-partition-rentals/studio-for-rent/" element={<StudiosPage filter="studio" />} />
            <Route path="/studio-partition-rentals/partition-room-for-rent/" element={<StudiosPage filter="partition" />} />
            <Route path="/studio-partition-rentals/one-bedroom-for-rent/" element={<StudiosPage filter="1br" />} />
            <Route path="/areas/" element={<AreasPage />} />
            <Route path="/areas/:slug/" element={<AreaDetailPage />} />
            <Route path="/faq/" element={<FaqPage />} />
            <Route path="/contact-us/" element={<ContactPage />} />
            {/* Legacy path → canonical spec URL */}
            <Route path="/contact/" element={<Navigate to="/contact-us/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
