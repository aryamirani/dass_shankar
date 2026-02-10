# Developer Guide: Adding New Exercises and Modules

This guide provides step-by-step instructions for adding new content to the Shankar Foundation Learning Portal while ensuring automatic progress tracking and consistent navigation.

## 1. Create the Exercise Component

Create your React component in the appropriate directory:
- `src/pages/Grade1/...`
- `src/pages/Grade2/...`

### Required Props
Your component MUST accept at least these two props:
- `onBack`: Function to navigate to the previous view.
- `onNextExercise`: Function to trigger completion and move to the next activity.

### Implementation Pattern
```jsx
export default function MyNewExercise({ onBack, onNextExercise }) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleWin = () => {
    setIsCompleted(true);
    // Success audio/animation here
  };

  return (
    <div>
      {/* Exercise content */}
      
      {isCompleted && (
        <button onClick={onNextExercise}>
          Next Exercise →
        </button>
      )}
    </div>
  );
}
```

## 2. Register in LearningApp.jsx

### Import the component
```javascript
import MyNewExercise from './pages/Grade1/my-path/MyNewExercise';
```

### Add to view logic
In the `render` section of `LearningApp.jsx`, add your new view name:

```jsx
{view.name === 'myNewExercise' && (
  <NavigationWrapper onBack={goToPreviousView}>
    <MyNewExercise 
      onBack={goToPreviousView} 
      onNextExercise={() => { 
        handleComplete('my-new-slug'); 
        goToNextView(); 
      }} 
    />
  </NavigationWrapper>
)}
```

> [!IMPORTANT]
> The string passed to `handleComplete('my-new-slug')` MUST match the `slug` defined in the Supabase `exercises` table.

## 3. Update the Sidebar

Add your new exercise to `src/components/Sidebar.jsx` in the `MENU_STRUCTURE` constant.

```javascript
{ 
  id: 'myNewExercise', 
  label: 'My New Game', 
  type: 'file', 
  icon: '🎮' 
}
```

## 4. Database Entry (Supabase)

Ensure you add a corresponding row to the `exercises` table via the SQL Editor or seed script:

```sql
INSERT INTO exercises (module_id, title, slug, order_index)
VALUES (
  'module-uuid', 
  'My New Game', 
  'my-new-slug', 
  10
);
```

## 5. Verification Checklist
- [ ] Back button returns to the correct overview page.
- [ ] Completion triggers the "Next Exercise" button.
- [ ] Clicking "Next Exercise" updates progress in the `student_progress` table.
- [ ] The next activity loads correctly.
