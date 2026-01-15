# 🎨 Apple Design System - Quick Reference

## 🎯 Design Tokens

### Colors
```css
/* Light Mode */
--bg-primary: #ffffff
--text-primary: #1d1d1d
--text-secondary: #86868b
--bg-secondary: #f5f5f7
--accent: #0071e3
--success: #34c759

/* Dark Mode */
--bg-primary: #000000
--text-primary: #ffffff
--divider: rgba(255, 255, 255, 0.1)
```

### Typography
```
Temperature:  font-thin text-9xl
City:         font-light text-5xl
Label:        font-semibold text-sm
Body:         font-regular text-base
```

### Spacing
```
xs: 4px    sm: 8px   md: 12px
lg: 16px   xl: 20px  2xl: 24px
3xl: 32px  4xl: 40px 5xl: 48px
```

### Border Radius
```
sm:  4px      md:  8px
lg:  12px     xl:  20px
2xl: 28px
```

---

## 📐 Component Sizes

### Cards
```
Stat Card:      h-auto min-h-20 (flexible height)
Forecast Card:  w-16 h-24 (compact)
Large Card:     p-8 rounded-lg (generous)
```

### Typography Hierarchy
```
h1: 48px (5xl) - Page titles
h2: 34px (4xl) - Section headers
h3: 22px (2xl) - Subsections
p:  16px (base) - Body text
```

---

## 🎨 Color Usage

### Primary Actions
```tsx
<button className="bg-blue-500 hover:bg-blue-600">
  {/* Apple Blue */}
</button>
```

### Secondary Elements
```tsx
<div className="text-gray-600 dark:text-gray-400">
  {/* Gray for secondary text */}
</div>
```

### Cards & Surfaces
```tsx
<div className="bg-gray-50 dark:bg-gray-900/50">
  {/* Subtle background */}
</div>
```

---

## 🎭 Animation Timings

| Use Case | Duration | Easing |
|----------|----------|--------|
| Page transition | 0.6s | ease-out |
| Hover effect | 0.3s | ease |
| Micro-interaction | 0.2s | ease-in-out |
| Subtle pulse | 2s | ease-in-out |
| Loading spinner | 1s | linear |

---

## 📱 Responsive Breakpoints

```
Mobile:  < 640px
Tablet:  640px - 1024px
Desktop: > 1024px

Example:
<div className="text-4xl md:text-6xl lg:text-9xl">
```

---

## ♿ Accessibility Checklist

- [ ] Color contrast ≥ 4.5:1
- [ ] Focus states visible
- [ ] Keyboard navigation works
- [ ] Images have alt text
- [ ] Headings in order (h1, h2, h3)
- [ ] Form labels present
- [ ] Motion preferences respected

---

## 🧩 Component Patterns

### Simple Card
```tsx
<div className="bg-gray-50 dark:bg-gray-900/50 
  border border-gray-200 dark:border-gray-800 
  rounded-lg p-4">
  Content
</div>
```

### Hover State
```tsx
<div className="hover:bg-gray-100 dark:hover:bg-gray-800/70 
  transition-colors">
  Hoverable content
</div>
```

### Loading Skeleton
```tsx
<div className="h-4 bg-gray-200 dark:bg-gray-800 
  rounded animate-pulse"></div>
```

### Button
```tsx
<button className="px-4 py-3 bg-blue-500 
  hover:bg-blue-600 text-white rounded-lg 
  transition-colors font-medium">
  Action
</button>
```

---

## 🌓 Dark Mode Pattern

```tsx
{/* Always use dark: prefix */}
<div className="bg-white dark:bg-black 
  text-gray-900 dark:text-white 
  border border-gray-200 dark:border-gray-800">
</div>
```

---

## 🚀 Performance Tips

✓ Use gray colors instead of gradients
✓ Transition only color/opacity (GPU optimized)
✓ Use CSS animations (not JavaScript)
✓ Stagger animations with delays
✓ Keep shadows minimal
✓ Avoid blur effects on animations

---

## 📊 Typography Scale

```
12px  xs  Captions, labels
13px  sm  Small text
15px  base Body text, normal
17px  lg  Larger body
19px  xl  Small headings
22px  2xl Section headings
28px  3xl Subsection titles
34px  4xl Page sections
48px  5xl Main headings
```

---

## 🎯 Quick Imports

```tsx
import { Sparkles, Wind, Droplets, Sun, Eye } from 'lucide-react';

// Use with consistent sizes
<Wind className="w-5 h-5 text-gray-700 dark:text-gray-300" />
```

---

## 🔐 Safe Color Combinations

| Text | Background | Contrast | Use |
|------|-----------|----------|-----|
| Black | White | 21:1 | ✓ Excellent |
| White | Black | 21:1 | ✓ Excellent |
| Gray-900 | Gray-50 | 12.6:1 | ✓ Good |
| Gray-600 | White | 7.5:1 | ✓ Good |
| Blue-600 | White | 8.59:1 | ✓ Good |

---

## 💡 Design Decisions

### Why No Gradients?
- Cleaner appearance
- Faster rendering
- More professional
- Better accessibility

### Why System Fonts?
- Already on device
- Optimal rendering
- Faster loading
- Native feel

### Why Subtle Shadows?
- Depth without distraction
- Professional appearance
- Better readability
- Apple standard

### Why Staggered Animations?
- Less jarring
- More elegant
- Better UX
- Premium feel

---

## 🎓 Key Principles

1. **Less is More** - Remove what's not needed
2. **Consistency** - Use design tokens everywhere
3. **Clarity** - Text should be easy to read
4. **Simplicity** - Simple interactions, complex backend
5. **Accessibility** - Works for everyone
6. **Performance** - Animations don't stutter

---

## 📚 Resources

- [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [Web Accessibility](https://www.w3.org/WAI/)

---

**Design system documented. Ready to extend. ✨**
