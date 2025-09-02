import { useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useBooksSearch } from "@/hooks/use-books";

export function BooksSearchCombobox() {
  const [value, setValue] = useState("");

  const { data, isLoading, error } = useBooksSearch(value);

  const isTrulyEmpty =
    !isLoading && !error && value.trim() && (!data || data.length === 0);

  return (
    <Command
      inputMode="text"
      className="rounded-lg border border-gray-400 text-black relative bg-white"
      shouldFilter={false}
    >
      <CommandInput
        className="h-full"
        value={value}
        onValueChange={(e) => setValue(e)}
        placeholder="search..."
      />
      <CommandList className="border-none max-h-96 overflow-auto">
        {isLoading && value.trim() && (
          <CommandItem disabled>Loading...</CommandItem>
        )}
        {error && <CommandItem disabled>Error: {error.message}</CommandItem>}
        {isTrulyEmpty && <CommandEmpty>No results found</CommandEmpty>}
        {data?.map((item) => (
          <CommandItem
            key={item.workKey}
            className="flex flex-col items-start p-2"
          >
            <div className="font-medium">{item.title}</div>
            <div className="text-sm text-gray-600">
              {item.authors?.map((author) => author.name).join(", ") ||
                "Unknown author"}
            </div>
            {item.firstPublishYear && (
              <div className="text-xs text-gray-500">
                ({item.firstPublishYear})
              </div>
            )}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
}
