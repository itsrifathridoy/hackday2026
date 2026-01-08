# Whisper - Wordless Social Media

A wordless social media platform built with Next.js, where users share emotions instead of text through moods, colors, animations, drawings, and music.

## Features

- **Wordless Communication**: Express yourself through moods, colors, and drawings
- **Mood-Based Themes**: Each mood has unique colors and animations
  - 😊 Happy - Bright yellow with floating animation
  - 😢 Sad - Deep blue with slow fade
  - 😌 Calm - Green with smooth wave
  - 😡 Angry - Red with shake animation
  - 🌈 Excited - Purple with fast pulse
  - 😴 Tired - Gray with slow pulse
- **Canvas Drawing**: Free-form drawing tool for visual expression
- **Reaction System**: Emoji-only reactions (❤️ 😌 😢 😡 🌈)
- **Feed Filters**: Filter by mood and sort by latest/trending
- **Full Mock Data**: No backend required - everything runs on mock data

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS** - Styling and animations
- **Howler.js** - Audio playback (mocked for demo)
- **HTML5 Canvas** - Drawing functionality
- **TypeScript** - Type safety

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── create/          # Create Whisper page
│   ├── view/[id]/       # View single Whisper page
│   ├── lib/             # Mock data and utilities
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home/Feed page
├── components/
│   ├── CanvasBoard.tsx  # Drawing canvas component
│   ├── FeedWhisperCard.tsx  # Feed card component
│   ├── MoodPicker.tsx   # Mood selection component
│   ├── ReactionBar.tsx  # Reaction buttons
│   ├── SoundPlayer.tsx  # Audio player
│   └── ThemeWrapper.tsx # Mood-based theme wrapper
└── ...
```

## Usage

### View Feed
- Browse whispers on the home page
- Filter by mood using the filter buttons
- Sort by "Latest" or "Trending"
- Click on any whisper to view full-screen

### Create Whisper
1. Click the ✨ button in the header
2. **Step 1**: Select your mood
3. **Step 2**: Draw on the canvas (optional)
4. **Step 3**: Preview and publish
5. Your whisper appears in the feed!

### View Whisper
- Full-screen mood-based theme
- View drawing
- React with emojis
- Toggle sound (mocked in demo)

## Mock Data

All data is stored in memory using mock functions in `app/lib/mockData.ts`. Data will reset on page refresh.

## Notes

- **No Backend**: This is a frontend-only demo
- **No Authentication**: Anyone can create whispers
- **No Persistence**: Data resets on page refresh
- **Sound**: Audio functionality is mocked (no actual sound files)

## Development

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Customization

### Add New Moods
1. Add mood type to `app/lib/mockData.ts`
2. Add config to `app/lib/moodConfig.ts`
3. Add CSS classes to `app/globals.css`

### Modify Animations
Edit keyframes in `tailwind.config.js` and CSS classes in `app/globals.css`

---

Built with ❤️ using Next.js and Tailwind CSS