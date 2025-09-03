"use client";
import Image from "next/image";
import Link from "next/link";
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
        {data && data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
            {data.map((item) => (
              <Link key={item.id} href={`/books/${item.id}`}>
                <CommandItem className="flex flex-col items-start p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex w-full">
                    {item.coverUrl?.length && (
                      <Image
                        src={item.coverUrl}
                        alt={item.title}
                        width={50}
                        height={75}
                        className="mr-3 flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.title}</div>
                      <div className="text-sm text-gray-600 truncate">
                        {item.authors
                          ?.map((author) => author.name)
                          .join(", ") || "Unknown author"}
                      </div>
                      {item.firstPublishYear && (
                        <div className="text-xs text-gray-500">
                          ({item.firstPublishYear})
                        </div>
                      )}
                    </div>
                  </div>
                </CommandItem>
              </Link>
            ))}
          </div>
        )}
      </CommandList>
    </Command>
  );
}
