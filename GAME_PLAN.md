# 🎨 Canva for Investment Proposals - Game Plan

## Vision
Transform ClientView into a visual, drag-and-drop design tool specifically for investment proposals - like Canva, but purpose-built for wealth advisors.

---

## 🎯 Core Concept

**What We're Building:**
- Visual canvas editor with drag-and-drop components
- Component library of investment-specific elements
- Real-time visual editing (fonts, colors, layouts)
- Template marketplace
- Professional export (PDF, PowerPoint)

**What Makes It Different from Canva:**
- Investment-specific components (charts, metrics, disclosures)
- Financial data integration
- Compliance-aware templates
- Industry-standard layouts

---

## 🏗️ Architecture Overview

### Current State
- ✅ Basic slide editor (text editing)
- ✅ Chart components (PortfolioAllocation, PerformanceChart, etc.)
- ✅ PowerPoint export
- ❌ No drag-and-drop
- ❌ No visual component library
- ❌ No layout system

### Target State
```
┌─────────────────────────────────────────────────────────┐
│  Top Bar: Save, Export, Undo/Redo, Zoom                │
├──────────┬──────────────────────────────┬───────────────┤
│          │                              │               │
│ Component│     Canvas (Drag & Drop)     │  Properties   │
│ Library  │                              │  Panel        │
│          │  ┌──────────────────────┐   │               │
│ - Charts │  │  Slide Canvas        │   │ - Position    │
│ - Text   │  │  [Components here]   │   │ - Size        │
│ - Images │  │                      │   │ - Style       │
│ - Metrics│  │                      │   │ - Data        │
│ - Shapes │  └──────────────────────┘   │               │
│          │                              │               │
│          │  Slide Thumbnails (bottom)   │               │
└──────────┴──────────────────────────────┴───────────────┘
```

---

## 📦 Component Library

### 1. **Financial Charts** (Already exist, enhance)
- Portfolio Allocation (Pie/Donut)
- Performance Chart (Line)
- Risk Matrix (Scatter)
- Bar Comparison
- **New:** Waterfall Chart
- **New:** Heatmap
- **New:** Gantt Chart (for timelines)

### 2. **Text Components**
- Headings (H1-H6)
- Body Text
- Bullet Lists
- Numbered Lists
- Callout Boxes
- Quote Blocks

### 3. **Metrics & KPIs**
- Single Metric Card
- Metric Grid (2x2, 3x3)
- Comparison Cards
- Trend Indicators (↑↓)

### 4. **Layout Components**
- Section Dividers
- Columns (2, 3, 4)
- Grid Layouts
- Spacers

### 5. **Media**
- Image Placeholder
- Logo Placeholder
- Background Images

### 6. **Shapes & Graphics**
- Rectangles, Circles
- Lines, Arrows
- Icons (from Lucide)

### 7. **Investment-Specific**
- Risk Disclosure Box
- Performance Table
- Fee Schedule
- Investment Timeline
- Client Profile Card

---

## 🛠️ Technology Stack

### Core Libraries
- **React DnD Kit** or **@dnd-kit/core** - Drag and drop
- **Fabric.js** or **Konva.js** - Canvas manipulation (optional, for advanced features)
- **React Grid Layout** - Grid system
- **Zustand** or **Jotai** - State management (for canvas state)
- **React Hook Form** - Form handling for properties panel

### Keep Existing
- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Recharts (charts)

---

## 🚀 Implementation Phases

### **Phase 1: Foundation (Week 1-2)**
**Goal:** Basic drag-and-drop canvas

**Tasks:**
1. Install drag-and-drop library (@dnd-kit/core)
2. Create canvas component with drop zones
3. Build component palette sidebar
4. Implement basic drag from palette → canvas
5. Add selection system (click to select)
6. Create properties panel skeleton

**Deliverables:**
- Drag component from library
- Drop on canvas
- Select component
- See properties panel

---

### **Phase 2: Component System (Week 2-3)**
**Goal:** Reusable, configurable components

**Tasks:**
1. Create base `CanvasComponent` interface
2. Build component registry system
3. Implement component rendering on canvas
4. Add position/size controls
5. Create component factory pattern

**Component Interface:**
```typescript
interface CanvasComponent {
  id: string
  type: 'chart' | 'text' | 'metric' | 'image' | 'shape'
  position: { x: number; y: number }
  size: { width: number; height: number }
  props: Record<string, any>
  style: {
    backgroundColor?: string
    borderColor?: string
    borderRadius?: number
    padding?: number
  }
}
```

**Deliverables:**
- 5+ component types working
- Components render on canvas
- Can move/resize components

---

### **Phase 3: Visual Editing (Week 3-4)**
**Goal:** Edit component properties visually

**Tasks:**
1. Build properties panel UI
2. Connect properties to selected component
3. Add text editing (inline + panel)
4. Add color picker
5. Add font selector
6. Add size/position inputs
7. Add data input for charts

**Deliverables:**
- Edit text, colors, fonts
- Change component data
- Real-time preview

---

### **Phase 4: Layout & Alignment (Week 4-5)**
**Goal:** Professional layouts and alignment

