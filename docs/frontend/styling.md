# Frontend Styling

## 🎨 Styling System

The application uses **Tailwind CSS v4** for styling with a custom design system.

## 🎯 Tailwind CSS Configuration

### Configuration File
`tailwind.config.js` contains all Tailwind customization.

### Custom Color Palette

#### Primary Colors (Orange)
```javascript
primary: {
  50: '#fef3c7',   // Lightest
  500: '#d97706',  // Default
  900: '#451a03',  // Darkest
}
```

#### Accent Colors (Green)
```javascript
accent: {
  50: '#f0fdf4',   // Lightest
  500: '#22c55e',  // Default
  900: '#14532d',  // Darkest
}
```

### Usage
```jsx
<div className="bg-primary-500 text-white">
<div className="text-accent-600">
```

## 📱 Responsive Breakpoints

```javascript
xs: '475px'   // Extra small
sm: '640px'   // Small
md: '768px'   // Medium
lg: '1024px'  // Large
xl: '1280px'  // Extra large
2xl: '1536px' // 2X Large
```

### Usage
```jsx
<div className="text-sm md:text-lg lg:text-xl">
```

## 🎭 Custom Animations

### Available Animations
- `fade-in`: Fade in effect
- `slide-up`: Slide up from bottom
- `scale-in`: Scale in effect
- `pulse-slow`: Slow pulse animation

### Usage
```jsx
<div className="animate-fade-in">
<div className="animate-slide-up">
```

## 🎨 Custom Shadows

### Shadow Variants
- `soft`: Soft shadow
- `medium`: Medium shadow
- `large`: Large shadow
- `glow`: Glow effect (orange)
- `glow-lg`: Large glow effect

### Usage
```jsx
<div className="shadow-soft">
<div className="shadow-glow">
```

## 📐 Spacing Scale

Custom spacing values:
- `18`: 4.5rem
- `88`: 22rem
- `128`: 32rem

## 🔤 Typography

### Font Family
```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', ...]
}
```

### Font Sizes
- `xs` to `6xl` with custom line heights and letter spacing

## 🎯 Container Configuration

### Container Settings
- Centered by default
- Responsive padding
- Max width at breakpoints

## 🌓 Dark Mode

Dark mode is configured but not actively used:
```javascript
darkMode: ["class"]
```

## 📝 Styling Patterns

### Utility-First Approach
```jsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
```

### Component Classes
For repeated patterns, create component classes:
```jsx
const buttonClass = "px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600";
```

### Responsive Design
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

## 🎨 Color Usage Guidelines

### Primary (Orange)
- Buttons
- Links
- Accents
- Highlights

### Accent (Green)
- Success states
- Positive actions
- Confirmations

### Neutral Colors
- Use Tailwind's default grays
- Backgrounds: `bg-gray-50`, `bg-white`
- Text: `text-gray-900`, `text-gray-600`

## 📐 Layout Patterns

### Flexbox
```jsx
<div className="flex items-center justify-between">
```

### Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

### Container
```jsx
<div className="container mx-auto px-4">
```

## 🎭 Component Styling Examples

### Card Component
```jsx
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
```

### Button Component
```jsx
<button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
```

### Input Component
```jsx
<input className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500">
```

## 🔧 Global Styles

### `index.css`
Contains:
- Base styles
- Tailwind directives
- Custom CSS variables (if any)
- Global resets

## 📱 Mobile-First Approach

Always design for mobile first, then enhance for larger screens:

```jsx
// Mobile: 1 column, Desktop: 3 columns
<div className="grid grid-cols-1 md:grid-cols-3">
```

## 🎯 Best Practices

1. **Use Tailwind utilities** instead of custom CSS
2. **Mobile-first** responsive design
3. **Consistent spacing** using Tailwind scale
4. **Semantic colors** (primary, accent)
5. **Reusable patterns** for common components

---

**Next**: See [Libraries Documentation](./libraries.md) for dependency information.

