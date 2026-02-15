import EcosystemCards from '../components/EcosystemCards';
import Header from '../components/Header';
import CompactSuggestions from '../components/CompactSuggestions';
import PromptSection from '../components/PromptSection';
import GenerateButton from '../components/GenerateButton';
import AspectRatioSelector from '../components/AspectRatioSelector';
import ImageDisplay from '../components/ImageDisplay';
// J'ai enlevé l'import de SignBanner pour l'instant pour corriger l'erreur

export default function Home() {
  return (
    <div className="container">
      <Header />
      
      <main className="main-content">
        {/* 1. GÉNÉRATEUR EN HAUT */}
        <div className="generator-wrapper">
          <CompactSuggestions />
          <AspectRatioSelector />
          <PromptSection />
          <GenerateButton />
        </div>

        {/* 2. IMAGE */}
        <ImageDisplay />
        
        {/* Pas de bannière pour l'instant (pour éviter le bug) */}

        {/* 3. ÉCOSYSTÈME EN BAS */}
        <div className="ecosystem-section-wrapper">
          <EcosystemCards />
        </div>
      </main>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background-color: #0a0a0a; color: #ffffff; font-family: 'Inter', sans-serif; }
        a { text-decoration: none; }
      `}</style>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.1) 0%, rgba(10, 10, 10, 1) 70%);
          padding-bottom: 40px;
        }
        
        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .generator-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .ecosystem-section-wrapper {
          margin-top: 60px;
          border-top: 1px solid rgba(212, 175, 55, 0.1);
          padding-top: 40px;
        }

        @media (max-width: 768px) {
          .main-content { padding: 15px; gap: 20px; }
        }
      `}</style>
    </div>
  );
}

