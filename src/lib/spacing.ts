// Common spacing utilities for consistent layout across the application

export const spacing = {
  // Page containers
  pageContainer: {
    p: 4, // 32px
    width: 1,
    maxWidth: "none",
    overflow: "hidden",
  },

  // Section spacing
  sectionSpacing: {
    mb: 6, // 48px
  },

  // Card grids
  cardGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 3, // 24px
    mb: 6, // 48px
    width: 1,
  },

  // Card items
  cardItem: {
    flex: "1 1 280px",
    minWidth: "280px",
  },

  // Card styling
  card: {
    height: "100%",
    p: 1, // 8px
  },

  // Card content
  cardContent: {
    textAlign: "center" as const,
    p: 4, // 32px
  },

  // Icons
  icon: {
    fontSize: 56,
    mb: 3, // 24px
  },

  // Typography
  title: {
    fontWeight: 600,
    mb: 3, // 24px
  },

  // Buttons
  button: {
    size: "large" as const,
    sx: {
      px: 4, // 32px
      py: 1.5, // 12px
    },
  },

  // Headers
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 6, // 48px
  },

  // User info
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: 4, // 32px
  },

  // Avatar
  avatar: {
    width: 100,
    height: 100,
  },

  // Chip
  chip: {
    fontSize: "1rem",
    px: 2, // 16px
    py: 1, // 8px
  },
};
