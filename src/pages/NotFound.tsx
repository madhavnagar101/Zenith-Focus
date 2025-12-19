import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <GlassCard className="p-8 max-w-md text-center">
          <div className="text-8xl mb-6">🧭</div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">404</h1>
          <p className="text-muted-foreground mb-6">
            Page "{location.pathname}" not found.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Command Center
            </Link>
          </Button>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default NotFound;
