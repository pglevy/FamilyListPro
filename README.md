# Family List Pro 🛒

A modern, shareable grocery list app that stores everything in the URL. No accounts, no databases, just pure convenience.

## ✨ Features

### 🔗 **URL-Based Sharing**
- Your entire grocery list lives in the URL
- Share lists instantly by copying and pasting the URL
- No sign-ups or accounts required
- Works across all devices and browsers

### 📝 **Three List Types**
- **To Buy** - Your active shopping list
- **Favorites** - Items you buy regularly 
- **Never Buy** - Items to avoid (allergies, dislikes, etc.)

### 🏷️ **Smart Organization**
- 7 store categories: Produce, Dairy, Meat, Bakery, Frozen, Pantry, Household
- Color-coded category icons for quick identification
- Search and filter by category
- Mark items as purchased while shopping

### 📱 **Mobile-First Design**
- Responsive design optimized for phone use while shopping
- Touch-friendly interface
- Works offline (once loaded)
- PWA-ready for home screen installation

### 🚀 **Advanced Features**
- Move items between lists with one tap
- Add items from Favorites to your To Buy list
- Import grocery lists from markdown files
- Compressed URLs keep links shareable even with large lists
- Real-time URL updates as you modify your list

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pglevy/FamilyListPro.git
   cd FamilyListPro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

4. **Start the backend** (in a separate terminal)
   ```bash
   npm run dev:server
   ```
   
   The API will be available at `http://localhost:5000`

### Production Build

```bash
npm run build
npm start
```

## 🏗️ How It Works

Family List Pro uses a unique architecture where all your grocery data is stored in the URL hash using advanced compression:

1. **State Compression** - Item data is compressed using field shortening and LZ-string compression
2. **URL Storage** - Compressed data is stored in the URL hash for instant sharing
3. **Smart Filtering** - Only "To Buy" items are included in shareable URLs to keep them shorter
4. **Real-time Sync** - URL updates automatically as you modify your list

### Example URL Structure
```
https://yoursite.com/#groceryItems=<compressed-data>&tab=tobuy&share=<shareable-data>
```

## 📋 Usage Guide

### Adding Items
1. Click the "+" button to open the add item modal
2. Enter item name, select category, and add optional notes
3. Choose which list to add it to (To Buy, Favorites, or Never Buy)

### Managing Lists
- **To Buy List**: Your active shopping list with purchase tracking
- **Favorites**: Frequently bought items - click to add to To Buy list
- **Never Buy**: Items to avoid - helps with family dietary restrictions

### Sharing Lists
1. Click the share button in the header
2. Copy the URL from your browser
3. Share via text, email, or any messaging app
4. Recipients see your current To Buy list

### Category System
Items are organized by store sections:
- 🥬 **Produce** - Fruits, vegetables, fresh items
- 🥛 **Dairy** - Milk, cheese, yogurt, eggs
- 🥩 **Meat** - All proteins and deli items  
- 🥖 **Bakery** - Bread, pastries, baked goods
- 🧊 **Frozen** - Frozen foods and ice cream
- 🥫 **Pantry** - Shelf-stable items, canned goods
- 🧴 **Household** - Cleaning supplies, paper products

## 🔧 Development

### Project Structure
```
FamilyListPro/
├── client/           # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── context/     # React context
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utilities
├── server/           # Express backend
├── shared/           # Shared types
└── CLAUDE.md         # AI assistant guidelines
```

### Key Technologies
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, TypeScript
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: React Context + Custom URL hooks
- **Compression**: LZ-string for efficient URL storage

### Available Scripts
- `npm run dev` - Start frontend development server
- `npm run dev:server` - Start backend development server  
- `npm run build` - Build for production
- `npm run check` - Type checking
- `npm start` - Start production server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Icons from [Font Awesome](https://fontawesome.com/)
- Compression powered by [LZ-string](https://github.com/pieroxy/lz-string)

---

**Happy Shopping!** 🛒✨