// Kochi Trip Planner JavaScript
// Curated by Indu Ponnappan and friends

// CSV Database URL
const CSV_DATABASE_URL = 'https://devasur.github.io/kochi-trip/kochi_comprehensive_locations_csv.txt';

// Global variables
let csvData = [];
let currentFormData = {};
let generatedPrompt = '';

// Prompt Templates - 8 different templates based on user preferences
const PROMPT_TEMPLATES = {
    // Template 1: One Day - First-time visitor
    oneDayFirstTime: {
        title: "One Day Kochi Explorer (First-time Visitor)",
        template: `You are a local Kochi expert helping create a perfect one-day itinerary for first-time visitors.

**Trip Details:**
- Duration: 1 day
- Travelers: {travelers} people
- Base location: {baseLocation}
- Budget: {budget} per person
- Dietary preference: {diet}
- Transportation: {transport}
{alcoholPreference}
{specialRequirements}

**Primary Focus:** Essential Kochi highlights for first-time visitors including iconic Chinese Fishing Nets, heritage sites, and authentic Kerala cuisine.

**Database Reference:**
Use this comprehensive local database for all recommendations: ${CSV_DATABASE_URL}

**Requirements:**
1. Create a detailed hour-by-hour itinerary
2. Include breakfast, lunch, dinner, and snack recommendations from the database
3. Feature must-see attractions: Chinese Fishing Nets, St. Francis Church, and at least one heritage site
4. Suggest authentic Kerala cuisine experiences
5. Include transportation details between locations
6. For each location, provide:
   - Exact name as listed in database
   - Operating hours
   - Estimated duration of visit
   - Google Maps search query using: "[Location_Name] [Address/Area]"
   - Estimated costs
   - Why it's special for first-time visitors

**Focus on:** Heritage sites, iconic photography spots, authentic local food, cultural immersion.

Please create a practical, time-efficient itinerary that captures the essence of Kochi in one day!`
    },

    // Template 2: One Day - Area-focused with specific interests
    oneDayFocused: {
        title: "One Day Kochi Deep Dive",
        template: `Create a focused one-day Kochi itinerary tailored to specific interests.

**Trip Details:**
- Duration: 1 day
- Travelers: {travelers} people
- Base location: {baseLocation}
- Budget: {budget} per person
- Dietary preference: {diet}
- Transportation: {transport}
- Primary interests: {interests}
{alcoholPreference}
{specialRequirements}

**Database Reference:**
Use this comprehensive local database: ${CSV_DATABASE_URL}

**Approach:** Design a specialized day around the selected interests while maintaining practical logistics.

**Requirements:**
1. Tailor the itinerary heavily toward the selected interests
2. Include 4-5 locations maximum to allow deep exploration
3. Build in buffer time for spontaneous discoveries
4. Recommend restaurants that align with interests (e.g., heritage restaurants for heritage lovers)
5. Include interest-specific photography opportunities
6. For each recommendation:
   - Name exactly as in database
   - Why it matches their interests
   - Google Maps query: "[Location_Name] [Address]"
   - Insider tips for enthusiasts
   - Time to spend based on interest level

**Interest-Specific Focus:**
- Heritage lovers: Multiple historical sites with detailed cultural context
- Food enthusiasts: Restaurant hopping with diverse cuisines and cooking styles
- Photography fans: Golden hour spots, architectural details, street photography
- Art lovers: Galleries, street art, cultural centers

Create an immersive, interest-driven experience!`
    },

    // Template 3: Two Days - Cultural & Culinary Balance
    twoDayCultural: {
        title: "Two Day Kochi: Culture & Cuisine",
        template: `Design a balanced two-day Kochi experience emphasizing cultural immersion and culinary exploration.

**Trip Details:**
- Duration: 2 days
- Travelers: {travelers} people
- Base location: {baseLocation}
- Budget: {budget} per person per day
- Dietary preference: {diet}
- Transportation: {transport}
- Interests: {interests}
{alcoholPreference}
{specialRequirements}

**Database Reference:**
Comprehensive database: ${CSV_DATABASE_URL}

**Day Structure:**
- **Day 1:** Heritage & Traditional Culture
- **Day 2:** Modern Kochi & Culinary Adventures

**Requirements:**
1. Balance cultural sites with food experiences each day
2. Include both traditional and contemporary aspects of Kochi
3. Feature the Water Metro experience (India's first!)
4. Mix of heritage sites, local markets, and dining experiences
5. Include at least one cultural performance or traditional craft experience
6. Progressive budget allocation - lighter first day, special experiences second day

**Cultural Elements to Include:**
- Kathakali performance or traditional arts
- Heritage walks through Fort Kochi and Mattancherry
- Local markets and spice trading history
- Portuguese, Dutch, and British colonial influences
- Jewish quarter exploration

**Culinary Journey:**
- Traditional Kerala meals (fish curry, appam, stew)
- Street food experiences
- Spice market education
- Traditional toddy shop if alcohol preference selected
- Award-winning restaurants from database

For each location provide:
- Database location name
- Cultural/historical significance
- Culinary specialties
- Google Maps query format
- Best visiting times
- Cultural etiquette tips

Create a rich, authentic Kochi immersion!`
    },

    // Template 4: Two Days - Heritage & Nature
    twoDayHeritage: {
        title: "Two Day Kochi: Heritage & Natural Beauty",
        template: `Create a comprehensive two-day itinerary combining Kochi's rich heritage with its natural beauty.

**Trip Details:**
- Duration: 2 days
- Travelers: {travelers} people
- Base location: {baseLocation}
- Budget: {budget} per person per day
- Dietary preference: {diet}
- Transportation: {transport}
- Interests: {interests}
{alcoholPreference}
{specialRequirements}

**Database Reference:**
Use this local database: ${CSV_DATABASE_URL}

**Theme Balance:**
- **Day 1:** Historic Fort Kochi & Mattancherry heritage
- **Day 2:** Natural experiences & modern attractions

**Heritage Focus:**
- Portuguese, Dutch, British colonial architecture
- Ancient spice trading routes
- Religious diversity (churches, synagogue, temples)
- Traditional fishing methods (Chinese nets)
- Palace architecture and royal history

**Nature & Modern Elements:**
- Marine Drive waterfront experience
- Water Metro (sustainable transport)
- Backwater glimpses
- Island hopping if time permits
- Modern Kerala cuisine evolution

**Daily Structure:**
Each day should include:
- Morning heritage/nature exploration
- Traditional lunch experience
- Afternoon cultural activities
- Evening relaxation with sunset/water views
- Dinner highlighting regional specialties

**Requirements:**
1. Include minimum 3 heritage sites and 2 nature experiences
2. Feature both traditional and contemporary dining
3. Use Water Metro for authentic local transport
4. Balance indoor and outdoor activities
5. Include photography opportunities at golden hour
6. Provide historical context for all heritage sites

For every recommendation:
- Exact database name and location
- Historical significance or natural feature
- Best visiting time and duration
- Google Maps search: "[Location] [Area] Kochi"
- Weather considerations
- Photography tips

Design a perfect blend of history and natural beauty!`
    },

    // Template 5: Three Days - Comprehensive Explorer
    threeDayComprehensive: {
        title: "Three Day Complete Kochi Explorer",
        template: `Create the ultimate three-day comprehensive Kochi experience covering all major aspects of the city.

**Trip Details:**
- Duration: 3 days
- Travelers: {travelers} people
- Base location: {baseLocation}
- Budget: {budget} per person per day
- Dietary preference: {diet}
- Transportation: {transport}
- Interests: {interests}
{alcoholPreference}
{specialRequirements}

**Database Reference:**
Complete database: ${CSV_DATABASE_URL}

**Three-Day Structure:**
- **Day 1:** Historic Heart (Fort Kochi & Mattancherry)
- **Day 2:** Cultural Immersion & Modern Kochi
- **Day 3:** Local Experiences & Hidden Gems

**Comprehensive Coverage:**
- All major heritage sites and museums
- Traditional and contemporary dining experiences
- Cultural performances and art scenes
- Local transportation modes (Metro, Water Metro, Ferry)
- Shopping and local markets
- Religious and spiritual sites
- Natural beauty and waterfront experiences
- Local neighborhoods and authentic interactions

**Daily Themes:**
**Day 1 - Heritage Foundation:**
Historic sites, colonial architecture, traditional cuisine, sunset at Chinese Fishing Nets

**Day 2 - Cultural Deep Dive:**
Museums, art galleries, cultural performances, modern Kerala cuisine, local transport experience

**Day 3 - Authentic Local Life:**
Hidden neighborhood gems, local markets, artisan workshops, lesser-known eateries, farewell experience

**Requirements:**
1. Include 8-10 locations per day with proper timing
2. Mix of must-see attractions and off-the-beaten-path experiences
3. Progressive difficulty - easy first day, more adventurous by day three
4. Include all transportation modes available
5. Feature restaurants across all budget levels from database
6. Build in flexibility for weather or personal preferences
7. Include shopping opportunities for authentic local products
8. Provide cultural context and local customs
9. Suggest photography opportunities throughout

**Special Experiences:**
- Water Metro journey with route details
- Traditional Kerala cooking or spice tour if available
- Heritage walk with local guide
- Sunset viewing from multiple vantage points
- Local festival or cultural event if timing aligns

For each recommendation provide:
- Database location name and category
- Why it's included in comprehensive experience
- Time allocation and best visiting hours
- Google Maps query format
- Estimated costs and booking requirements
- Local customs or etiquette
- Connection to other nearby attractions

Create the definitive Kochi experience that covers everything!`
    },

    // Template 6: Three Days - Cultural Immersion
    threeDayCultural: {
        title: "Three Day Kochi Cultural Immersion",
        template: `Design an intensive three-day cultural immersion program focusing on Kochi's diverse heritage, arts, and traditions.

**Trip Details:**
- Duration: 3 days
- Travelers: {travelers} people
- Base location: {baseLocation}
- Budget: {budget} per person per day
- Dietary preference: {diet}
- Transportation: {transport}
- Primary focus: Cultural Activities and Heritage
{alcoholPreference}
{specialRequirements}

**Database Reference:**
Cultural locations database: ${CSV_DATABASE_URL}

**Cultural Immersion Framework:**
- **Day 1:** Colonial Heritage & Religious Diversity
- **Day 2:** Traditional Arts & Local Customs
- **Day 3:** Modern Culture & Community Interactions

**Deep Cultural Elements:**
- Multiple religious site visits with cultural context
- Traditional performance arts (Kathakali, Mohiniyattam)
- Heritage architecture spanning centuries
- Spice trading history and merchant communities
- Art galleries and contemporary cultural spaces
- Traditional craft demonstrations
- Local festival participation if available
- Community interaction opportunities

**Authentic Experiences:**
- Heritage walks with cultural historians
- Traditional meal experiences with local families if possible
- Artisan workshop visits
- Cultural center performances
- Local market interactions with vendors
- Traditional transport modes and their significance
- Religious ceremony observation (respectfully)

**Educational Components:**
Each cultural site should include:
- Historical timeline and significance
- Cultural practices and traditions
- Architectural styles and influences
- Social and religious importance
- Modern relevance and preservation efforts
- Photography etiquette and restrictions
- Appropriate dress codes and behavior

**Requirements:**
1. Prioritize cultural sites and experiences from database
2. Include interactions with local cultural practitioners
3. Balance ancient traditions with modern cultural evolution
4. Provide detailed cultural context for each location
5. Include appropriate traditional dining experiences
6. Suggest respectful observation and participation guidelines
7. Include cultural performance schedules and booking info
8. Provide language tips for basic interactions

**Cultural Learning Objectives:**
By end of trip, travelers should understand:
- Kochi's role in historical spice trade
- Religious harmony and diversity
- Colonial influence on local culture
- Traditional arts and their modern relevance
- Local customs and social practices
- Culinary traditions and regional variations

For each cultural location:
- Database name and cultural category
- Cultural significance and history
- Respectful visiting guidelines
- Google Maps search query
- Best times for cultural activities
- Local customs to observe
- Photography permissions
- Nearby complementary cultural sites

Create an authentic, respectful, and educational cultural journey!`
    },

    // Template 7: Food-Focused Tour (any duration)
    foodTour: {
        title: "Kochi Culinary Adventure",
        template: `Create a food-focused Kochi itinerary that takes travelers on a comprehensive culinary journey through authentic Kerala cuisine.

**Trip Details:**
- Duration: {duration} day(s)
- Travelers: {travelers} people
- Base location: {baseLocation}
- Budget: {budget} per person per day
- Dietary preference: {diet}
- Transportation: {transport}
- **PRIMARY FOCUS: Food Experiences**
{alcoholPreference}
{specialRequirements}

**Database Reference:**
Restaurant and food database: ${CSV_DATABASE_URL}

**Culinary Journey Theme:**
Design each day around different aspects of Kerala cuisine, from traditional home-style cooking to contemporary interpretations, street food to fine dining.

**Food Experience Categories:**
- **Traditional Kerala Meals:** Authentic fish curry, appam, stew, traditional thali
- **Street Food Adventures:** Local snacks, tea shops, market treats
- **Specialty Restaurants:** Award-winning establishments and local favorites
- **Cultural Food Experiences:** Spice tours, traditional cooking methods
- **Modern Kerala Cuisine:** Contemporary interpretations of classic dishes
{alcoholComponent}

**Daily Food Structure:**
- **Breakfast:** Traditional Kerala breakfast spots
- **Mid-morning:** Spice markets and ingredient exploration
- **Lunch:** Authentic local restaurants with regional specialties
- **Afternoon:** Street food or local snacks
- **Dinner:** Premium dining experiences or traditional family-style meals
- **Evening:** Local tea/coffee culture or dessert spots

**Requirements:**
1. Feature restaurants across all budget levels from database
2. Include diverse cuisine types while emphasizing Kerala specialties
3. Provide detailed dish recommendations and ingredients
4. Include spice market visits with educational components
5. Balance traditional and modern dining experiences
6. Include dietary restriction alternatives
7. Provide food photography opportunities
8. Include cooking classes or food tours if available

**Culinary Education:**
- Kerala spice history and trading significance
- Traditional cooking methods and equipment
- Seasonal ingredients and their uses
- Regional variations within Kerala cuisine
- Food customs and dining etiquette
- Health benefits of traditional ingredients
- Sustainable and local sourcing practices

**Food Safety & Practical Tips:**
- Best practices for street food selection
- Peak dining hours and reservation requirements
- Payment methods accepted
- Spice tolerance recommendations
- Hydration and digestion tips
- Local food customs and table manners

For each restaurant/food experience:
- Exact database name and location
- Signature dishes and specialties
- Price range and value assessment
- Google Maps query format
- Operating hours and best visit times
- Reservation requirements
- Dietary accommodation availability
- Why it's special for food enthusiasts
- Nearby complementary food experiences

**Special Food Experiences:**
- Traditional toddy shop experience (if alcohol selected)
- Spice plantation or market tours
- Local cooking demonstrations
- Traditional feast experiences
- Specialty ingredient shopping

Create the ultimate Kerala culinary adventure!`
    },

    // Template 8: Photography & Art Focus (any duration)
    photographyArt: {
        title: "Kochi Photography & Art Explorer",
        template: `Design a photography and art-focused Kochi itinerary that showcases the city's visual beauty, artistic heritage, and contemporary creative scene.

**Trip Details:**
- Duration: {duration} day(s)
- Travelers: {travelers} people
- Base location: {baseLocation}
- Budget: {budget} per person per day
- Dietary preference: {diet}
- Transportation: {transport}
- **PRIMARY FOCUS: Photography & Art Scene**
{alcoholPreference}
{specialRequirements}

**Database Reference:**
Locations and venues database: ${CSV_DATABASE_URL}

**Visual Journey Framework:**
- **Golden Hour Locations:** Sunrise and sunset photography spots
- **Architectural Photography:** Colonial buildings, traditional structures, modern design
- **Cultural Art Venues:** Galleries, art centers, performance spaces
- **Street Photography:** Local life, markets, authentic cultural moments
- **Historical Art:** Murals, traditional crafts, religious art
- **Contemporary Scene:** Modern galleries, street art, creative spaces

**Photography Themes:**
- **Heritage Architecture:** Portuguese, Dutch, British colonial influences
- **Traditional Life:** Fishing nets, local markets, street vendors
- **Religious Diversity:** Churches, synagogues, temples, mosques
- **Water & Maritime:** Backwaters, ferries, traditional boats
- **Cultural Performances:** Kathakali, traditional arts, festivals
- **Modern Kerala:** Contemporary architecture, urban development

**Art & Creative Spaces:**
- Traditional art forms and their modern interpretations
- Local artisan workshops and demonstrations
- Contemporary galleries and exhibition spaces
- Cultural centers and performance venues
- Street art and public installations
- Craft markets and artistic shopping

**Photography Schedule Optimization:**
- **Golden Hour (Sunrise):** Chinese Fishing Nets, waterfront locations
- **Morning Light:** Architectural photography, heritage sites
- **Midday:** Indoor venues, galleries, museums, market photography
- **Afternoon:** Street photography, cultural activities
- **Golden Hour (Sunset):** Marine Drive, elevated viewpoints
- **Evening:** Cultural performances, lit architecture

**Technical Considerations:**
- Best lighting conditions for each location
- Photography permissions and restrictions
- Cultural sensitivity guidelines for people photography
- Equipment recommendations for different venues
- Weather considerations and backup indoor locations
- Crowd patterns and optimal visiting times

**Requirements:**
1. Include diverse photography opportunities from database locations
2. Provide specific timing for optimal lighting conditions
3. Include both famous spots and hidden photographic gems
4. Balance iconic shots with authentic local moments
5. Include art venues and cultural spaces
6. Provide cultural context for artistic traditions
7. Suggest photography etiquette and permissions
8. Include locations for equipment needs or repairs

**Creative Learning Opportunities:**
- Traditional art techniques and their practitioners
- Historical significance of artistic traditions
- Modern art movement in Kerala
- Photography workshops or guided tours if available
- Artist studio visits or demonstrations
- Cultural context of artistic expressions

For each photography/art location:
- Database name and artistic significance
- Best photography times and lighting conditions
- Artistic or architectural highlights to capture
- Google Maps query for exact positioning
- Photography permissions and restrictions
- Cultural considerations for respectful photography
- Nearby artistic attractions or complementary shots
- Equipment recommendations for venue type

**Art & Cultural Venues:**
- Gallery operating hours and exhibition information
- Artist workshop schedules and demonstration times
- Cultural performance timing and ticket information
- Traditional craft centers and purchase opportunities
- Contemporary art spaces and local artist communities

Create a visually stunning and culturally rich artistic journey!`
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadPreferences();
    fetchCSVData();
});

