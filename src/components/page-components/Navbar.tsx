"use client"

import Link from "next/link"
import React, { useState, useEffect, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Menu, ShoppingCart, Search, X, User, LogOut, Package, Settings, Truck, Wheat } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FadeIn } from "@/components/animations"

const Navbar = memo(() => {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const { getCartItemCount } = useCart()
  
  // Scroll detection for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      setScrolled(isScrolled)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenu && !(event.target as Element).closest('.user-menu-container')) {
        setUserMenu(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [userMenu])
  
  const navLinks = React.useMemo(() => [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ], [])

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }, [searchQuery])

  const handleLogout = useCallback(async () => {
    await logout()
    setUserMenu(false)
  }, [logout])

  const cartItemCount = getCartItemCount()

  // Memoized components for better performance
  const desktopNav = React.useMemo(() => (
    <motion.nav 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, staggerChildren: 0.1 }}
      className="hidden md:flex items-center space-x-6"
    >
      {navLinks.map((link, index) => (
        <motion.div
          key={link.name}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.5 }}
          whileHover={{ y: -2 }}
        >
          <Link
            href={link.href}
            className="relative text-foreground text-sm lg:text-base transition-all duration-300 hover:text-primary group
            after:content-[''] after:absolute after:w-0 after:h-[2px] 
            after:left-0 after:-bottom-1 after:bg-primary 
            after:transition-all after:duration-300 
            hover:after:w-full font-medium"
          >
            <span className="relative z-10">{link.name}</span>
            <div className="absolute inset-0 bg-primary/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
          </Link>
        </motion.div>
      ))}
    </motion.nav>
  ), [navLinks])

  const searchForm = React.useMemo(() => (
    <motion.form 
      onSubmit={handleSearch} 
      className="relative w-40 lg:w-56 group"
      whileHover={{ scale: 1.02 }}
      whileFocus={{ scale: 1.02 }}
    >
      <Input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 w-full rural-input transition-all duration-300 focus:ring-2 focus:ring-primary group-hover:shadow-md"
      />
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="absolute left-3 top-2.5 h-4 w-4 text-gray-500"
      >
        <Search className="h-4 w-4" />
      </motion.div>
    </motion.form>
  ), [handleSearch, searchQuery])

  const cartButton = React.useMemo(() => (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link href="/cart">
        <Button
          variant="outline"
          size="icon"
          className="relative rural-button transition-all duration-300 hover:bg-primary hover:text-white shadow-md hover:shadow-lg"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartItemCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-destructive text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center font-medium"
            >
              <motion.span
                key={cartItemCount}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </motion.span>
            </motion.span>
          )}
        </Button>
      </Link>
    </motion.div>
  ), [cartItemCount])

  const userMenuContent = React.useMemo(() => (
    <AnimatePresence>
      {userMenu && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-48 bg-background/95 backdrop-blur-md rounded-xl shadow-xl border border-border/50 py-2 z-50 overflow-hidden"
        >
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              href="/profile"
              className="flex items-center px-4 py-3 text-sm text-foreground hover:bg-primary/10 transition-all duration-200 group"
              onClick={() => setUserMenu(false)}
            >
              <User className="mr-3 h-4 w-4 group-hover:text-primary transition-colors" />
              Profile
            </Link>
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Link
              href="/orders"
              className="flex items-center px-4 py-3 text-sm text-foreground hover:bg-primary/10 transition-all duration-200 group"
              onClick={() => setUserMenu(false)}
            >
              <Package className="mr-3 h-4 w-4 group-hover:text-primary transition-colors" />
              My Orders
            </Link>
          </motion.div>
          {(user?.role === 'admin' || user?.role === 'vendor') && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {user?.role === 'admin' ? (
              <Link
                href="/admin"
                className="flex items-center px-4 py-3 text-sm text-foreground hover:bg-primary/10 transition-all duration-200 group"
                onClick={() => setUserMenu(false)}
              >
                <Settings className="mr-3 h-4 w-4 group-hover:text-primary transition-colors" />
                Admin Dashboard
              </Link>
            ) : (
              <Link
                href="/vendor"
                className="flex items-center px-4 py-3 text-sm text-foreground hover:bg-primary/10 transition-all duration-200 group"
                onClick={() => setUserMenu(false)}
              >
                <Settings className="mr-3 h-4 w-4 group-hover:text-primary transition-colors" />
                Vendor Dashboard
              </Link>
            )}
            </motion.div>
          )}
          <hr className="my-2 border-border/30" />
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm text-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group"
            >
              <LogOut className="mr-3 h-4 w-4 group-hover:text-destructive transition-colors" />
              Logout
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  ), [userMenu, user?.role, handleLogout])

  const authButtons = React.useMemo(() => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center space-x-2"
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link href="/auth/login">
          <Button
            variant="outline"
            className="cursor-pointer rural-button transition-all duration-300 hover:bg-primary hover:text-white shadow-md hover:shadow-lg"
          >
            Login
          </Button>
        </Link>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link href="/auth/register">
          <Button
            className="cursor-pointer rural-button transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Join Market
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  ), [])

  const mobileMenuContent = React.useMemo(() => (
    <AnimatePresence>
      {mobileMenu && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden rural-card border-t border-accent/20 backdrop-blur-md bg-background/95 overflow-hidden"
        >
          <div className="container-fluid py-4 space-y-4">
            {/* Enhanced Mobile Navigation Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, staggerChildren: 0.05 }}
              className="space-y-2"
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ x: 4 }}
                >
                  <Link
                    href={link.href}
                    className="block text-foreground py-3 px-4 border-b border-accent/10 text-base font-medium relative transition-all duration-300 hover:text-primary hover:bg-primary/5 rounded-lg group
                    after:content-[''] after:absolute after:w-0 after:h-[2px] 
                    after:left-4 after:bottom-0 after:bg-primary 
                    after:transition-all after:duration-300 
                    hover:after:w-8"
                    onClick={() => setMobileMenu(false)}
                  >
                    <span className="relative z-10">{link.name}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Enhanced Mobile Search + Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-3 pt-4"
            >
              <motion.form 
                onSubmit={handleSearch} 
                className="relative flex-1 group"
                whileHover={{ scale: 1.02 }}
              >
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 w-full rural-input text-base transition-all duration-300 focus:ring-2 focus:ring-primary group-hover:shadow-md"
                />
                <Search className="absolute left-4 top-3 h-5 w-5 text-gray-500" />
              </motion.form>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/cart">
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative rural-button transition-all duration-300 hover:bg-primary hover:text-white shadow-md h-12 w-12"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemCount > 0 && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 bg-destructive text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center font-medium"
                      >
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </motion.span>
                    )}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Enhanced Mobile Authentication */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-4 border-t border-accent/20"
            >
              {isAuthenticated && user ? (
                <div className="space-y-3">
                  <motion.div 
                    className="flex items-center space-x-3 py-3 px-4 bg-primary/5 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Avatar className="w-10 h-10 border-2 border-primary/20">
                      {user.avatar ? (
                        <AvatarImage src={user.avatar} alt={user.name} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <span className="font-semibold text-foreground">{user.name}</span>
                      <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                    </div>
                  </motion.div>
                  
                  <div className="space-y-2">
                    <motion.div whileHover={{ x: 4 }}>
                      <Link
                        href="/profile"
                        className="flex items-center py-3 px-4 text-foreground hover:bg-primary/10 rounded-lg transition-all duration-200 group"
                        onClick={() => setMobileMenu(false)}
                      >
                        <User className="mr-3 h-5 w-5 group-hover:text-primary transition-colors" />
                        Profile
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ x: 4 }}>
                      <Link
                        href="/orders"
                        className="flex items-center py-3 px-4 text-foreground hover:bg-primary/10 rounded-lg transition-all duration-200 group"
                        onClick={() => setMobileMenu(false)}
                      >
                        <Package className="mr-3 h-5 w-5 group-hover:text-primary transition-colors" />
                        My Orders
                      </Link>
                    </motion.div>
                    {(user.role === 'admin' || user.role === 'vendor') && (
                      <motion.div whileHover={{ x: 4 }}>
                        <Link
                          href="/admin"
                          className="flex items-center py-3 px-4 text-foreground hover:bg-primary/10 rounded-lg transition-all duration-200 group"
                          onClick={() => setMobileMenu(false)}
                        >
                          <Settings className="mr-3 h-5 w-5 group-hover:text-primary transition-colors" />
                          Dashboard
                        </Link>
                      </motion.div>
                    )}
                    <motion.div whileHover={{ x: 4 }}>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full py-3 px-4 text-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-all duration-200 group"
                      >
                        <LogOut className="mr-3 h-5 w-5 group-hover:text-destructive transition-colors" />
                        Logout
                      </button>
                    </motion.div>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/auth/login" className="block">
                      <Button
                        variant="outline"
                        className="w-full cursor-pointer rural-button transition-all duration-300 hover:bg-primary hover:text-white shadow-md h-12"
                        onClick={() => setMobileMenu(false)}
                      >
                        Login
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/auth/register" className="block">
                      <Button
                        className="w-full cursor-pointer rural-button transition-all duration-300 shadow-md h-12"
                        onClick={() => setMobileMenu(false)}
                      >
                        Join Market
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  ), [mobileMenu, navLinks, handleSearch, searchQuery, cartItemCount, isAuthenticated, user, handleLogout])

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`bg-gradient-to-r from-background via-card to-background shadow-lg border-b-2 border-accent/20 sticky top-0 z-50 w-full rural-card transition-all duration-300 ${
        scrolled ? 'backdrop-blur-md bg-background/95 shadow-xl' : ''
      }`}
    >
      <div className="container-fluid py-3 md:py-4 flex justify-between items-center">
        {/* Enhanced Logo with micro-animations */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl sm:text-2xl font-bold text-primary transition duration-300 hero-title group"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative"
            >
              <Wheat className="h-8 w-8 sm:h-10 sm:w-10 text-accent transition-transform group-hover:scale-110" />
            </motion.div>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SUPER-MALL
            </span>
          </Link>
        </motion.div>

        {/* Enhanced Desktop Nav with staggered animations */}
        {desktopNav}

        {/* Enhanced Search + Cart + User Menu (Desktop) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="hidden md:flex items-center space-x-4"
        >
          {/* Enhanced Search with animation */}
          {searchForm}

          {/* Enhanced Cart with pulse animation */}
          {cartButton}

          {/* Enhanced Authentication */}
          {isLoading ? (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent"
            />
          ) : isAuthenticated && user ? (
            <div className="relative user-menu-container">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 p-2 hover:bg-primary/10 transition-all duration-300"
                  onClick={() => setUserMenu(!userMenu)}
                >
                  <Avatar className="w-8 h-8 border-2 border-primary/20">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="hidden lg:block font-medium">{user.name}</span>
                </Button>
              </motion.div>
              
              {userMenuContent}
            </div>
          ) : (
            authButtons
          )}
        </motion.div>

        {/* Enhanced Mobile Menu Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="md:hidden"
        >
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Menu"
            className="transition-all duration-300 hover:bg-primary/10 rounded-xl"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            <motion.div
              animate={{ rotate: mobileMenu ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {mobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.div>
          </Button>
        </motion.div>
      </div>

      {/* Enhanced Mobile Menu */}
      {mobileMenuContent}
    </motion.header>
  )
})

Navbar.displayName = 'Navbar'

export default Navbar