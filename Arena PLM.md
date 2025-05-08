Our frontend system is a React-based single-page application structured for modularity, scalability, and localisation. Here's a high-level breakdown:

### 1. **Global Configuration Layer**

- **ConfigProvider** wraps the entire app and handles core settings like:
    - Theme mode and colour palette
    - Language (i18n)
    - Layout preferences
- Integrated with **React-i18next** for translation, with language files stored as module-based JSONs.

### 2. **Layout & Navigation**

- **Top-level layout** includes:
    - **Head Bar**: Provides global navigation, workspace switcher, user profile, and language/theme toggles.
    - **Router**: Uses React Router for dynamic page rendering based on user role and permissions.
    - **Bottom Bar**: Displays system messages, links, and plugin actions.

### 3. **Page-Level Composition**

- Each page is a self-contained React component.
- Styled with **Styled Components**, with **custom CSS overrides for Ant Design** to match our product branding.
- A dedicated **internal UI team** is progressively replacing Ant Design with in-house components for consistency and performance.
- UI behaviour includes:
    - **Conditional rendering** for permissions, feature flags, and UI states.
    - **Form validation** using Ant Design’s `Form` plus custom hooks for business logic.
    - **Infinite scroll** for data-heavy views, integrated with pagination-aware API calls.
    - **Drag-and-drop** capabilities using `react-dnd`, e.g., for BOM reordering or dashboard layouts.

### 4. **State & Data Management**

- **Redux** manages shared application state, such as:
    - User session and role
    - Workspace and project identifiers
    - Global UI preferences (e.g., theme)
- Component props can also be passed contextually where Redux overhead is unnecessary.

### 5. **Data Fetching Layer**

- Uses a **customised Axios wrapper**:
    - Automatically handles base URL injection, headers, tokens, and error reporting.
    - Enables modular API service files for separation of concerns.

### 6. **Backend Integration**

- The frontend communicates with a Java-based backend exposing **RESTful APIs,** we use Oracle as our database.
- Endpoints follow consistent naming and structure conventions for easy integration and debugging.