"use client";
import React from "react";
import { Button } from "@/components/ui/button";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Plus } from "lucide-react";
import { GREEN, GREEN_LIGHT } from "../../../page";
import { useMutationData } from "@/hooks/useMutationData";
import { CreateCategory } from "@/actions/category";
import { toast } from "sonner";
import { CreateCategoryBody } from "@/types/category.types";

const CategoryDialog = () => {
  const { mutate, isPending } = useMutationData(
    ["create-category"],
    CreateCategory,
    "admin-categories",
  );
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    console.log(name);

    if (!name.trim()) {
      toast("Enter name");
      return;
    }

    const payload: CreateCategoryBody = {
      name,
    };

    mutate(payload);
    form.reset();
  };

  return (
    <Dialog>
        <DialogTrigger asChild>
          <Button
            className="gap-2 h-9 text-xs uppercase tracking-wider rounded-sm"
            style={{
              background: `linear-gradient(135deg, ${GREEN}, ${GREEN_LIGHT})`,
              border: "none",
              fontFamily: "'Lato', sans-serif",
            }}
          >
            <Plus size={14} /> Add Category
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Add a new category, to the list of categories
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input type="text" id="name" name="name" placeholder="Ghee" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button
              disabled={isPending}
              type="submit"
              className="gap-2 h-9 text-xs uppercase tracking-wider rounded-sm"
              style={{
                background: `linear-gradient(135deg, ${GREEN}, ${GREEN_LIGHT})`,
                border: "none",
                fontFamily: "'Lato', sans-serif",
              }}
              variant={"default"}
            >
              {isPending ? <Loader size={14} className="animate-spin" /> : "Confirm"}
            </Button>
          </DialogFooter>
          </form>
        </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
