import React, { useState } from 'react';
import {
  Bell,
  MessageSquare,
  Settings,
  Plus,
  Heart,
  Share2,
  Trash2,
  Layers,
} from 'lucide-react';
import {
  DGlassEffectContainer,
  FloatingNavigation,
  FluidButton,
  MoodboardContainer,
  GlassSheet,
} from './design';

const FluidDesignShowcase: React.FC = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Sample moodboard data
  const moodboardItems = [
    {
      id: '1',
      src: 'https://images.unsplash.com/photo-1557672172-298e090d0f80?w=400&h=400&fit=crop',
      alt: 'Minimalist workspace',
      title: 'Minimalist Design',
      tags: ['clean', 'minimal', 'workspace'],
      colors: ['#FFFFFF', '#101118', '#86868B'],
    },
    {
      id: '2',
      src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop',
      alt: 'Vibrant gradient',
      title: 'Vibrant Gradients',
      tags: ['gradient', 'colorful', 'modern'],
      colors: ['#2463E6', '#18C9AE', '#E14BF7'],
    },
    {
      id: '3',
      src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop',
      alt: 'Creative workspace',
      title: 'Creative Studio',
      tags: ['studio', 'creative', 'professional'],
      colors: ['#F6F6FA', '#FFFFFF', '#2463E6'],
    },
    {
      id: '4',
      src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop',
      alt: 'Motion and flow',
      title: 'Motion Design',
      tags: ['motion', 'animation', 'dynamic'],
      colors: ['#18C9AE', '#101118', '#E1EBFF'],
    },
    {
      id: '5',
      src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
      alt: 'Glass morphism',
      title: 'Glass Morphism',
      tags: ['glass', 'modern', 'fluid'],
      colors: ['#FFFFFF', '#86868B', '#ECEEF5'],
    },
    {
      id: '6',
      src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop',
      alt: 'Fluid design',
      title: 'Fluid Interfaces',
      tags: ['fluid', 'interactive', 'responsive'],
      colors: ['#E14BF7', '#2463E6', '#18C9AE'],
    },
  ];

  // Floating nav items
  const floatingNavItems = [
    { id: '1', icon: <MessageSquare size={20} />, label: 'Messages' },
    { id: '2', icon: <Bell size={20} />, label: 'Notifications', badge: 3 },
    { id: '3', icon: <Plus size={20} />, label: 'Create', onClick: () => setIsSheetOpen(true) },
    { id: '4', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Search query:', query);
  };

  const handleMoodboardDelete = (id: string) => {
    console.log('Delete item:', id);
  };

  return (
    <div className="min-h-screen bg-app pb-32 md:pb-12">
      {/* Hero Section */}
      <div className="px-6 py-12 md:py-20 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink-primary mb-4 tracking-tight">
            Fluid Design System
          </h1>
          <p className="text-lg text-ink-secondary max-w-2xl">
            iOS-inspired floating navigation, fluid morphing buttons, and glass
            morphism effects. Experience the future of interface design with responsive,
            haptic-enabled, and visually fluid components.
          </p>
        </div>

        {/* Buttons Section */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-semibold text-ink-primary mb-6">
            Fluid Buttons
          </h2>
          <DGlassEffectContainer
            glassEffectID="buttons-showcase"
            threshold={50}
            blurred
            className="p-8 space-y-6"
          >
            {/* Size Variations */}
            <div>
              <h3 className="text-sm font-semibold text-ink-secondary mb-4 uppercase tracking-wide">
                Sizes
              </h3>
              <div className="flex flex-wrap gap-4">
                <FluidButton size="sm" variant="primary">
                  Small Button
                </FluidButton>
                <FluidButton size="md" variant="primary">
                  Medium Button
                </FluidButton>
                <FluidButton size="lg" variant="primary">
                  Large Button
                </FluidButton>
              </div>
            </div>

            {/* Variants */}
            <div>
              <h3 className="text-sm font-semibold text-ink-secondary mb-4 uppercase tracking-wide">
                Variants
              </h3>
              <div className="flex flex-wrap gap-4">
                <FluidButton variant="primary" leftIcon={<Plus size={18} />}>
                  Primary Action
                </FluidButton>
                <FluidButton variant="secondary" leftIcon={<Heart size={18} />}>
                  Secondary
                </FluidButton>
                <FluidButton variant="ghost" leftIcon={<Share2 size={18} />}>
                  Ghost
                </FluidButton>
                <FluidButton variant="danger" leftIcon={<Trash2 size={18} />}>
                  Danger
                </FluidButton>
                <FluidButton variant="edge">
                  <Layers size={18} className="mr-2" />
                  Edge Gradient
                </FluidButton>
              </div>
            </div>

            {/* States */}
            <div>
              <h3 className="text-sm font-semibold text-ink-secondary mb-4 uppercase tracking-wide">
                States
              </h3>
              <div className="flex flex-wrap gap-4">
                <FluidButton disabled>Disabled</FluidButton>
                <FluidButton isLoading>Loading</FluidButton>
                <FluidButton glassEffect>Glass Effect</FluidButton>
                <FluidButton hapticFeedback>Haptic Enabled</FluidButton>
              </div>
            </div>
          </DGlassEffectContainer>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-semibold text-ink-primary mb-6">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Floating Navigation',
                description: 'Bottom-centric search bar that adapts to keyboard position',
                icon: '🎯',
              },
              {
                title: 'Fluid Morphing',
                description: 'Elements merge and separate smoothly with metaball physics',
                icon: '💧',
              },
              {
                title: 'Glass Morphism',
                description: 'Frosted glass effect with blur and saturation layers',
                icon: '🔮',
              },
              {
                title: 'Haptic Feedback',
                description: 'Tactile vibration patterns on interaction',
                icon: '📳',
              },
              {
                title: 'Responsive Design',
                description: 'Seamless adaptation to all screen sizes',
                icon: '📱',
              },
              {
                title: 'Animation Tokens',
                description: 'Consistent easing curves and transition timing',
                icon: '✨',
              },
            ].map((feature, idx) => (
              <DGlassEffectContainer
                key={idx}
                glassEffectID={`feature-${idx}`}
                blurred
                className="p-6 space-y-3"
              >
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="font-semibold text-ink-primary">{feature.title}</h3>
                <p className="text-sm text-ink-secondary">{feature.description}</p>
              </DGlassEffectContainer>
            ))}
          </div>
        </div>

        {/* Moodboard Showcase */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-semibold text-ink-primary mb-6">
            Semantic Search & Moodboard
          </h2>
          <MoodboardContainer
            items={moodboardItems}
            onSearch={handleSearch}
            onItemDelete={handleMoodboardDelete}
            columns={3}
            morphingEnabled
            glassEffectID="moodboard-showcase"
          />
        </div>

        {/* Glass Sheet Trigger */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-semibold text-ink-primary mb-6">
            Morphing Modals
          </h2>
          <div className="flex gap-4 flex-wrap">
            <FluidButton
              variant="primary"
              size="lg"
              onClick={() => setIsSheetOpen(true)}
              leftIcon={<Plus size={20} />}
            >
              Open Glass Sheet
            </FluidButton>
          </div>
        </div>
      </div>

      {/* Glass Sheet Modal */}
      <GlassSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Create New Project"
        glassEffectID="create-project-sheet"
        size="lg"
        position="center"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-ink-primary mb-2">
              Project Name
            </label>
            <input
              type="text"
              placeholder="Enter project name..."
              className="w-full px-4 py-3 bg-subtle/50 border border-border-subtle rounded-xl text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-primary mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe your project..."
              rows={4}
              className="w-full px-4 py-3 bg-subtle/50 border border-border-subtle rounded-xl text-ink-primary placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <FluidButton
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={() => setIsSheetOpen(false)}
            >
              Create
            </FluidButton>
            <FluidButton
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => setIsSheetOpen(false)}
            >
              Cancel
            </FluidButton>
          </div>
        </div>
      </GlassSheet>

      {/* Floating Navigation */}
      <FloatingNavigation
        items={floatingNavItems}
        onSearch={handleSearch}
        searchEnabled
        morphingEnabled
        placeholder="Search everything..."
      />
    </div>
  );
};

export default FluidDesignShowcase;
