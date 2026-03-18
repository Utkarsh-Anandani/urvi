import FileUpload from "@/components/global/file-upload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

type Props = {
  children: React.ReactNode;
  title: string;
  description: string;
};

const AddProductDialog = ({ children, title, description }: Props) => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-sm max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {/* <DialogDescription>{description}</DialogDescription> */}
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="images">Images</Label>
              <FileUpload id="images" accept="image/*" variant="compact" multiple />
            </Field>
            <div className="grid grid-cols-2 gap-x-1">
            <Field>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Organic Rice - 1kg"
              />
            </Field>
            <Field>
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="ghee">Ghee</SelectItem>
                    <SelectItem value="millets">Millets</SelectItem>
                    <SelectItem value="flour">Flour</SelectItem>
                    <SelectItem value="spices">Spices</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            </div>
            <Field>
              <Label htmlFor="description">Description</Label>
              <Textarea
                rows={5}
                id="description"
                name="description"
                placeholder="Organic rice, from the fields of Madhya Pradesh..."
              />
            </Field>
            <div className="grid grid-cols-2 gap-x-1">
            <Field>
              <Label htmlFor="price">Price (in rupees)</Label>
              <Input type="number" id="price" name="price" placeholder="500" />
            </Field>
            <Field>
              <Label htmlFor="discount">Discount Price (in rupees)</Label>
              <Input
                type="number"
                id="discount"
                name="discount"
                placeholder="400"
              />
            </Field>
            </div>
            <Field>
              <Label htmlFor="stock">Stock</Label>
              <Input type="number" id="stock" name="stock" placeholder="20" />
            </Field>
          </FieldGroup>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AddProductDialog;
