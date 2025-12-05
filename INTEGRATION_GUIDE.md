# Integration Guide - Fluid Design System

This guide shows how to integrate the iOS-inspired Fluid Design System into existing pages and components.

## Quick Start

### 1. View the Demo

Navigate to the **Design** section in the sidebar to see all components in action:
```
Studio Roster → Design (new navigation item)
```

### 2. Import Components

```tsx
import {
  DGlassEffectContainer,
  FloatingNavigation,
  FluidButton,
  MoodboardContainer,
  GlassSheet,
} from '@/components/design';
```

## Integration Patterns

### Pattern 1: Add Floating Navigation to a Page

```tsx
import { FloatingNavigation } from '@/components/design';
import { Bell, MessageSquare, Plus, Settings } from 'lucide-react';

function MyPage() {
  const navItems = [
    { id: '1', icon: <MessageSquare size={20} />, label: 'Messages' },
    { id: '2', icon: <Bell size={20} />, label: 'Notifications', badge: 5 },
    { id: '3', icon: <Plus size={20} />, label: 'Create', onClick: handleCreate },
    { id: '4', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <>
      {/* Page content */}
      <main>
        {/* ... */}
      </main>

      {/* Add floating nav at bottom */}
      <FloatingNavigation
        items={navItems}
        onSearch={(query) => {
          // Implement search logic
          console.log('Search:', query);
        }}
        placeholder="Search projects, talent..."
      />
    </>
  );
}
```

### Pattern 2: Create a Morphing Action Panel

```tsx
import { DGlassEffectContainer, FluidButton } from '@/components/design';

function ActionPanel() {
  return (
    <DGlassEffectContainer
      glassEffectID="action-panel"
      threshold={45}
      blurred
      className="p-6 space-y-3"
    >
      <FluidButton variant="primary" className="w-full">
        Primary Action
      </FluidButton>
      <FluidButton variant="secondary" className="w-full">
        Secondary Action
      </FluidButton>
      <FluidButton variant="ghost" className="w-full">
        Tertiary Action
      </FluidButton>
    </DGlassEffectContainer>
  );
}
```

### Pattern 3: Replace Modal Dialogs with GlassSheet

**Before:**
```tsx
<Modal isOpen={isOpen} onClose={handleClose}>
  <h2>Create Project</h2>
  {/* Form content */}
</Modal>
```

**After:**
```tsx
<GlassSheet
  isOpen={isOpen}
  onClose={handleClose}
  title="Create Project"
  size="lg"
  position="center"
>
  {/* Form content - same as before */}
</GlassSheet>
```

### Pattern 4: Add Glass Cards to Dashboard

```tsx
import { DGlassEffectContainer } from '@/components/design';

function DashboardCards() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <DGlassEffectContainer blurred className="p-6">
        <h3 className="font-semibold mb-2">Active Projects</h3>
        <p className="text-3xl font-bold text-primary">12</p>
      </DGlassEffectContainer>

      <DGlassEffectContainer blurred className="p-6">
        <h3 className="font-semibold mb-2">Team Members</h3>
        <p className="text-3xl font-bold text-primary">24</p>
      </DGlassEffectContainer>

      <DGlassEffectContainer blurred className="p-6">
        <h3 className="font-semibold mb-2">Tasks Complete</h3>
        <p className="text-3xl font-bold text-primary">89%</p>
      </DGlassEffectContainer>
    </div>
  );
}
```

### Pattern 5: Semantic Search with Moodboard

```tsx
import { MoodboardContainer } from '@/components/design';

function MoodboardPage() {
  const [moodboardItems, setMoodboardItems] = useState([...]);

  const handleSearch = (query: string) => {
    if (!query) {
      setMoodboardItems(allItems);
      return;
    }

    // Implement semantic search
    const filtered = allItems.filter(item =>
      item.title?.includes(query) ||
      item.tags?.some(tag => tag.includes(query))
    );

    setMoodboardItems(filtered);
  };

  return (
    <MoodboardContainer
      items={moodboardItems}
      onSearch={handleSearch}
      onItemClick={(item) => {
        // Show item details
        console.log('Clicked:', item.id);
      }}
      onItemDelete={(id) => {
        setMoodboardItems(prev => prev.filter(i => i.id !== id));
      }}
      columns={3}
    />
  );
}
```

## Migration Guide

### Update Existing Buttons

```tsx
// Old
<Button variant="primary">Click me</Button>

// New (with morphing & haptic)
<FluidButton variant="primary" fluidMorph hapticFeedback>
  Click me
</FluidButton>
```

### Update Modal Components

```tsx
// Old
import { Modal } from '@/components/design';

<Modal isOpen={open} onClose={close}>
  {/* content */}
</Modal>

// New
import { GlassSheet } from '@/components/design';

<GlassSheet isOpen={open} onClose={close} title="Title">
  {/* content */}
</GlassSheet>
```