// Initialize application
function initializeApp() {
    // Budget slider functionality
    const budgetSlider = document.getElementById('budget');
    const budgetValue = document.getElementById('budgetValue');
    
    budgetSlider.addEventListener('input', function() {
        budgetValue.textContent = '₹' + parseInt(this.value).toLocaleString();
        updateProgress();
    });
    
    // Form change listeners
    const form = document.getElementById('tripPlannerForm');
    form.addEventListener('change', function(e) {
        updateProgress();
        updateSelectionStyles();
    });
    form.addEventListener('input', updateProgress);
    
    // Initialize selection styles
    updateSelectionStyles();
    
    // Initialize progress
    updateProgress();
}

// Fetch and parse CSV data
async function fetchCSVData() {
    try {
        const response = await fetch(CSV_DATABASE_URL);
        const csvText = await response.text();
        csvData = parseCSV(csvText);
        updateStats();
    } catch (error) {
        console.error('Error fetching CSV data:', error);
        showError('Unable to load location database. Some features may be limited.');
    }
}

// Parse CSV data
function parseCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = lines[i].split(',');
            const row = {};
            headers.forEach((header, index) => {
                row[header.trim()] = values[index] ? values[index].trim() : '';
            });
            data.push(row);
        }
    }
    return data;
}

// Update statistics display
function updateStats() {
    if (csvData.length === 0) return;
    
    const stats = {
        restaurants: csvData.filter(item => 
            item.Location_Type && (
                item.Location_Type.toLowerCase().includes('restaurant') ||
                item.Location_Type.toLowerCase().includes('cafe')
            )
        ).length,
        attractions: csvData.filter(item => 
            item.Location_Type && (
                item.Location_Type.toLowerCase().includes('attraction') ||
                item.Location_Type.toLowerCase().includes('beach') ||
                item.Location_Type.toLowerCase().includes('museum')
            )
        ).length,
        heritage: csvData.filter(item => 
            item.Location_Type && (
                item.Location_Type.toLowerCase().includes('heritage') ||
                item.Location_Type.toLowerCase().includes('church') ||
                item.Location_Type.toLowerCase().includes('palace') ||
                item.Location_Type.toLowerCase().includes('synagogue')
            )
        ).length,
        hotels: csvData.filter(item => 
            item.Location_Type && (
                item.Location_Type.toLowerCase().includes('hotel') ||
                item.Location_Type.toLowerCase().includes('accommodation')
            )
        ).length
    };
    
    document.getElementById('restaurantCount').textContent = stats.restaurants;
    document.getElementById('attractionCount').textContent = stats.attractions;
    document.getElementById('heritageCount').textContent = stats.heritage;
    document.getElementById('hotelCount').textContent = stats.hotels;
}

