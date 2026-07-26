import { useEffect, useRef, useState, useCallback } from "react"
import { flushSync } from "react-dom"
import { Moon, Sun } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

type AnimatedThemeTogglerProps = {
  className?: string
}

export const AnimatedThemeToggler = ({ className }: AnimatedThemeTogglerProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [darkMode, setDarkMode] = useState(() =>
    typeof window !== "undefined"
      ? !document.documentElement.classList.contains("light")
      : true
  )

  useEffect(() => {
    const syncTheme = () =>
      setDarkMode(!document.documentElement.classList.contains("light"))

    const observer = new MutationObserver(syncTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  const onToggle = useCallback(async () => {
    if (!buttonRef.current) return

    // View Transition API may not be supported everywhere
    const supportsVT = "startViewTransition" in document

    if (supportsVT) {
      await document.startViewTransition(() => {
        flushSync(() => {
          const toggled = !darkMode
          setDarkMode(toggled)
          document.documentElement.classList.toggle("light", !toggled)
          localStorage.setItem("bylance-theme", toggled ? "dark" : "light")
        })
      }).ready

      const { left, top, width, height } =
        buttonRef.current.getBoundingClientRect()
      const centerX = left + width / 2
      const centerY = top + height / 2
      const maxDistance = Math.hypot(
        Math.max(centerX, window.innerWidth - centerX),
        Math.max(centerY, window.innerHeight - centerY)
      )

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${centerX}px ${centerY}px)`,
            `circle(${maxDistance}px at ${centerX}px ${centerY}px)`,
          ],
        },
        {
          duration: 700,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    } else {
      const toggled = !darkMode
      setDarkMode(toggled)
      document.documentElement.classList.toggle("light", !toggled)
      localStorage.setItem("bylance-theme", toggled ? "dark" : "light")
    }
  }, [darkMode])

  return (
    <button
      ref={buttonRef}
      onClick={onToggle}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "flex items-center justify-center w-12 h-12 rounded-full outline-none focus:outline-none active:outline-none focus:ring-0 cursor-pointer",
        "bg-white/8 border border-white/12 backdrop-blur-sm",
        "hover:bg-white/14 hover:border-white/20 transition-all duration-200",
        "shadow-lg",
        className
      )}
      type="button"
    >
      <AnimatePresence mode="wait" initial={false}>
        {darkMode ? (
          <motion.span
            key="sun-icon"
            initial={{ opacity: 0, scale: 0.55, rotate: 25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.55 }}
            transition={{ duration: 0.28 }}
            className="text-white/80 flex items-center justify-center"
          >
            <Sun size={20} />
          </motion.span>
        ) : (
          <motion.span
            key="moon-icon"
            initial={{ opacity: 0, scale: 0.55, rotate: -25 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.55 }}
            transition={{ duration: 0.28 }}
            className="text-white/80 flex items-center justify-center"
          >
            <Moon size={20} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
