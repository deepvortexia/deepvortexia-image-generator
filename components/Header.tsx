import Link from "next/link";

interface HeaderProps {
  credits: number;
}

export default function Header({ credits }: HeaderProps) {
  return (
    <header className="border-b border-gray-800 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link 
          href={process.env.NEXT_PUBLIC_HUB_URL || "https://deepvortexai.art"}
          className="text-gray-400 hover:text-yellow-400 transition-colors"
        >
          ← Back to Home
        </Link>
        
        <h1 className="text-xl md:text-2xl font-bold text-yellow-400">
          DEEP VORTEX AI
        </h1>
        
        <div className="text-yellow-400 flex items-center gap-2">
          <span>💎</span>
          <span>{credits} Credits</span>
        </div>
      </div>
    </header>
  );
}