// Update selection styles for radio buttons and checkboxes (fallback for older browsers)
function updateSelectionStyles() {
    // Handle radio buttons
    document.querySelectorAll('.radio-item').forEach(item => {
        const input = item.querySelector('input[type="radio"]');
        if (input && input.checked) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
    
    // Handle checkboxes
    document.querySelectorAll('.checkbox-item').forEach(item => {
        const input = item.querySelector('input[type="checkbox"]');
        if (input && input.checked) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

// Update progress indicator
function updateProgress() {
    const form = document.getElementById('tripPlannerForm');
    const formData = new FormData(form);
    const required = ['duration', 'travelers', 'baseLocation', 'diet', 'transport'];
    const interests = form.querySelectorAll('input[name="interests"]:checked');
    
    let completed = 0;
    const total = required.length + 1; // +1 for interests
    
    required.forEach(field => {
        if (formData.get(field)) completed++;
    });
    
    if (interests.length > 0) completed++;
    
    const progress = (completed / total) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

// Validate form
function validateForm() {
    const form = document.getElementById('tripPlannerForm');
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });
    
    // Check required fields
    const required = [
        {field: 'duration', error: 'durationError', message: 'Please select trip duration'},
        {field: 'travelers', error: 'travelersError', message: 'Please select number of travelers'},
        {field: 'baseLocation', error: 'baseLocationError', message: 'Please select base location'},
        {field: 'diet', error: 'dietError', message: 'Please select dietary preference'},
        {field: 'transport', error: 'transportError', message: 'Please select transportation preference'}
    ];
    
    required.forEach(item => {
        const formData = new FormData(form);
        if (!formData.get(item.field)) {
            document.getElementById(item.error).textContent = item.message;
            document.getElementById(item.error).style.display = 'block';
            isValid = false;
        }
    });
    
    // Check interests
    const interests = form.querySelectorAll('input[name="interests"]:checked');
    if (interests.length === 0) {
        document.getElementById('interestsError').textContent = 'Please select at least one interest';
        document.getElementById('interestsError').style.display = 'block';
        isValid = false;
    }
    
    return isValid;
}

// Get form data
function getFormData() {
    const form = document.getElementById('tripPlannerForm');
    const formData = new FormData(form);
    
    const interests = Array.from(form.querySelectorAll('input[name="interests"]:checked'))
        .map(cb => cb.value);
    
    const data = {
        duration: formData.get('duration'),
        travelers: formData.get('travelers'),
        baseLocation: formData.get('baseLocation'),
        budget: '₹' + parseInt(formData.get('budget')).toLocaleString(),
        diet: formData.get('diet'),
        alcohol: formData.get('alcohol') === 'Yes',
        interests: interests.join(', '),
        transport: formData.get('transport'),
        requirements: formData.get('requirements') || 'None specified'
    };
    
    return data;
}

// Select appropriate prompt template based on user inputs
function selectTemplate(formData) {
    const duration = parseInt(formData.duration);
    const interests = formData.interests.toLowerCase();
    
    // Template selection logic
    if (duration === 1) {
        if (interests.includes('food')) {
            return PROMPT_TEMPLATES.foodTour;
        } else if (interests.includes('photography') || interests.includes('art')) {
            return PROMPT_TEMPLATES.photographyArt;
        } else if (interests.split(',').length <= 2) {
            return PROMPT_TEMPLATES.oneDayFirstTime;
        } else {
            return PROMPT_TEMPLATES.oneDayFocused;
        }
    } else if (duration === 2) {
        if (interests.includes('heritage') && interests.includes('nature')) {
            return PROMPT_TEMPLATES.twoDayHeritage;
        } else if (interests.includes('food')) {
            return PROMPT_TEMPLATES.foodTour;
        } else if (interests.includes('photography') || interests.includes('art')) {
            return PROMPT_TEMPLATES.photographyArt;
        } else {
            return PROMPT_TEMPLATES.twoDayCultural;
        }
    } else { // 3 days
        if (interests.includes('cultural') || interests.includes('heritage')) {
            return PROMPT_TEMPLATES.threeDayCultural;
        } else if (interests.includes('food')) {
            return PROMPT_TEMPLATES.foodTour;
        } else if (interests.includes('photography') || interests.includes('art')) {
            return PROMPT_TEMPLATES.photographyArt;
        } else {
            return PROMPT_TEMPLATES.threeDayComprehensive;
        }
    }
}

// Generate prompt from template
function generatePrompt() {
    if (!validateForm()) {
        showError('Please fill in all required fields before generating your itinerary.');
        return null;
    }
    
    currentFormData = getFormData();
    const template = selectTemplate(currentFormData);
    
    let prompt = template.template;
    
    // Replace placeholders
    prompt = prompt.replace(/{duration}/g, currentFormData.duration);
    prompt = prompt.replace(/{travelers}/g, currentFormData.travelers);
    prompt = prompt.replace(/{baseLocation}/g, currentFormData.baseLocation);
    prompt = prompt.replace(/{budget}/g, currentFormData.budget);
    prompt = prompt.replace(/{diet}/g, currentFormData.diet);
    prompt = prompt.replace(/{transport}/g, currentFormData.transport);
    prompt = prompt.replace(/{interests}/g, currentFormData.interests);
    
    // Conditional sections
    const alcoholPreference = currentFormData.alcohol ? 
        '- Alcohol preference: Yes, include toddy shops and bars' : 
        '- Alcohol preference: No alcohol experiences';
    prompt = prompt.replace(/{alcoholPreference}/g, alcoholPreference);
    
    const alcoholComponent = currentFormData.alcohol ? 
        '- **Traditional Drinks:** Toddy shops, local bars, traditional fermented beverages' : 
        '- **Traditional Beverages:** Fresh coconut water, traditional teas, local fruit juices';
    prompt = prompt.replace(/{alcoholComponent}/g, alcoholComponent);
    
    const specialRequirements = currentFormData.requirements !== 'None specified' ? 
        `- Special requirements: ${currentFormData.requirements}` : 
        '';
    prompt = prompt.replace(/{specialRequirements}/g, specialRequirements);
    
    generatedPrompt = prompt;
    savePreferences();
    return prompt;
}

// Generate itinerary with selected LLM
function generateItinerary(llm) {
    const prompt = generatePrompt();
    if (!prompt) return;
    
    const encodedPrompt = encodeURIComponent(prompt);
    let url;
    
    switch(llm) {
        case 'claude':
            // Claude doesn't support URL pre-filling, use dialog + copy-paste approach
            showPromptDialog('Claude', 'claude.ai', prompt, () => {
                window.open('https://claude.ai', '_blank');
            });
            return;
        case 'chatgpt':
            url = `https://chat.openai.com/?q=${encodedPrompt}`;
            break;
        case 'gemini':
            // Gemini doesn't reliably support URL pre-filling, use dialog + copy-paste approach
            showPromptDialog('Gemini', 'gemini.google.com', prompt, () => {
                window.open('https://gemini.google.com', '_blank');
            });
            return;
        default:
            showError('Invalid LLM selection');
            return;
    }
    
    // For ChatGPT only (Claude and Gemini return early)
    // Disable button temporarily
    const button = document.getElementById(llm + 'Btn');
    button.disabled = true;
    button.innerHTML = '<div class="loading"></div> Opening ChatGPT...';
    
    // Try to open URL
    const newWindow = window.open(url, '_blank');
    
    // Check if popup was blocked
    setTimeout(() => {
        if (!newWindow || newWindow.closed) {
            // Fallback to copy to clipboard
            copyToClipboard(prompt);
            showError('Popup blocked. Prompt copied to clipboard. Please paste it manually in ChatGPT');
        }
        
        // Re-enable button
        button.disabled = false;
        button.innerHTML = '💬 Generate with ChatGPT';
    }, 1000);
}

// Preview prompt
function previewPrompt() {
    const prompt = generatePrompt();
    if (!prompt) return;
    
    const previewContainer = document.getElementById('previewContainer');
    const previewContent = document.getElementById('previewContent');
    
    previewContent.textContent = prompt;
    previewContainer.classList.add('show');
    
    // Scroll to preview
    previewContainer.scrollIntoView({ behavior: 'smooth' });
}

// Copy prompt to clipboard
function copyPrompt() {
    const prompt = generatePrompt();
    if (!prompt) return;
    
    copyToClipboard(prompt);
    showSuccess('Prompt copied to clipboard!');
}

// Copy to clipboard utility
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
    }
}

// Show error message
function showError(message) {
    // Create or update error notification
    let errorDiv = document.getElementById('errorNotification');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'errorNotification';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Show prompt dialog for Claude and Gemini
function showPromptDialog(llmName, llmUrl, prompt, onProceed) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 20000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create dialog box
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease;
        position: relative;
    `;
    
    dialog.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h3 style="color: var(--primary-blue); margin-bottom: 10px; font-size: 1.4em;">
                ✨ Ready to Generate with ${llmName}
            </h3>
            <p style="color: #666; line-height: 1.6;">
                Your personalized Kochi itinerary prompt is ready! Here's what will happen:
            </p>
        </div>
        
        <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                <span style="background: var(--primary-blue); color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">1</span>
                <span>Your prompt will be copied to clipboard automatically</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                <span style="background: var(--primary-blue); color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">2</span>
                <span>${llmName} will open in a new tab</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="background: var(--primary-blue); color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">3</span>
                <span><strong>Paste (Ctrl+V or Cmd+V)</strong> the prompt and start planning!</span>
            </div>
        </div>
        
        <div style="background: linear-gradient(135deg, var(--spice-gold), #ffed4e); padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: var(--warm-earth); font-weight: 600; text-align: center;">
                💡 Tip: Keep this tab open to easily copy the prompt again if needed
            </p>
        </div>
        
        <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px;">
            <button id="cancelDialog" style="
                background: #6c757d;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1em;
                transition: all 0.3s ease;
            ">Cancel</button>
            <button id="proceedDialog" style="
                background: linear-gradient(135deg, var(--primary-blue), var(--backwater-blue));
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1em;
                font-weight: 600;
                transition: all 0.3s ease;
            ">🚀 Copy Prompt & Open ${llmName}</button>
        </div>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    // Add event listeners
    document.getElementById('cancelDialog').addEventListener('click', () => {
        overlay.remove();
    });
    
    document.getElementById('proceedDialog').addEventListener('click', () => {
        // Copy prompt to clipboard
        copyToClipboard(prompt);
        
        // Show brief success message
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--success-green);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 25000;
            font-weight: 600;
            animation: fadeIn 0.3s ease;
        `;
        successMsg.textContent = '✅ Prompt copied! Opening ' + llmName + '...';
        document.body.appendChild(successMsg);
        
        // Remove dialog
        overlay.remove();
        
        // Open LLM after brief delay
        setTimeout(() => {
            onProceed();
            successMsg.remove();
        }, 1500);
    });
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
    
    // Close on Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            overlay.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Focus the proceed button
    setTimeout(() => {
        document.getElementById('proceedDialog').focus();
    }, 100);
}

