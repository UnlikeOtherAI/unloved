# unloved — UI Design Spec

Lovable-inspired layout. Pixel-level specification for frontend implementation.

---

## 1. Overall Layout

The UI has **three vertical layers**:

```
App Frame
 ├ Left Sidebar (navigation)
 ├ Main Content
 │   ├ Header Bar
 │   └ Workspace Area
```

---

## 2. Global Layout Grid

```
+--------------------------------------------------------------+
| Sidebar |                   Main Area                        |
|         |                                                    |
|         |   Header                                           |
|         |----------------------------------------------------|
|         |   Console Panel     |     Workspace Preview        |
|         |                     |                              |
|         |                     |                              |
|         |                     |                              |
+--------------------------------------------------------------+
```

---

## 3. Global Dimensions

| Element                | Value  |
| ---------------------- | ------ |
| Sidebar width          | 260px  |
| Header height          | 64px   |
| Chat/Console panel     | 420px  |
| Minimum preview width  | 600px  |

Console panel is **resizable**.

---

## 4. Corner Radius System

Soft rounded corners throughout.

| Element      | Radius |
| ------------ | ------ |
| Cards        | 20px   |
| Buttons      | 12px   |
| Input fields | 14px   |
| Modals       | 24px   |

---

## 5. Color System

### Light Mode

| Token              | Value     |
| ------------------ | --------- |
| Background         | `#F6F7F9` |
| Sidebar            | `#F3F4F6` |
| Card Background    | `#FFFFFF` |
| Divider            | `#E6E8EC` |
| Primary Accent     | `#5B6BFF` |
| Button Hover       | `#4C59E8` |
| Text Primary       | `#0F172A` |
| Text Secondary     | `#6B7280` |

### Dark Mode

| Token              | Value     |
| ------------------ | --------- |
| Background         | `#0B0F19` |
| Card               | `#111827` |
| Text               | `#E5E7EB` |
| Border             | `#1F2937` |
| Accent             | `#6D7DFF` |

---

## 6. Gradient Background (Empty States Only)

| Position | Value                  |
| -------- | ---------------------- |
| Top      | `#E7EAF3`             |
| Middle   | `#5A7CFF`             |
| Bottom   | `#FF4DA3` → `#FF4D4D` |

Blur radius: `120px`

Used **only** for empty/landing states.

---

## 7. Shadow System

| Context        | Value                              |
| -------------- | ---------------------------------- |
| Cards          | `0 8px 24px rgba(0,0,0,0.08)`     |
| Hover          | `0 12px 32px rgba(0,0,0,0.12)`    |
| Floating input | `0 10px 40px rgba(0,0,0,0.12)`    |

---

## 8. Typography

**Font family:** `Inter`

| Use            | Size | Weight |
| -------------- | ---- | ------ |
| Main heading   | 28px | 600    |
| Section header | 20px | 600    |
| Body text      | 14px | 400    |
| Small labels   | 12px | 500    |
| Input text     | 16px | 400    |

---

## 9. Icon System

**Library:** `lucide-react`

| Usage         | Size |
| ------------- | ---- |
| Sidebar icons | 20px |
| Buttons       | 18px |
| Input icons   | 16px |

**Stroke width:** `1.8px`
**Style:** outline, rounded caps

---

## 10. Sidebar

```
width: 260px
background: #F3F4F6
border-right: 1px solid #E6E8EC
padding: 16px
```

**Layout order:**

1. Logo
2. Workspace selector
3. Navigation
4. Projects
5. Recents
6. Footer

---

## 11. Sidebar Item

```
height: 36px
padding: 10px 12px
```

**Hover:**

```
background: #E9EBF0
border-radius: 10px
```

**Active:**

```
background: #FFFFFF
box-shadow: 0 2px 8px rgba(0,0,0,0.05)
```

---

## 12. Burger Menu (Top Left)

```
position: left: 16px, top: 16px
icon: 20px
button radius: 10px
hover background: #E5E7EB
```

**Menu items:**

- Settings
- Theme
- Devices
- Config

---

## 13. Header Bar

```
height: 64px
padding: 0 24px
```

**Layout:**

```
[burger]   [URL bar]                     [Rebuild]
```

---

## 14. URL Bar

```
width: 420px
height: 40px
border: 1px solid #E6E8EC
border-radius: 12px
padding: 0 14px
background: #FFFFFF
font-size: 14px
```

---

## 15. Rebuild Button

Primary action button.

```
height: 40px
padding: 0 18px
border-radius: 12px
background: #5B6BFF
color: white
hover: #4C59E8
```

**Icon:** refresh icon (left of label)

---

## 16. Console Panel (Left Column)

