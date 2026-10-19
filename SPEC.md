# MedBot - Medical Education Chatbot

## Project Overview

**Project Name:** MedBot  
**Type:** Web Application (React + Vite + Node.js Backend)  
**Core Functionality:** An interactive medical education chatbot that teaches health topics through animated characters, with engaging lesson transitions  
**Target Users:** General public seeking to learn about health, medical conditions, and wellness

---

## UI/UX Specification

### Layout Structure

**Pages:**
1. Landing/Welcome Page
2. Chat/Learning Interface

**Chat Interface Layout:**
- Left sidebar: Character selection & lesson navigation
- Main area: Chat with character animations
- Right panel: Lesson progress & additional info

### Visual Design

**Color Palette:**
- Primary: `#6366F1` (Indigo)
- Secondary: `#EC4899` (Pink)
- Accent: `#10B981` (Emerald)
- Background Dark: `#0F172A`
- Background Light: `#1E293B`
- Surface: `#334155`
- Text Primary: `#F8FAFC`
- Text Secondary: `#94A3B8`
- Success: `#22C55E`
- Warning: `#F59E0B`
- Error: `#EF4444`

**Typography:**
- Headings: 'Outfit', sans-serif (Google Fonts)
- Body: 'DM Sans', sans-serif (Google Fonts)
- Character Names: 'Fredoka', sans-serif

**Spacing System:**
- Base unit: 8px
- XS: 4px, SM: 8px, MD: 16px, LG: 24px, XL: 32px, 2XL: 48px

**Visual Effects:**
- Glassmorphism cards with backdrop-blur
- Gradient borders on active elements
- Particle effects in background
- Smooth page transitions (fade + slide)
- Character animations (idle, talking, thinking)

### Components

**1. Character Avatar**
- Animated 3D-style illustrations
- States: idle (breathing), talking (lip sync), thinking (spinning)
- Name bubble on hover
- Character selection with glow effect

**2. Chat Bubble**
- User: Right-aligned, primary gradient
- Bot: Left-aligned, surface color with character avatar
- Typing animation with dots
- Message entrance: slide up + fade

**3. Lesson Cards**
- Topic icon + title + progress bar
- Hover: lift + glow
- Locked state: grayscale + lock icon

**4. Progress Indicator**
- Circular progress ring
- Percentage in center
- Animated fill on completion

**5. Navigation Pills**
- Active: gradient background
- Inactive: surface background
- Hover: slight scale + glow

---

## Functionality Specification

### Characters

1. **Dr. Maya** - Female doctor, warm and empathetic
   - Specialty: General Health, Nutrition
   - Color: Pink (#EC4899)

2. **Dr. Alex** - Male doctor, friendly and clear
   - Specialty: Anatomy, Medical Facts
   - Color: Blue (#3B82F6)

3. **Nurse Riley** - Energetic nurse, fun approach
   - Specialty: First Aid, Emergency Care
   - Color: Green (#10B981)

### Lesson Topics

**Category 1: Body Basics**
- The Heart & Circulation
- How Lungs Work
- The Digestive System
- Brain & Nervous System
- Bones & Muscles

**Category 2: Health & Wellness**
- Healthy Eating
- Exercise & Fitness
- Sleep Health
- Stress Management
- Hydration

**Category 3: First Aid & Emergencies**
- CPR Basics
- Treating Cuts & Burns
- Choking Response
- Recognizing Emergencies

**Category 4: Common Conditions**
- Cold & Flu
- Headaches
- Allergies
- Nutrition Basics

### Chat Features

1. **Character Selection** - Choose a character to learn from
2. **Topic Selection** - Browse and select lesson topics
3. **Interactive Chat**
   - Ask questions about the topic
   - Get explanations with examples
   - Quiz mode for testing knowledge
4. **Progress Tracking** - Track completed lessons
5. **Animated Transitions** - Smooth animations between lesson parts

### Backend

**Tech Stack:** Node.js + Express

**Endpoints:**
- `POST /api/chat` - Send message, get AI response
- `GET /api/lessons` - Get all available lessons
- `GET /api/lessons/:id` - Get specific lesson content
- `POST /api/progress` - Save user progress

**Medical Knowledge Base:**
- Pre-loaded medical facts and explanations
- Simple rule-based responses for common questions
- Fallback to general health advice

---

## Animations Specification

### Page Transitions
- Exit: fade out + slide left (300ms)
- Enter: fade in + slide from right (300ms)

### Character Animations
- Idle: subtle breathing (2s loop)
- Talking: mouth movement sync with text (varies)
- Thinking: question mark + spin (1s)

### Message Animations
- User message: slide from right + fade (200ms)
- Bot message: slide from left + fade (300ms)
- Typing: 3 dots pulsing (infinite)

### Lesson Transitions
- Slide between parts (400ms ease-out)
- Progress bar fill animation (600ms)
- Card flip for quiz reveal (500ms)

---

## Acceptance Criteria

1. ✅ Landing page shows character selection
2. ✅ Clicking character starts chat with that character
3. ✅ Chat displays messages with character avatar
4. ✅ Typing indicator shows while bot is "thinking"
5. ✅ Character has idle animation
6. ✅ Can select different lesson topics
7. ✅ Chat responds with medical information
8. ✅ Progress is tracked and displayed
9. ✅ All animations are smooth (60fps)
10. ✅ Fully responsive on mobile/tablet/desktop
11. ✅ Backend serves API and processes chat messages