### Add Glass Effects to Cards

```tsx
// Old
<Card>
  {/* content */}
</Card>

// New
<DGlassEffectContainer blurred className="p-6 rounded-2xl">
  {/* content */}
</DGlassEffectContainer>
```

## Component-Specific Integrations

### ProjectList with Floating Nav

```tsx
function ProjectListWithNav() {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([...]);

  return (
    <>
      <div className="grid gap-6">
        {projects
          .filter(p => p.name.includes(searchQuery))
          .map(project => (
            <div key={project.id}>{/* project card */}</div>
          ))}
      </div>

      <FloatingNavigation
        items={[
          { id: 'search', icon: <Search /> },
          { id: 'add', icon: <Plus />, onClick: () => createProject() },
        ]}
        onSearch={setSearchQuery}
      />
    </>
  );
}
```

### Dashboard with Glass Cards & Floating Nav

```tsx
function DashboardWithFluidUI() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      {/* Existing dashboard content wrapped in glass */}
      <div className="grid md:grid-cols-2 gap-6">
        <DGlassEffectContainer blurred className="p-6">
          <h3>Recent Projects</h3>
          {/* Projects list */}
        </DGlassEffectContainer>

        <DGlassEffectContainer blurred className="p-6">
          <h3>Team Activity</h3>
          {/* Activity feed */}
        </DGlassEffectContainer>
      </div>

      {/* Floating action menu */}
      <FloatingNavigation
        items={[
          { id: 'add', icon: <Plus />, onClick: () => setIsCreateOpen(true) },
          { id: 'settings', icon: <Settings /> },
        ]}
      />

      {/* Morphing creation sheet */}
      <GlassSheet
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="New Project"
      >
        {/* Creation form */}
      </GlassSheet>
    </>
  );
}
```

### Freelancer List with Fluid UI

```tsx
function FreelancerListWithFluid() {
  const [filteredFreelancers, setFilteredFreelancers] = useState([...]);

  return (
    <>
      {/* List wrapped in glass container */}
      <DGlassEffectContainer blurred className="p-6">
        <div className="space-y-4">
          {filteredFreelancers.map(freelancer => (
            <div key={freelancer.id} className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{freelancer.name}</h3>
                <p className="text-sm text-ink-secondary">{freelancer.role}</p>
              </div>
              <FluidButton
                size="sm"
                variant="secondary"
                onClick={() => assignFreelancer(freelancer.id)}
              >
                Assign
              </FluidButton>
            </div>
          ))}
        </div>
      </DGlassEffectContainer>

      {/* Floating search */}
      <FloatingNavigation
        items={[]}
        onSearch={(query) => filterFreelancers(query)}
        placeholder="Search talent by skill..."
      />
    </>
  );
}
```

## Performance Tips

1. **Use `morphingEnabled={false}` for static containers** to save 60fps calculations
2. **Lazy load moodboard items** with `content-visibility: auto`
3. **Debounce search** to avoid excessive filtering
4. **Memoize glass components** if they re-render frequently

```tsx
import { useMemo } from 'react';

function OptimizedComponent() {
  const moodboard = useMemo(
    () => (
      <MoodboardContainer items={items} morphingEnabled={false} />
    ),
    [items]
  );

  return moodboard;
}
```

## Accessibility Checklist

- ✅ All buttons have `aria-label` for screen readers
- ✅ Keyboard navigation with Tab and Escape
- ✅ Focus indicators on all interactive elements
- ✅ Color contrast ratio ≥ 4.5:1
- ✅ Haptic feedback has visual fallback

## Browser Compatibility

| Feature | Chrome | Safari | Firefox | Edge |
|---------|--------|--------|---------|------|
| Glass Morphism | ✅ | ✅ | ✅ | ✅ |
| Haptic API | ✅ | ✅ | ⚠️ | ✅ |
| Animations | ✅ | ✅ | ✅ | ✅ |
| Floating Nav | ✅ | ✅ | ✅ | ✅ |

## Troubleshooting

### Components not rendering
- Check imports: `from '@/components/design'`
- Verify Tailwind CSS is loaded
- Check console for TypeScript errors

### Morphing not working
- Ensure `morphingEnabled={true}` (default)
- Check children are direct descendants
- Adjust `threshold` value (default: 40)

### Styling conflicts
- Ensure no CSS resets override glass styles
- Check z-index layers for modals
- Verify backdrop-filter browser support

## Next Steps

1. **Audit existing pages** for modal/button replacements
2. **Add floating nav** to high-traffic pages
3. **Create glass containers** for dashboard cards
4. **Implement semantic search** on moodboard
5. **A/B test** user engagement improvements

For more details, see [FLUID_DESIGN_GUIDE.md](./FLUID_DESIGN_GUIDE.md)
