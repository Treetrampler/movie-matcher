"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/catalogue/dialogue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export interface GenreFilterOptions {
  selectedGenres: string[];
}

// Define the props for the FilterModal component
interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: GenreFilterOptions) => void;
  currentFilters: GenreFilterOptions;
}

// Define the available genres for filtering
const availableGenres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "TV Movie",
  "Thriller",
  "War",
  "Western",
];

export function FilterModal({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
}: FilterModalProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    currentFilters.selectedGenres,
  );

  // Update local state when currentFilters change
  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setSelectedGenres(currentFilters.selectedGenres);
  }, [currentFilters]);

  // Toggle genre selection
  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  // Apply filters and close the modal
  const handleApplyFilters = () => {
    onApplyFilters({
      selectedGenres,
    });
    onClose();
  };

  // Clear all selected genres

  const handleClearFilters = () => {
    setSelectedGenres([]);
  };

  const hasActiveFilters = selectedGenres.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Filter by Genre
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Genre Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Select Genres</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {availableGenres.map((genre) => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox
                    id={genre}
                    checked={selectedGenres.includes(genre)}
                    onCheckedChange={() => handleGenreToggle(genre)}
                    className="border-gray-300"
                  />
                  <label
                    htmlFor={genre}
                    className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {genre}
                  </label>
                </div>
              ))}
            </div>

            {/* Selected Genres Display */}
            {selectedGenres.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-medium">
                  Selected Genres ({selectedGenres.length}):
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedGenres.map((genre) => (
                    <Badge
                      key={genre}
                      variant="default"
                      className="flex items-center gap-1"
                    >
                      {genre}
                      <button
                        onClick={() => handleGenreToggle(genre)}
                        className="ml-1 rounded-full p-0.5 hover:bg-neutral-700"
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between border-t pt-4">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
            className="flex items-center gap-2"
          >
            Clear Genres
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleApplyFilters}
              className="bg-black text-white"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
