import { ResponseFilters } from "../types";

export const matchesFilters = (question: any, filters: ResponseFilters): boolean => {
  return filters.every(filter => {
    // Directly compare the filter criteria with the question properties
    const { id, condition, value } = filter;
    if (question.id !== id) return false; // If the question ID doesn't match, skip it

    switch (condition) {
      case 'equals': return question.value === value;
      case 'does_not_equal': return question.value !== value;
      case 'greater_than': 
        // Assuming question.value is a string that can be converted to a Date
        return new Date(question.value) > new Date(value);
      case 'less_than': 
        // Assuming question.value is a string that can be converted to a Date
        return new Date(question.value) < new Date(value);
      default: return false;
    }
  });
};
