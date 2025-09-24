"use client";
import { Button } from "@/components";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@/hooks/use-user";

export function UserProfileContent({ userId }: { userId: string | "me" }) {
  const { data: user, isLoading, error } = useUser(userId);

  return (
    <div>
      UserProfileContent for {userId}
      <AddCustomShelfDialog />
    </div>
  );
}

function AddCustomShelfDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Shelf</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New shelf</DialogTitle>
          <DialogDescription>
            Create a shelf that fits your reading habits or stores your
            favorites.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">nice</div>
        </div>

        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
