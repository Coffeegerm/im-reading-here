"use client";
import { useState } from "react";

import { useAuthContext } from "@/components/auth/auth-provider";
import { HeaderBar } from "@/components/common/header-bar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const mock = [
  {
    id: 1,
    name: "John Doe",
  },
  {
    id: 2,
    name: "Jane Smith",
  },
];

function BookSearchCombobox() {
  const [value, setValue] = useState("");

  return (
    <Command
      inputMode="text"
      className="rounded-lg  border-gray-400 text-txtWhite relative"
    >
      <CommandInput
        className="h-full"
        value={value}
        onValueChange={(e) => setValue(e)}
        placeholder="search..."
      />
      {value && (
        <CommandList className="border-none">
          <CommandEmpty>No results found</CommandEmpty>
          <CommandGroup heading="Users">
            {mock.map((item) => {
              return (
                <CommandItem key={item.id}>
                  <span>{item.name}</span>
                  <span>{item.id ?? ""}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      )}
    </Command>
  );
}

export function DashboardContent() {
  const { user } = useAuthContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderBar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Your Profile</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Name:</strong> {user?.name}
                </p>
                <p>
                  <strong>Plan:</strong> {user?.plan}
                </p>
                <p>
                  <strong>Shelves Visibility:</strong> {user?.shelvesVisibleTo}
                </p>
                <p>
                  <strong>Member since:</strong>{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Quick Actions</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="h-20" variant="outline">
                    📚 Browse Books
                  </Button>
                  <Button className="h-20" variant="outline">
                    👥 Join a Club
                  </Button>
                  <Button className="h-20" variant="outline">
                    📖 My Reading Lists
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
