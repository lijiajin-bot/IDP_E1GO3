@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@layer components {
  .sidebar-link {
    @apply flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer;
  }

  .sidebar-link-active {
    @apply bg-utm-maroon text-white shadow-md;
  }

  .sidebar-link-inactive {
    @apply text-gray-300 hover:bg-utm-maroon/20 hover:text-white;
  }
}

@layer utilities {
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
}
