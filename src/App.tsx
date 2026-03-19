import Header from './components/Header';
import Hero from './components/Hero';
import ImpactCounter from './components/ImpactCounter';
import MedicalWhy from './components/MedicalWhy';
import { Founder, Partners, Acknowledgements } from './components/About';
import DonateForm from './components/DonateForm';

function App() {
  return (
    <main>
      <Header />
      <Hero />
      <ImpactCounter />
      <MedicalWhy />
      <Founder />
      <Partners />
      <DonateForm />
      <Acknowledgements />
    </main>
  );
}

export default App;
