# Kochi Trip Planner

A dynamic, AI-powered travel itinerary generator for Kochi, Kerala, India.

## Features

### 🌊 Intelligent Trip Planning
- **Duration-based templates**: 1-3 day itineraries with specialized focus
- **Interest-driven recommendations**: Heritage, food, culture, photography, art, nature
- **Budget-conscious planning**: ₹500-₹5000 per person per day range
- **Dietary accommodation**: Vegetarian, non-vegetarian, and vegan options
- **Transportation optimization**: Walking, public transport, private vehicle, or mixed options

### 🤖 AI-Powered Prompt Generation
- **8 Specialized Templates**: Each optimized for different travel styles and durations
- **Multi-LLM Support**: Generate itineraries with Claude, ChatGPT, or Gemini
- **Smart Template Selection**: Automatically chooses the best template based on user inputs
- **Comprehensive Context**: Includes all user preferences and requirements

### 📊 Curated Local Database
- **42+ Verified Locations**: Restaurants, attractions, heritage sites, hotels
- **Local Expertise**: Curated by Indu Ponnappan and friends
- **Real-time Stats**: Live count of available restaurants, attractions, heritage sites, and hotels
- **Authentic Recommendations**: Beyond typical tourist guides

### 🎨 User Experience
- **Mobile-Responsive Design**: Kerala-inspired color scheme and typography
- **Form Validation**: Real-time error checking and helpful messages
- **Progress Indicators**: Visual feedback on form completion
- **Local Storage**: Saves preferences for returning users
- **Copy-to-Clipboard**: Fallback for blocked popups

## Template Logic

### One Day Trips
- **First-time visitor**: Basic template focusing on must-see attractions
- **Interest-focused**: Specialized template for specific interests (food, photography, etc.)

### Two Day Trips  
- **Cultural & Culinary**: Balanced heritage and food experiences
- **Heritage & Nature**: Historic sites combined with natural beauty

### Three Day Trips
- **Comprehensive Explorer**: Complete Kochi experience covering all aspects
- **Cultural Immersion**: Deep dive into heritage, arts, and traditions

### Specialized Templates (Any Duration)
- **Food Tour**: Culinary-focused journey through Kerala cuisine
- **Photography & Art**: Visual experiences and creative spaces

## Technical Implementation

### Frontend
- **Pure HTML5/CSS3/JavaScript**: No framework dependencies
- **Responsive Grid Layouts**: Mobile-first design approach
- **CSS Custom Properties**: Kerala-inspired color theming
- **Modern JavaScript**: ES6+ features with graceful degradation

### Data Integration
- **CSV Database**: Real-time fetch from GitHub Pages hosted file
- **Client-side Processing**: No backend dependencies
- **Error Handling**: Graceful degradation when database is unavailable

### AI Integration
- **URL-based Integration**: Direct links to AI platforms with pre-filled prompts
- **Fallback Support**: Copy-to-clipboard when popup blocking occurs
- **Multiple Provider Support**: Claude, ChatGPT, and Gemini compatibility

## Database Structure

The application uses a comprehensive CSV database with the following fields:
- Location details (name, type, address, contact)
- Operational information (hours, costs, duration)
- Geographic data (latitude, longitude, Google Maps queries)
- Cultural context (significance, ratings, special notes)
- Practical details (dietary options, transportation access)

## Usage

1. **Open the Trip Planner**: Navigate to `trip-planner.html`
2. **Fill Form Sections**: 
   - Trip basics (duration, travelers, location)
   - Budget and dietary preferences
   - Interests and transportation preferences
   - Special requirements
3. **Generate Itinerary**: Choose your preferred AI assistant
4. **Review & Customize**: Use preview option to review before generation

## Files

- `trip-planner.html`: Main application interface
- `trip-planner.js`: Core functionality and prompt templates
- `kochi_comprehensive_locations_csv.txt`: Database of local recommendations
- `index.html`: Original static travel guide (preserved)

## Local Development

```bash
# Start local server
python3 -m http.server 8080

# Open in browser
http://localhost:8080/trip-planner.html
```

## Attribution

Database curated by **Indu Ponnappan and friends** - passionate local food and travel enthusiasts who have compiled authentic, verified recommendations for visitors to Kerala's Queen of the Arabian Sea.

## Browser Support

- Modern browsers (Chrome 60+, Firefox 55+, Safari 11+, Edge 79+)
- Progressive enhancement for older browsers
- Mobile-responsive design for all screen sizes

## Privacy

- No data collection or analytics
- Local storage used only for user convenience
- No server-side processing or data transmission
- Direct AI platform integration (user controls data sharing)