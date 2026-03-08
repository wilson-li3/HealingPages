import Header from './components/Header';
import Hero from './components/Hero';
import ImpactCounter from './components/ImpactCounter';
import MedicalWhy from './components/MedicalWhy';
import { Founder, Partners, Acknowledgements } from './components/About';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <main>
      <CustomCursor />
      <Header />
      <Hero />
      <ImpactCounter />
      <MedicalWhy />
      <Founder />
      <Partners />
      <Acknowledgements />
    </main>
  );
}

export default App;
