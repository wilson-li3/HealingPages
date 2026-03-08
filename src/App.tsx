import Header from './components/Header';
import Hero from './components/Hero';
import ImpactCounter from './components/ImpactCounter';
import MedicalWhy from './components/MedicalWhy';
import About from './components/About';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <main>
      <CustomCursor />
      <Header />
      <Hero />
      <ImpactCounter />
      <MedicalWhy />
      <About />
      <Footer />
    </main>
  );
}

export default App;
