# Project Setup: SPK WP & SAW (Laravel, Inertia, Vue 3)

## System Overview
Build a Decision Support System (SPK) using **Weighted Product (WP)** and **Simple Additive Weighting (SAW)** methods.
- **Backend:** Laravel 11
- **Frontend:** Vue 3 (Composition API) with Inertia.js
- **Styling:** Tailwind CSS

## Directory Structure Implementation
Please generate the following file structure and scaffold each file with a basic functional template (Script Setup for Vue).

### 1. Core & Layouts
- `resources/js/app.js`: Initialize Inertia app with Vue 3.
- `resources/views/app.blade.php`: Root Blade template with `@inertia` and Vite directives.
- `resources/js/Layouts/AppLayout.vue`: Main wrapper containing `<Sidebar />`, `<Navbar />`, and `<slot />`.
- `resources/js/Components/`:
    - `Sidebar.vue`: Navigation links grouped by Role (Admin, Petugas, Manager).
    - `Navbar.vue`: User profile and logout toggle.
    - `Card.vue`, `Table.vue`, `Modal.vue`, `Pagination.vue`, `Loading.vue`: Base UI components using Tailwind.

### 2. Admin Module (Management)
- `Pages/Admin/Dashboard.vue`: Statistics overview (Total Kriteria, Alternatif, User).
- `Pages/Admin/Kriteria/`: `Index.vue`, `Create.vue`, `Edit.vue` (Fields: Nama, Bobot, Type [Benefit/Cost]).
- `Pages/Admin/Alternatif/`: `Index.vue`, `Create.vue`, `Edit.vue` (Data entitas yang dinilai).
- `Pages/Admin/Skenario/`: 
    - `Index.vue`, `Create.vue`, `Edit.vue`: Configuration for different WP/SAW calculation sets.
    - `Bobot.vue`: Specific interface for adjusting weight preferences.
- `Pages/Admin/User/`: `Index.vue`, `Create.vue`, `Edit.vue` (User management & Role assignment).

### 3. Petugas Module (Data Entry)
- `Pages/Petugas/Dashboard.vue`: Task list overview.
- `Pages/Petugas/Penilaian/`: `Index.vue`, `Create.vue`, `Edit.vue` (Inputting matrix values for each Alternatif based on Kriteria).

### 4. Manager Module (Analysis & Reports)
- `Pages/Manager/Dashboard.vue`: High-level summary.
- `Pages/Manager/SPK/`:
    - `Index.vue`: Method selection.
    - `Ranking.vue`: Final scores and rank list.
    - `Perbandingan.vue`: Side-by-side comparison of WP vs SAW results.
    - `Sensitivitas.vue`: Analysis of how weight changes affect rankings.
    - `BandingkanPeriode.vue`: Comparison of results across different timeframes/scenarios.
- `Pages/Manager/Laporan/`: `Index.vue` (List of generated reports), `Detail.vue` (Printable view).

### 5. Utilities & Errors
- `resources/js/Utils/helpers.js`: Functions for number formatting and SPK formula placeholders.
- `Pages/Errors/`: `403.vue` (Unauthorized), `404.vue` (Not Found).

---

## Technical Instructions for File Generation:

1. **Inertia Links:** Use `<Link :href="route('name')">` for all internal navigation.
2. **Components:** All Vue components must use `<script setup>`.
3. **Props:** Ensure Pages receive data via props (e.g., `const props = defineProps(['data'])`).
4. **Tailwind:** Use standard Tailwind classes for a clean, professional dashboard look (Sidebar: Slate-900, Primary: Blue-600).
5. **Auth:** `resources/views/auth/login.blade.php` should be a standard Blade file with Tailwind styling.

---

## Task Action
Please create the directory structure above and generate boilerplate code for `AppLayout.vue`, `Sidebar.vue`, and the `Index.vue` for `Kriteria` and `Penilaian` to get the project started.