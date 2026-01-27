import suLogo from '@/assets/SU-LOGOwhite-small.png';

export function Footer() {
  return (
    <footer className="w-full border-t border-primary/20 bg-primary text-primary-foreground mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 flex-col sm:flex-row items-center justify-between gap-2 py-4">
          <div className="text-sm opacity-80 text-center sm:text-left">
            <div>© {new Date().getFullYear()} AUC Student Union. All rights reserved.</div>
            <div className="mt-1">Developed by Ahmed Abdeen & Islam Abdeen</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm opacity-80 hidden sm:inline">AUC Student Union</span>
            <img src={suLogo} alt="Student Union" className="h-10 w-auto" />
          </div>
        </div>
      </div>
    </footer>
  );
}
