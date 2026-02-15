import EcosystemCards from '../components/EcosystemCards';
import Header from '../components/Header';
import CompactSuggestions from '../components/CompactSuggestions';
import PromptSection from '../components/PromptSection';
import GenerateButton from '../components/GenerateButton';
import AspectRatioSelector from '../components/AspectRatioSelector';
import ImageDisplay from '../components/ImageDisplay';
import SignBanner from '../components/SignBanner'; 

export default function Home() {
  return (
    <div className="container">
      <Header />
      
      <main className="main-content">
        {/* ZONE GÉNÉRATEUR (En haut pour PC et Mobile) */}
        <div className="generator-wrapper">
          <CompactSuggestions />
          <AspectRatioSelector />
          {/* Le prompt est maintenant agrandi via le composant PromptSection ci-dessous */}
          <PromptSection />
          <GenerateButton />
        </div>

        {/* AFFICHAGE DE L'IMAGE */}
        <ImageDisplay />
        
        {/* BANNIÈRE TEXTE (Sans bouton Sign In, juste le texte) */}
        <SignBanner />

        {/* ÉCOSYSTÈME (Déplacé tout en bas de la page) */}
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
          gap: 40px;
        }

        .generator-wrapper {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          max-width: 800px; /* Centre le générateur */
          margin: 0 auto;
        }

        /* Espace avant l'écosystème en bas */
        .ecosystem-section-wrapper {
          margin-top: 60px;
          border-top: 1px solid rgba(212, 175, 55, 0.1);
          padding-top: 40px;
        }

        @media (max-width: 768px) {
          .main-content { padding: 15px; gap: 30px; }
        }
      `}</style>
    </div>
  );
}
