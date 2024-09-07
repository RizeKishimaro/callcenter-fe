import { useMemo } from "react";

export function useInitials(name: string) {
  return useMemo(() => {
    if (!name) return "";

    // Split the name by spaces to separate the words
    const words = name.trim().split(" ");

    // Take the first letter of the first word and the first letter of the last word
    const initials =
      words.length > 1
        ? `${words[0][0].toUpperCase()}${words[
            words.length - 1
          ][0].toUpperCase()}`
        : `${words[0][0].toUpperCase()}`; // Handle single-word names

    return initials;
  }, [name]); // Recompute only when `name` changes
}
