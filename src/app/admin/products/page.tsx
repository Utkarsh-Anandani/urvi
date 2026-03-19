"use client";
import { useState } from "react";
import {
  ActionMenu,
  GOLD,
  GoldDivider,
  GREEN,
  GREEN_LIGHT,
  PageHeader,
} from "../page";
import { Button } from "@/components/ui/button";
import { Loader, Plus, Search, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Field, FieldGroup } from "@/components/ui/field";
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
import FileUpload from "@/components/global/file-upload";
import { useUpload } from "@/hooks/useUpload";
import { toast } from "sonner";
import { CreateProduct, GetAdminProducts } from "@/actions/product";
import { useMutationData } from "@/hooks/useMutationData";
import {
  CreateProductBody,
  GetAdminProductsResponse,
} from "@/types/product.types";
import { useQueryData } from "@/hooks/useQueryData";

type ProductStatus = "Active" | "Out of Stock" | "Low Stock" | "Inactive";
type ImageData = {
  url: string | null;
  position: number;
};

const ProductStatusBadge = ({ status }: { status: ProductStatus }) => {
  const map = {
    Active: { bg: "#dcfce7", color: "#166534" },
    "Out of Stock": { bg: "#fee2e2", color: "#991b1b" },
    "Low Stock": { bg: "#fef9c3", color: "#854d0e" },
    Inactive: { bg: "#fef9c3", color: "#854d0e" },
  };
  const cfg = map[status] || { bg: "#f3f4f6", color: "#374151" };
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        background: cfg.bg,
        color: cfg.color,
        fontFamily: "'Lato', sans-serif",
      }}
    >
      {status}
    </span>
  );
};

