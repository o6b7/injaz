// Updated utils.ts with better dark mode colors
import { TableStyles } from "react-data-table-component";

export const dataGridClassNames =
  "border border-gray-200 bg-white shadow dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200";

  export const dataGridSxStyles = (isDarkMode: boolean) => {
  return {
    "& .MuiDataGrid-columnHeaders": {
      color: `${isDarkMode ? "#e5e7eb" : ""}`,
      '& [role="row"] > *': {
        backgroundColor: `${isDarkMode ? "#1d1f21" : "white"}`,
        borderColor: `${isDarkMode ? "#2d3135" : ""}`,
      },
    },
    "& .MuiIconbutton-root": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`,
    },
    "& .MuiTablePagination-root": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`,
    },
    "& .MuiTablePagination-selectIcon": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`,
    },
    "& .MuiDataGrid-cell": {
      border: "none",
    },
    "& .MuiDataGrid-row": {
      borderBottom: `1px solid ${isDarkMode ? "#2d3135" : "e5e7eb"}`,
    },
    "& .MuiDataGrid-withBorderColor": {
      borderColor: `${isDarkMode ? "#2d3135" : "e5e7eb"}`,
    },
  };
};


// Enhanced status badge colors with better contrast
export const statusColors: Record<string, { bg: string; text: string }> = {
  "مكتملة": { 
    bg: "bg-green-100 dark:bg-green-900/40", 
    text: "text-green-800 dark:text-green-200" 
  },
  "قيد المراجعة": { 
    bg: "bg-yellow-100 dark:bg-yellow-900/40", 
    text: "text-yellow-800 dark:text-yellow-200" 
  },
  "قيد التنفيذ": { 
    bg: "bg-blue-100 dark:bg-blue-900/40", 
    text: "text-blue-800 dark:text-blue-200" 
  },
  "قيد التخطيط": { 
    bg: "bg-gray-100 dark:bg-gray-800/80", 
    text: "text-gray-800 dark:text-gray-200" 
  },
};

// Enhanced priority colors
export const priorityColors: Record<string, string> = {
  "عالية": "text-red-600 dark:text-red-300",
  "متوسطة": "text-orange-600 dark:text-orange-300",
  "منخفضة": "text-green-600 dark:text-green-300",
};

// Improved table styles with better dark mode contrast
export const getCustomTableStyles = (isDarkMode: boolean): TableStyles => ({
  table: {
    style: {
      backgroundColor: isDarkMode ? "#111827" : "white",
      color: isDarkMode ? "#f3f4f6" : "#374151",
    },
  },
  headRow: {
    style: {
      backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb",
      color: isDarkMode ? "#f9fafb" : "#374151",
      borderBottomColor: isDarkMode ? "#374151" : "#e5e7eb",
      fontSize: "14px",
      fontWeight: "600",
      minHeight: "52px",
    },
  },
  headCells: {
    style: {
      backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb",
      color: isDarkMode ? "#f9fafb" : "#374151",
      borderRightColor: isDarkMode ? "#374151" : "#e5e7eb",
      fontSize: "14px",
      fontWeight: "600",
      paddingLeft: "8px",
      paddingRight: "8px",
    },
  },
  cells: {
    style: {
      paddingLeft: "8px",
      paddingRight: "8px",
      fontSize: "14px",
      backgroundColor: isDarkMode ? "#111827" : "white",
      color: isDarkMode ? "#f3f4f6" : "#374151",
    },
  },
  rows: {
    style: {
      backgroundColor: isDarkMode ? "#111827" : "white",
      color: isDarkMode ? "#f3f4f6" : "#374151",
      borderBottomColor: isDarkMode ? "#374151" : "#f3f4f6",
      minHeight: "52px",
      "&:hover": {
        backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb",
      },
    },
    stripedStyle: {
      backgroundColor: isDarkMode ? "#1a1f2e" : "#f8f9fa",
    },
  },
  pagination: {
    style: {
      backgroundColor: isDarkMode ? "#111827" : "white",
      color: isDarkMode ? "#d1d5db" : "#6b7280",
      borderTopColor: isDarkMode ? "#374151" : "#e5e7eb",
      fontSize: "14px",
    },
    pageButtonsStyle: {
      color: isDarkMode ? "#d1d5db" : "#6b7280",
      fill: isDarkMode ? "#d1d5db" : "#6b7280",
      "&:disabled": {
        color: isDarkMode ? "#4b5563" : "#d1d5db",
        fill: isDarkMode ? "#4b5563" : "#d1d5db",
      },
      "&:hover:not(:disabled)": {
        backgroundColor: isDarkMode ? "#374151" : "#e5e7eb",
      },
    },
  },
});