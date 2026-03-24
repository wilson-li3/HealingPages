import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ImpactCounter from './components/ImpactCounter';
import MedicalWhy from './components/MedicalWhy';
import { Founder, Partners, Acknowledgements } from './components/About';
import DonateForm from './components/DonateForm';
import SchedulePickup from './components/SchedulePickup';

const Admin = lazy(() => import('./pages/Admin'));

function MainSite() {
  return (
    <main>
      <Header />
      <Hero />
      <ImpactCounter />
      <MedicalWhy />
      <Founder />
      <Partners />
      <DonateForm />
      <SchedulePickup />
      <Acknowledgements />
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainSite />} />
      <Route
        path="/admin"
        element={
          <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center"><p className="text-gray-500 text-sm">Loading...</p></div>}>
            <Admin />
          </Suspense>
        }
      />
    </Routes>
  );
}

export default App;
