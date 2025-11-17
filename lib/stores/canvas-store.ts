/**
 * Canvas Store (Zustand)
 * Global state management for the canvas editor
 */

import { create } from 'zustand'
import type { Slide, CanvasComponent, HistoryState } from '@/lib/types/canvas'
import { nanoid } from 'nanoid'

interface CanvasStore extends CanvasState {
  // State
  history: HistoryState[]
  historyIndex: number
  
  // Actions
  setActiveSlide: (slideId: string) => void
  addSlide: (slide?: Partial<Slide>) => void
  updateSlide: (slideId: string, updates: Partial<Slide>) => void
  deleteSlide: (slideId: string) => void
  reorderSlides: (fromIndex: number, toIndex: number) => void
  
  // Components
  addComponent: (component: Omit<CanvasComponent, 'id'>) => string
  updateComponent: (componentId: string, updates: Partial<CanvasComponent>) => void
  deleteComponent: (componentId: string) => void
  duplicateComponent: (componentId: string) => void
  selectComponent: (componentId: string, multi?: boolean) => void
  clearSelection: () => void
  moveComponent: (componentId: string, position: { x: number; y: number }) => void
  resizeComponent: (componentId: string, size: { width: number; height: number }) => void
  
  // Selection
  selectAll: () => void
  deleteSelected: () => void
  duplicateSelected: () => void
  
  // History
  undo: () => void
  redo: () => void
  saveHistory: () => void
  
  // View
  setZoom: (zoom: number) => void
  toggleGrid: () => void
  toggleSnapToGrid: () => void
  setGridSize: (size: number) => void
  
  // Initialize
  initialize: (slides: Slide[]) => void
}

const defaultSlide: Omit<Slide, 'id' | 'index'> = {
  title: 'New Slide',
  components: [],
  backgroundColor: '#ffffff',
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  // Initial state
  slides: [],
  activeSlideId: null,
  selectedComponentIds: [],
  zoom: 100,
  showGrid: true,
  snapToGrid: true,
  gridSize: 10,
  history: [],
  historyIndex: -1,

  // Initialize
  initialize: (slides) => {
    set({
      slides,
      activeSlideId: slides[0]?.id || null,
      selectedComponentIds: [],
      history: [{ slides, timestamp: Date.now() }],
      historyIndex: 0,
    })
  },

  // Slides
  setActiveSlide: (slideId) => {
    set({ activeSlideId: slideId, selectedComponentIds: [] })
  },

  addSlide: (slideData) => {
    const { slides } = get()
    const newSlide: Slide = {
      id: nanoid(),
      index: slides.length,
      ...defaultSlide,
      ...slideData,
    }
    set({ slides: [...slides, newSlide], activeSlideId: newSlide.id })
    get().saveHistory()
  },

  updateSlide: (slideId, updates) => {
    const { slides } = get()
    set({
      slides: slides.map((s) => (s.id === slideId ? { ...s, ...updates } : s)),
    })
    get().saveHistory()
  },

  deleteSlide: (slideId) => {
    const { slides, activeSlideId } = get()
    const filtered = slides.filter((s) => s.id !== slideId)
    const reindexed = filtered.map((s, i) => ({ ...s, index: i }))
    set({
      slides: reindexed,
      activeSlideId: activeSlideId === slideId ? reindexed[0]?.id || null : activeSlideId,
    })
    get().saveHistory()
  },

  reorderSlides: (fromIndex, toIndex) => {
    const { slides } = get()
    const reordered = [...slides]
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, moved)
    const reindexed = reordered.map((s, i) => ({ ...s, index: i }))
    set({ slides: reindexed })
    get().saveHistory()
  },

  // Components
  addComponent: (componentData) => {
    const { slides, activeSlideId } = get()
    if (!activeSlideId) return ''

    const component: CanvasComponent = {
      id: nanoid(),
      ...componentData,
    }

    const updatedSlides = slides.map((slide) =>
      slide.id === activeSlideId
        ? { ...slide, components: [...slide.components, component] }
        : slide
    )

    set({ slides: updatedSlides, selectedComponentIds: [component.id] })
    get().saveHistory()
    return component.id
  },

  updateComponent: (componentId, updates) => {
    const { slides } = get()
    const updatedSlides = slides.map((slide) => ({
      ...slide,
      components: slide.components.map((c) =>
        c.id === componentId ? { ...c, ...updates } : c
      ),
    }))
    set({ slides: updatedSlides })
  },

  deleteComponent: (componentId) => {
    const { slides } = get()
    const updatedSlides = slides.map((slide) => ({
      ...slide,
      components: slide.components.filter((c) => c.id !== componentId),
    }))
    set({ slides: updatedSlides, selectedComponentIds: [] })
    get().saveHistory()
  },

  duplicateComponent: (componentId) => {
    const { slides, activeSlideId } = get()
    if (!activeSlideId) return

    const activeSlide = slides.find((s) => s.id === activeSlideId)
    const component = activeSlide?.components.find((c) => c.id === componentId)
    if (!component) return

    const duplicated: CanvasComponent = {
      ...component,
      id: nanoid(),
      position: {
        x: component.position.x + 20,
        y: component.position.y + 20,
      },
    }

    const updatedSlides = slides.map((slide) =>
      slide.id === activeSlideId
        ? { ...slide, components: [...slide.components, duplicated] }
        : slide
    )

    set({ slides: updatedSlides, selectedComponentIds: [duplicated.id] })
    get().saveHistory()
  },

  selectComponent: (componentId, multi = false) => {
    const { selectedComponentIds } = get()
    if (multi) {
      set({
        selectedComponentIds: selectedComponentIds.includes(componentId)
          ? selectedComponentIds.filter((id) => id !== componentId)
          : [...selectedComponentIds, componentId],
      })
    } else {
      set({ selectedComponentIds: [componentId] })
    }
  },

  clearSelection: () => {
    set({ selectedComponentIds: [] })
  },

  moveComponent: (componentId, position) => {
    get().updateComponent(componentId, { position })
  },

  resizeComponent: (componentId, size) => {
    get().updateComponent(componentId, { size })
  },

  // Selection
  selectAll: () => {
    const { slides, activeSlideId } = get()
    const activeSlide = slides.find((s) => s.id === activeSlideId)
    if (activeSlide) {
      set({ selectedComponentIds: activeSlide.components.map((c) => c.id) })
    }
  },

  deleteSelected: () => {
    const { selectedComponentIds, deleteComponent } = get()
    selectedComponentIds.forEach((id) => deleteComponent(id))
  },

  duplicateSelected: () => {
    const { selectedComponentIds, duplicateComponent } = get()
    selectedComponentIds.forEach((id) => duplicateComponent(id))
  },

  // History
  saveHistory: () => {
    const { slides, history, historyIndex } = get()
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({ slides: JSON.parse(JSON.stringify(slides)), timestamp: Date.now() })
    set({
      history: newHistory.slice(-50), // Keep last 50 states
      historyIndex: newHistory.length - 1,
    })
  },

  undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1]
      set({
        slides: JSON.parse(JSON.stringify(previousState.slides)),
        historyIndex: historyIndex - 1,
      })
    }
  },

  redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      set({
        slides: JSON.parse(JSON.stringify(nextState.slides)),
        historyIndex: historyIndex + 1,
      })
    }
  },

  // View
  setZoom: (zoom) => set({ zoom }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleSnapToGrid: () => set((state) => ({ snapToGrid: !state.snapToGrid })),
  setGridSize: (size) => set({ gridSize: size }),
}))

