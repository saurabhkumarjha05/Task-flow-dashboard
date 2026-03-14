import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Home, LayoutDashboard, User, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-xl">TaskFlow</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`transition-colors hover:text-foreground/80 flex items-center gap-2 ${
                    isActive ? 'text-foreground' : 'text-foreground/60'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        {/* Mobile brand */}
        <Link to="/" className="mr-6 flex items-center space-x-2 md:hidden">
          <span className="font-bold text-xl">TaskFlow</span>
        </Link>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
              >
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              {user ? (
                <>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="text-sm font-medium leading-none">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center gap-2"
                    onSelect={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/signup" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Sign up
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-14 z-50 grid h-[calc(100vh-3.5rem)] w-full grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden">
          <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">TaskFlow</span>
            </Link>
            <nav className="grid grid-flow-row auto-rows-max text-sm">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex w-full items-center justify-start gap-2 rounded-md p-2 text-sm font-medium hover:accent hover:text-accent-foreground ${
                      isActive ? 'bg-accent text-accent-foreground' : 'text-foreground/60'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
}
