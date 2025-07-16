import BloodDonationLogo from "./blood-donation-logo";

export default function AppLogo() {
  return (
    <div className="w-full flex items-center justify-center bg-gradient-to-br from-background via-card to-secondary/20 border border-border/50 rounded-2xl p-3 md:p-4 lg:p-5 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
      <div className="relative">
        {/* Subtle glow effect behind logo */}
        <div 
          className="absolute inset-0 rounded-xl opacity-20 blur-xl"
          style={{
            background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
          }}
        />
        
        {/* Main logo */}
        <BloodDonationLogo 
          size="xl" 
          className="relative z-10 transition-all duration-300 hover:scale-105 hover:drop-shadow-lg"
        />
      </div>
    </div>
  );
}