Replaces Lovable's chat panel.

```
width: 420px
background: #FFFFFF
border-right: 1px solid #E6E8EC
```

### Terminal Container

```
renderer: xterm.js
padding: 16px
font-family: JetBrains Mono
font-size: 13px
background: #0D1117
color: #E6EDF3
border-radius: 12px
```

---

## 17. Console Input

```
height: 56px
border-radius: 16px
box-shadow: 0 8px 24px rgba(0,0,0,0.08)
padding: 16px
font-size: 14px
```

---

## 18. Workspace Area

Right side container.

```
flex: 1
background: #F6F7F9
padding: 24px
```

---

## 19. Preview Frame

```
background: white
border-radius: 20px
overflow: hidden
box-shadow: 0 12px 32px rgba(0,0,0,0.08)
```

**Inside:**

```
iframe { width: 100%; height: 100%; }
```

---

## 20. Preview Toolbar

Top of preview area.

```
height: 44px
background: #F8FAFC
border-bottom: 1px solid #E6E8EC
```

**Buttons:** Back, Forward, Refresh

```
button size: 32px
border-radius: 8px
```

---

## 21. Buttons

**Standard:**

```
height: 36px
padding: 0 14px
border-radius: 12px
font-size: 14px
```

**Variants:**

| Variant   | Background    |
| --------- | ------------- |
| Primary   | `#5B6BFF`     |
| Secondary | `#E5E7EB`     |
| Ghost     | `transparent` |

---

## 22. Input Fields

```
height: 40px
border-radius: 14px
border: 1px solid #E5E7EB
```

**Focus:**

```
border-color: #5B6BFF
box-shadow: 0 0 0 3px rgba(91,107,255,0.2)
```

---

## 23. Animation

| Interaction  | Duration |
| ------------ | -------- |
| Hover        | 150ms ease |
| Panel resize | 200ms ease |

---

## 24. Mobile Adaptation

Phone layout removes sidebar.

**Header:** URL + rebuild only.

**Modes (toggled):**

```
[ Chat ] [ Work Area ]
```

**Chat mode:**

```
┌─────────────────┐
│ terminal output  │
│                  │
├─────────────────┤
│ message input    │
│            [Send]│
└─────────────────┘
```

**Work Area mode:**

```
┌─────────────────┐
│ ← → ↻  address  │
├─────────────────┤
│   preview        │
├─────────────────┤
│          Rebuild │
└─────────────────┘
```

---

## 25. Visual Fidelity Target

Target closeness to Lovable UI: **~95%**

**Differences from Lovable:**

- Chat replaced by terminal (xterm.js)
- Sidebar simplified (no project list)
- Preview toolbar added (back/forward/refresh)

---

## 26. Tailwind Design Tokens

### Colors (`tailwind.config.ts`)

```ts
colors: {
  bg: {
    DEFAULT: '#F6F7F9',
    dark: '#0B0F19',
  },
  sidebar: {
    DEFAULT: '#F3F4F6',
    hover: '#E9EBF0',
    active: '#FFFFFF',
  },
  card: {
    DEFAULT: '#FFFFFF',
    dark: '#111827',
  },
  divider: {
    DEFAULT: '#E6E8EC',
    dark: '#1F2937',
  },
  accent: {
    DEFAULT: '#5B6BFF',
    hover: '#4C59E8',
    dark: '#6D7DFF',
    ring: 'rgba(91,107,255,0.2)',
  },
  text: {
    primary: '#0F172A',
    secondary: '#6B7280',
    dark: '#E5E7EB',
  },
  terminal: {
    bg: '#0D1117',
    text: '#E6EDF3',
  },
}
```

### Border Radius

```ts
borderRadius: {
  card: '20px',
  button: '12px',
  input: '14px',
  modal: '24px',
  sidebar: '10px',
  preview: '8px',
}
```

### Box Shadow

```ts
boxShadow: {
  card: '0 8px 24px rgba(0,0,0,0.08)',
  hover: '0 12px 32px rgba(0,0,0,0.12)',
  float: '0 10px 40px rgba(0,0,0,0.12)',
  subtle: '0 2px 8px rgba(0,0,0,0.05)',
}
```

### Font Size

```ts
fontSize: {
  heading: ['28px', { fontWeight: '600' }],
  section: ['20px', { fontWeight: '600' }],
  body: ['14px', { fontWeight: '400' }],
  label: ['12px', { fontWeight: '500' }],
  input: ['16px', { fontWeight: '400' }],
  terminal: ['13px', { fontWeight: '400' }],
}
```

### Font Family

```ts
fontFamily: {
  sans: ['Inter', 'sans-serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```