// Show success message
function showSuccess(message) {
    // Create or update success notification
    let successDiv = document.getElementById('successNotification');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.id = 'successNotification';
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(successDiv);
    }
    
    successDiv.textContent = message;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 3000);
}

// Save user preferences to localStorage
function savePreferences() {
    const preferences = {
        formData: currentFormData,
        timestamp: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('kochiTripPlanner', JSON.stringify(preferences));
    } catch (error) {
        console.warn('Unable to save preferences:', error);
    }
}

// Load user preferences from localStorage
function loadPreferences() {
    try {
        const saved = localStorage.getItem('kochiTripPlanner');
        if (saved) {
            const preferences = JSON.parse(saved);
            
            // Check if preferences are recent (within 7 days)
            const saveDate = new Date(preferences.timestamp);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            
            if (saveDate > weekAgo && preferences.formData) {
                populateForm(preferences.formData);
            }
        }
    } catch (error) {
        console.warn('Unable to load preferences:', error);
    }
}

// Populate form with saved data
function populateForm(data) {
    // This is a simplified version - would need more detailed implementation
    // for a production application to properly restore all form states
    if (data.duration) {
        const durationRadio = document.getElementById(`duration${data.duration}`);
        if (durationRadio) durationRadio.checked = true;
    }
    
    if (data.travelers) {
        document.getElementById('travelers').value = data.travelers;
    }
    
    if (data.baseLocation) {
        document.getElementById('baseLocation').value = data.baseLocation;
    }
    
    // Update progress after loading
    setTimeout(updateProgress, 100);
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to generate with Claude
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        generateItinerary('claude');
    }
    
    // Ctrl/Cmd + P to preview
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        previewPrompt();
    }
});

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);