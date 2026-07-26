import { useEffect, useRef, useState, useCallback } from "react"
import { flushSync } from "react-dom"

type AnimatedThemeTogglerProps = {
  className?: string
}

export const AnimatedThemeToggler = ({ className }: AnimatedThemeTogglerProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [darkMode, setDarkMode] = useState(true)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("bylance-theme")
    if (saved === "light") {
      setDarkMode(false)
      document.documentElement.classList.add("light")
    }
  }, [])

  const onToggle = useCallback(async () => {
    if (animating || !buttonRef.current) return
    setAnimating(true)

    const toggled = !darkMode
    const supportsVT = "startViewTransition" in document

    if (supportsVT) {
      const { left, top, width, height } = buttonRef.current.getBoundingClientRect()
      const centerX = left + width / 2
      const centerY = top + height / 2
      const maxDist = Math.hypot(
        Math.max(centerX, window.innerWidth - centerX),
        Math.max(centerY, window.innerHeight - centerY)
      )

      const transition = (document as Document & {
        startViewTransition: (cb: () => void) => { ready: Promise<void> }
      }).startViewTransition(() => {
        flushSync(() => {
          setDarkMode(toggled)
          document.documentElement.classList.toggle("light", !toggled)
          localStorage.setItem("bylance-theme", toggled ? "dark" : "light")
        })
      })

      await transition.ready

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${centerX}px ${centerY}px)`,
            `circle(${maxDist}px at ${centerX}px ${centerY}px)`,
          ],
        },
        {
          duration: 700,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    } else {
      setDarkMode(toggled)
      document.documentElement.classList.toggle("light", !toggled)
      localStorage.setItem("bylance-theme", toggled ? "dark" : "light")
    }

    setTimeout(() => setAnimating(false), 750)
  }, [darkMode, animating])

  return (
    <button
      ref={buttonRef}
      onClick={onToggle}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      type="button"
      className={`theme-fab ${className ?? ""}`}
    >
      {/* Sun icon — shown in dark mode so you can switch to light */}
      <span
        className="theme-fab__icon"
        style={{
          opacity: darkMode ? 1 : 0,
          transform: darkMode ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(45deg)",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <line x1="12" y1="2" x2="12" y2="4"/>
          <line x1="12" y1="20" x2="12" y2="22"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="2" y1="12" x2="4" y2="12"/>
          <line x1="20" y1="12" x2="22" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      </span>

      {/* Moon icon — shown in light mode so you can switch back to dark */}
      <span
        className="theme-fab__icon"
        style={{
          opacity: darkMode ? 0 : 1,
          transform: darkMode ? "scale(0.5) rotate(-45deg)" : "scale(1) rotate(0deg)",
          position: "absolute",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </span>
    </button>
  )
}
