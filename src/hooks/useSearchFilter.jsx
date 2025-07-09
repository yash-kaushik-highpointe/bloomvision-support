import { useState, useMemo, useCallback } from "react";

export function useSearchFilter({ items, searchFields, filters }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState(
    Object.keys(filters).reduce((acc, key) => ({ ...acc, [key]: "all" }), {})
  );

  const setFilter = useCallback((filterKey, value) => {
    setSelectedFilters((prev) => ({ ...prev, [filterKey]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedFilters(
      Object.keys(filters).reduce((acc, key) => ({ ...acc, [key]: "all" }), {})
    );
  }, [filters]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        searchFields.some((field) => {
          const value = item[field];
          return (
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });

      // Other filters
      const matchesFilters = Object.entries(selectedFilters).every(
        ([filterKey, filterValue]) => {
          if (filterValue === "all") return true;
          const filterConfig = filters[filterKey];
          return filterConfig && filterConfig.getValue(item) === filterValue;
        }
      );

      return matchesSearch && matchesFilters;
    });
  }, [items, searchTerm, searchFields, selectedFilters, filters]);

  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm !== "" ||
      Object.values(selectedFilters).some((value) => value !== "all")
    );
  }, [searchTerm, selectedFilters]);

  return {
    searchTerm,
    setSearchTerm,
    selectedFilters,
    setFilter,
    clearFilters,
    filteredItems,
    hasActiveFilters,
    resultCount: filteredItems.length,
  };
}
