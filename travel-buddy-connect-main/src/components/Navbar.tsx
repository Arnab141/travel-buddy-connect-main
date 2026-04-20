import { Button } from "@/components/ui/button";
import { Car, Menu, X, UserCircle, Bell, MapPin, LogOut, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { tbtoken, logout, unreadCount, unreadNotifications, markAsRead, user } = useUser();
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="flex items-center gap-2">
              <motion.div
                className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center"
                whileHover={{ rotate: 10 }}
              >
                <Car className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <span className="text-xl font-bold text-foreground">
                Travel<span className="text-primary">Buddy</span>
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "/user/all-trips", label: "Find Trips" },
              { href: "/#how-it-works", label: "How it Works" },
              { href: "/#share", label: "Share a Ride" },
            ].map((link, index: number) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium relative"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -2 }}
              >
                {link.label}
                <motion.span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            ))}
          </div>

          {/* Desktop Auth / Profile */}
          <div className="hidden md:flex items-center gap-3">
            {tbtoken ? (
              <div className="flex items-center gap-4">
                {/* My Trips Link */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/user/my-trips"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                  >
                    <MapPin className="w-4 h-4" />
                    My Trips
                  </Link>
                </motion.div>

                {/* Notifications Icon */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsNotificationOpen((prev) => !prev)}
                    className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Bell className="w-5 h-5" />

                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 text-[10px] px-1.5 py-0.5 bg-red-500 text-white rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </motion.button>

                  {/* Notification Dropdown */}
                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">

                      {unreadNotifications.length === 0 ? (
                        <div>

                          <div className="p-4 text-sm text-muted-foreground">
                            No new notifications
                          </div>
                          <div className="border-t border-border">
                            <button
                              onClick={() => {
                                setIsNotificationOpen(false);
                                navigate("/user/notifications");
                              }}
                              className="w-full p-3 text-sm font-medium text-primary hover:bg-muted transition"
                            >
                              View All Notifications
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Notification List */}
                          {unreadNotifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => {
                                markAsRead(n.id);
                                setIsNotificationOpen(false);

                                if (n.requestId) {
                                  navigate(`/trips/request/${n.requestId}`, {
                                    state: { notificationId: n.id }
                                  });
                                }
                              }}
                              className={`p-4 cursor-pointer border-b border-border hover:bg-muted/50 transition ${!n.read ? "bg-primary/5" : ""
                                }`}
                            >
                              <p className="text-sm font-medium">{n.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(n.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))}

                          {/* View All Section */}
                          <div className="border-t border-border">
                            <button
                              onClick={() => {
                                setIsNotificationOpen(false);
                                navigate("/user/notifications");
                              }}
                              className="w-full p-3 text-sm font-medium text-primary hover:bg-muted transition"
                            >
                              View All Notifications
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="flex items-center gap-2 px-3 py-2 rounded-full 
      bg-muted hover:bg-muted/70 transition-all duration-200
      border border-border shadow-sm"
                    >
                      {/* Avatar */}
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                        <UserCircle className="w-5 h-5" />
                      </div>

                      {/* User Name */}
                      <span className="text-sm font-medium hidden sm:block">
                        {user?.name || "User"}
                      </span>

                      {/* Dropdown arrow */}
                      <ChevronDown className="w-4 h-4 opacity-60" />
                    </motion.button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-52 rounded-xl bg-card border border-border shadow-lg"
                  >
                    {/* User Info */}
                    <div className="px-3 py-2 border-b border-border">
                      <p className="text-sm font-semibold">{user?.name}</p>
                      {/* <p className="text-xs text-muted-foreground">{user?.email}</p> */}
                    </div>

                    <DropdownMenuItem asChild>
                      <Link
                        to="/user/profile"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={logout}
                      className="flex items-center gap-2 text-destructive cursor-pointer focus:text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" asChild>
                    <Link to="/auth">Log in</Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="default" asChild>
                    <Link to="/auth">Sign up</Link>
                  </Button>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2"
            onClick={() => setIsOpen((prev: boolean) => !prev)}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden py-4 border-t border-border"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col gap-4">
                {[
                  { href: "/user/all-trips", label: "Find Trips" },
                  { href: "/#how-it-works", label: "How it Works" },
                  { href: "/#share", label: "Share a Ride" },
                ].map((link, index: number) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}

                {/* Mobile Auth / Profile */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {tbtoken ? (
                    <div className="flex flex-col gap-3 pt-4 border-t border-border">
                      {/* My Trips */}
                      <Link
                        to="/user/my-trips"
                        className="flex items-center gap-3 text-foreground font-medium py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <MapPin className="w-5 h-5 text-primary" />
                        My Trips
                      </Link>

                      {/* Notifications */}
                      <div>
                        <button
                          onClick={() => setIsNotificationOpen((prev) => !prev)}
                          className="flex items-center gap-3 text-foreground font-medium py-2 w-full text-left"
                        >
                          <div className="relative">
                            <Bell className="w-5 h-5 text-primary" />

                            {unreadCount > 0 && (
                              <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 bg-red-500 text-white rounded-full">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                          Notifications
                        </button>

                        {isNotificationOpen && (
                          <div className="mt-2 bg-card border border-border rounded-lg max-h-64 overflow-y-auto">

                            {unreadNotifications.length === 0 ? (
                              <div>

                                <div className="p-3 text-sm text-muted-foreground">
                                  No new notifications
                                </div>
                                <div className="border-t border-border">
                                  <button
                                    onClick={() => {
                                      setIsNotificationOpen(false);
                                      navigate("/user/notifications");
                                    }}
                                    className="w-full p-3 text-sm font-medium text-primary hover:bg-muted transition"
                                  >
                                    View All Notifications
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                {/* Notification List */}
                                {unreadNotifications.map((n) => (
                                  <div
                                    key={n.id}
                                    onClick={() => {
                                      markAsRead(n.id);
                                      setIsNotificationOpen(false);
                                      setIsOpen(false); // close mobile menu

                                      if (n.requestId) {
                                        navigate(`/trips/request/${n.requestId}`, {
                                          state: { notificationId: n.id }
                                        });
                                      }
                                    }}
                                    className={`p-3 cursor-pointer border-b border-border hover:bg-muted/50 transition ${!n.read ? "bg-primary/5" : ""
                                      }`}
                                  >
                                    <p className="text-sm">{n.message}</p>
                                  </div>
                                ))}

                                {/* View All Button */}
                                <div className="border-t border-border">
                                  <button
                                    onClick={() => {
                                      setIsNotificationOpen(false);
                                      setIsOpen(false); // close mobile menu
                                      navigate("/user/notifications");
                                    }}
                                    className="w-full p-3 text-sm font-medium text-primary hover:bg-muted transition text-center"
                                  >
                                    View All Notifications
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Profile */}
                      <Link
                        to="/user/profile"
                        className="flex items-center gap-3 text-foreground font-medium py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="w-5 h-5 text-primary" />
                        Profile
                      </Link>

                      {/* Logout */}
                      <button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="flex items-center gap-3 text-destructive font-medium py-2 w-full text-left"
                      >
                        <LogOut className="w-5 h-5" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3 pt-4">
                      <Button variant="ghost" className="flex-1" asChild>
                        <Link to="/auth" onClick={() => setIsOpen(false)}>
                          Log in
                        </Link>
                      </Button>
                      <Button variant="default" className="flex-1" asChild>
                        <Link to="/auth" onClick={() => setIsOpen(false)}>
                          Sign up
                        </Link>
                      </Button>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;