const Products = () => {
  const [search, setSearch] = useState("");
  const [addingProduct, setAddingProduct] = useState(false);
  const { upload, isUploading } = useUpload();
  const [imageData, setImageData] = useState<ImageData[]>([]);

  const { mutate, isPending } = useMutationData(
    ["create-product"],
    CreateProduct,
    "admin-products"
  );

  const { data, isFetched } = useQueryData(["admin-products"], () =>
    GetAdminProducts(),
  );
  const { status, data: products } = data as GetAdminProductsResponse;

  const handleFilesUpload = async (files: File[]) => {
    try {
      if (!files?.length) return;

      const filesData = (await upload(files, "products")) ?? [];

      // Separate success & failed uploads
      const failedFiles = filesData.filter(
        (file) => !file?.success || !file?.fileURL,
      );

      if (failedFiles.length > 0) {
        toast(`${failedFiles.length} file(s) failed to upload`);
        return;
      }

      const data = filesData.map((file, index) => ({
        url: file.fileURL,
        position: index,
      }));

      setImageData(data);
    } catch (error) {
      console.error("Upload error:", error);
      toast("Something went wrong during file upload");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const price = Number(formData.get("price"));
      const discountPrice = formData.get("discount")
        ? Number(formData.get("discount"))
        : null;
      const stock = Number(formData.get("stock"));

      const categoryId = null;

      if (!name || !price || stock < 0 || price < 1) {
        toast("Please fill all required fields correctly");
        return;
      }

      if (!imageData.length) {
        toast("Please upload at least one image");
        return;
      }

      const payload: CreateProductBody = {
        name,
        description,
        price,
        discountPrice,
        stock,
        categoryId,
        images: imageData,
      };

      mutate(payload);
      if (!isPending) {
        form.reset();
        setImageData([]);
        setAddingProduct(false);
      }
    } catch (error) {
      console.error(error);
      toast("Something went wrong");
    }
  };
  return (
    <main className="flex-1 overflow-y-auto p-5 lg:p-7">
      <PageHeader
        title="Products"
        subtitle={`${products.length} products in your catalogue`}
        action={
          <Button
            onClick={() => setAddingProduct(true)}
            className="gap-2 h-9 text-xs uppercase tracking-wider rounded-sm"
            style={{
              background: `linear-gradient(135deg, ${GREEN}, ${GREEN_LIGHT})`,
              border: "none",
              fontFamily: "'Lato', sans-serif",
            }}
          >
            <Plus size={14} /> Add Product
          </Button>
        }
      />
      {addingProduct && (
        <Card
          className="border-0 shadow-sm mb-2"
          style={{ outline: "1px solid #f0f0f0", borderRadius: "4px" }}
        >
          <CardHeader>
            <CardTitle>Add Product</CardTitle>
            <CardDescription>
              Add a new product to list it on the website
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleFormSubmit}>
            <CardContent className="flex flex-col-reverse gap-y-4 md:flex-row md:gap-x-4 py-2">
              <FieldGroup>
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
                  <Select name="ctegory">
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
                <Field>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    rows={5}
                    id="description"
                    name="description"
                    placeholder="Organic rice, from the fields of Madhya Pradesh..."
                  />
                </Field>
                <Field>
                  <Label htmlFor="price">Price (in rupees)</Label>
                  <Input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="500"
                  />
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
                <Field>
                  <Label htmlFor="stock">Stock (in units)</Label>
                  <Input
                    type="number"
                    id="stock"
                    name="stock"
                    placeholder="20"
                  />
                </Field>
              </FieldGroup>
              <Field>
                <Label htmlFor="images">Images</Label>
                <FileUpload
                  id="images"
                  accept="image/*"
                  disabled={isUploading}
                  multiple
                  onChange={(files: File[]) => handleFilesUpload(files)}
                />
              </Field>
            </CardContent>
            <CardFooter className="flex flex-row items-center justify-end gap-x-2">
              <Button
                disabled={isPending && isUploading}
                type="submit"
                className="gap-2 h-9 text-xs uppercase tracking-wider rounded-sm"
                style={{
                  background: `linear-gradient(135deg, ${GREEN}, ${GREEN_LIGHT})`,
                  border: "none",
                  fontFamily: "'Lato', sans-serif",
                }}
                variant={"default"}
              >
                {isPending ? <Loader className="animate-spin" /> : "Confirm"}
              </Button>
              <Button
                className="gap-2 h-9 text-xs uppercase tracking-wider rounded-sm"
                style={{
                  fontFamily: "'Lato', sans-serif",
                }}
                variant={"destructive"}
                onClick={() => {
                  setAddingProduct(false);
                  setImageData([]);
                }}
              >
                Cancel
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
      <Card
        className="border-0 shadow-sm"
        style={{ outline: "1px solid #f0f0f0", borderRadius: "4px" }}
      >
        <CardHeader className="pb-3 pt-5 px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="h-9 pl-9 text-sm rounded-sm border-gray-200 bg-gray-50 focus-visible:ring-green-700/20 focus-visible:border-green-700"
                style={{ fontFamily: "'Lato', sans-serif" }}
              />
            </div>
          </div>
          <GoldDivider />
        </CardHeader>
        <CardContent className="px-6 pb-5">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-100">
                {[
                  "ID",
                  "Image",
                  "Name",
                  "Category",
                  "Price",
                  "Stock",
                  "Rating",
                  "Status",
                  "",
                ].map((h) => (
                  <TableHead
                    key={h}
                    className="text-xs uppercase tracking-wider text-gray-400 font-semibold pb-2"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetched &&
                products.map((p) => (
                  <TableRow
                    key={p.id}
                    className="border-gray-50 hover:bg-green-50/30 transition-colors"
                  >
                    <TableCell
                      className="text-xs text-gray-400 py-3"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {p.id.slice(0, 4).toUpperCase()}
                    </TableCell>
                    <TableCell
                      className="text-xs text-gray-400 py-3"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      <img
                        src={p?.image || ""}
                        className="w-auto h-10 rounded-sm"
                      />
                    </TableCell>
                    <TableCell
                      className="font-semibold text-sm text-gray-800 py-3"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {p.name}
                    </TableCell>
                    <TableCell
                      className="text-sm text-gray-500 py-3"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {p.category?.name || ""}
                    </TableCell>
                    <TableCell
                      className="text-sm font-bold py-3"
                      style={{ color: GREEN, fontFamily: "'Lato', sans-serif" }}
                    >
                      {p.price}
                    </TableCell>
                    <TableCell
                      className="text-sm text-gray-600 py-3"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {p.stock}
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1">
                        <Star size={12} fill={GOLD} color={GOLD} />
                        <span
                          className="text-sm text-gray-600"
                          style={{ fontFamily: "'Lato', sans-serif" }}
                        >
                          0.0
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      {p.isActive && p.stock > 20 && (
                        <ProductStatusBadge status={"Active"} />
                      )}
                      {!p.isActive && (
                        <ProductStatusBadge status={"Inactive"} />
                      )}
                      {p.isActive && p.stock < 20 && p.stock > 0 && (
                        <ProductStatusBadge status={"Low Stock"} />
                      )}
                      {p.stock <= 0 && (
                        <ProductStatusBadge status={"Out of Stock"} />
                      )}
                    </TableCell>
                    <TableCell className="py-3">
                      <ActionMenu />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
};

export default Products;
