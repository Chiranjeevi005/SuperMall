# Super Mall Design System - Rural Theme

## Overview
This document outlines the design system for the Super Mall Web Application with a rural-themed design. The theme evokes the feeling of countryside markets, farms, and rural communities while maintaining a modern and professional aesthetic. The design system ensures consistency across all UI components and provides guidelines for maintaining a cohesive user experience.

## Color Palette - Rural Theme

### Primary Colors
- **Green** (Primary): `#22c55e` - Represents farmland and nature
- **Amber** (Secondary): `#f59e0b` - Represents wheat fields and warmth

### Neutral Colors
- **Cream**: `#fdfdfc` - Backgrounds and subtle elements
- **Gray 900**: `#171717` - Primary text
- **Gray 50**: `#fafafa` - Subtle backgrounds
- **Gray 200**: `#e5e5e5` - Borders and dividers

### Accent Colors
- **Sky Blue**: `#7dd3fc` - Represents rural skies
- **Rustic Red**: `#f87171` - Represents barns and berries
- **Forest Green**: `#10b981` - Represents forests
- **Clay Brown**: `#d97706` - Represents soil

### Rural-Specific Colors
- **Wheat**: `#f5d49e` - For agricultural elements
- **Barn Red**: `#b91c1c` - For traditional rural buildings
- **Sage**: `#a8a29e` - For natural, earthy elements
- **Grass Green**: `#4ade80` - For fresh, natural elements

## Typography

### Font Family
- **Primary**: Geist Sans (fallback to system UI fonts)
- **Monospace**: Geist Mono (fallback to system monospace fonts)

### Font Sizes
- **XS**: 0.75rem (12px)
- **SM**: 0.875rem (14px)
- **Base**: 1rem (16px)
- **LG**: 1.125rem (18px)
- **XL**: 1.25rem (20px)
- **2XL**: 1.5rem (24px)
- **3XL**: 1.875rem (30px)
- **4XL**: 2.25rem (36px)
- **5XL**: 3rem (48px)

### Font Weights
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700
- **Extrabold**: 800

## Spacing System
- **XS**: 0.25rem (4px)
- **SM**: 0.5rem (8px)
- **MD**: 1rem (16px)
- **LG**: 1.5rem (24px)
- **XL**: 2rem (32px)
- **2XL**: 3rem (48px)
- **3XL**: 4rem (64px)

## Component Library - Rural Theme

### 1. Header
- **Cream Background**: Warm, inviting cream background
- **Rural Logo**: Barn icon with "SuperMall" text
- **Navigation**: Green accent for active states
- **Search Bar**: Amber-themed search input
- **Responsive Design**: Mobile-friendly hamburger menu

### 2. Footer
- **Cream Background**: Consistent with header
- **Four-Column Layout**: Brand info, navigation, support, contact
- **Social Media Links**: Amber and green themed
- **Rural Aesthetic**: Warm, welcoming design

### 3. Cards
All cards follow a consistent rural design pattern:
- **Rounded Corners**: 0.75rem border radius
- **Subtle Shadows**: Light shadows with hover effects
- **Smooth Transitions**: 300ms animations
- **Hover Effects**: Lift and shadow enhancement

#### Shop Card
- **Location Information**: Floor and section details
- **Category Tags**: Amber badges representing different shop types
- **Call-to-Action**: "View Shop" button with green background
- **Rural Icon**: Farm/barn icon representing shops

#### Store Card
- **Category Tags**: Prominent category display with amber background
- **Location Information**: Floor and section details
- **Ratings**: Star rating system for store quality
- **Call-to-Action**: "View Shop" button with green gradient
- **Rural Aesthetic**: Earthy tones and natural imagery

#### Product Card
- **Price Display**: Prominent pricing badge with green gradient
- **Image Placeholder**: Green-to-amber gradient when no image
- **Wishlist Button**: Heart icon with amber color
- **Rural Products**: Icons representing farm goods

#### Offer Card
- **Discount Badge**: Visual discount percentage/amount with amber gradient
- **Progress Bar**: Time remaining indicator in amber
- **Shop Information**: Associated shop name
- **Rural Theme**: Farm-themed decorative elements

#### Category Card
- **Icon Representation**: SVG icons for each category with rural themes
- **Product Count**: Number of items in category
- **Color Coding**: Unique light gradient per category (farm, food, crafts, etc.)
- **Rural Categories**: Special icons for farm, food, and crafts categories

### 4. Hero Section
- **Cream-to-Green Gradient Background**: Warm, natural gradient
- **Decorative Elements**: Blurred circles in green and amber
- **Dual-Column Layout**: Text and visual representation
- **Primary Actions**: "Explore Shops" (green) and "View Offers" (amber) buttons
- **Rural Imagery**: Icons representing farm products, crafts, and food

### 5. Loading Skeletons
- **Animated Pulse**: Smooth loading indicators in amber
- **Consistent Structure**: Matches card layouts
- **Performance Optimized**: Minimal DOM impact

## Dark Mode Implementation
- **Automatic Detection**: Uses system preference by default
- **User Override**: Toggle button in header
- **Persistent Setting**: Remembers user preference
- **Smooth Transitions**: 300ms color transitions

## Responsive Design
- **Mobile-First Approach**: Base styles for mobile
- **Breakpoints**:
  - **SM**: 640px
  - **MD**: 768px
  - **LG**: 1024px
  - **XL**: 1280px
  - **2XL**: 1536px
- **Flexible Grids**: Auto-fill grid columns
- **Adaptive Components**: Stack on mobile, spread on desktop

## Animations & Transitions
- **Hover Effects**: Subtle transformations on interactive elements
- **Loading States**: Pulse animations for skeleton screens
- **Mode Switching**: Smooth color transitions
- **Navigation**: Slide animations for mobile menu

## Accessibility
- **Color Contrast**: WCAG 2.1 compliant color combinations
- **Focus States**: Visible focus rings for keyboard navigation
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Descriptive labels for interactive elements

## Performance Considerations
- **Optimized Assets**: SVG icons instead of icon fonts
- **Efficient Animations**: CSS transitions over JavaScript where possible
- **Code Splitting**: Component-based loading
- **Lazy Loading**: Deferred loading for non-critical resources

## Implementation Guidelines
1. **Consistency**: Always use the design system tokens
2. **Responsive First**: Design for mobile, then scale up
3. **Accessibility**: Ensure all components are keyboard navigable
4. **Performance**: Minimize re-renders and optimize assets
5. **Testing**: Verify components in both light and dark modes