**Tasks:**
1. Add snap-to-grid
2. Add alignment guides
3. Implement alignment tools (left, center, right, top, bottom)
4. Add distribution tools (space evenly)
5. Add layers panel (z-index)
6. Add grouping/ungrouping

**Deliverables:**
- Snap to grid
- Alignment helpers
- Layer management

---

### **Phase 5: Templates & Export (Week 5-6)**
**Goal:** Save templates and export

**Tasks:**
1. Build template system (save/load)
2. Create template gallery
3. Enhance PowerPoint export (use canvas data)
4. Add PDF export
5. Add image export (PNG/JPG)

**Deliverables:**
- Save as template
- Browse templates
- Export to PPTX/PDF/Image

---

### **Phase 6: Polish & Advanced (Week 6-8)**
**Goal:** Professional features

**Tasks:**
1. Undo/Redo system
2. Copy/Paste
3. Duplicate
4. Keyboard shortcuts
5. Zoom controls
6. Multi-select
7. Bulk operations
8. Responsive preview

**Deliverables:**
- Full editing experience
- Keyboard shortcuts
- Professional workflow

---

## 🎨 UI/UX Design Decisions

### Canvas
- **Size:** 1920x1080 (16:9) default, scalable
- **Background:** Grid pattern (optional)
- **Zoom:** 25% - 200%
- **Rulers:** Optional, for precision

### Component Library
- **Layout:** Left sidebar, collapsible
- **Categories:** Tabs or accordion
- **Search:** Filter components
- **Preview:** Thumbnail + name

### Properties Panel
- **Layout:** Right sidebar, collapsible
- **Sections:** Style, Data, Layout, Advanced
- **Inputs:** Native HTML inputs + custom pickers

### Top Bar
- **Actions:** New, Open, Save, Export
- **Edit:** Undo, Redo, Copy, Paste, Delete
- **View:** Zoom, Grid toggle, Rulers toggle

---

## 📐 Component Architecture

### Component Registry Pattern
```typescript
// lib/components/registry.ts
export const componentRegistry = {
  'portfolio-chart': {
    name: 'Portfolio Allocation',
    icon: PieChart,
    category: 'charts',
    defaultProps: { type: 'pie', data: [] },
    render: PortfolioAllocationComponent,
    properties: PortfolioChartProperties
  },
  'text': {
    name: 'Text',
    icon: Type,
    category: 'text',
    defaultProps: { content: 'Text', fontSize: 16 },
    render: TextComponent,
    properties: TextProperties
  },
  // ... more components
}
```

### Canvas State Management
```typescript
// Store structure
interface CanvasState {
  slides: Slide[]
  activeSlideId: string
  selectedComponentIds: string[]
  components: Record<string, CanvasComponent>
  history: HistoryState[]
  zoom: number
}
```

---

## 🔄 Data Flow

```
Component Library → Drag → Canvas → Drop → Add to State
                                              ↓
Canvas Click → Select Component → Update Properties Panel
                                              ↓
Properties Panel Change → Update Component → Re-render Canvas
                                              ↓
Export → Convert Canvas State → Generate PPTX/PDF
```

---

## 🎯 Success Metrics

### MVP (Phase 1-3)
- ✅ Drag 5+ component types to canvas
- ✅ Edit component properties
- ✅ Export to PowerPoint

### Full Product (Phase 1-6)
- ✅ 20+ component types
- ✅ Template system
- ✅ Professional export (PPTX, PDF)
- ✅ Undo/Redo, keyboard shortcuts
- ✅ < 2 second load time

---

## 🤔 Key Decisions Needed

### 1. **Canvas Library**
- **Option A:** Custom React components (simpler, more control)
- **Option B:** Fabric.js/Konva.js (more features, steeper learning curve)
- **Recommendation:** Start with Option A, migrate if needed

### 2. **State Management**
- **Option A:** Zustand (simpler, lighter)
- **Option B:** Redux Toolkit (more structure, more boilerplate)
- **Recommendation:** Zustand for speed

### 3. **Data Storage**
- **Option A:** LocalStorage (quick, no backend)
- **Option B:** Backend API (persistent, shareable)
- **Recommendation:** Start with LocalStorage, add backend later

### 4. **Export Format Priority**
- **Option A:** PowerPoint first (existing code)
- **Option B:** PDF first (better for proposals)
- **Recommendation:** Both, but prioritize PPTX (easier to edit later)

---

## 📋 Next Steps (After Approval)

1. **Set up project structure**
   - Create component registry
   - Set up canvas state management
   - Install dependencies

2. **Build Phase 1**
   - Drag-and-drop foundation
   - Basic canvas
   - Component palette

3. **Iterate based on feedback**
   - Test with real use cases
   - Refine UX
   - Add missing features

---

## ❓ Questions for You

1. **Priority:** Which phase should we start with? (Recommend Phase 1)
2. **Components:** Which components are most important? (Charts? Text? Metrics?)
3. **Templates:** Do you have existing PowerPoint templates to convert?
4. **Export:** Primary export format? (PPTX, PDF, or both equally?)
5. **Timeline:** What's your target launch date?

---

**Ready to build? Let me know what you'd like to adjust and we'll start!** 🚀

