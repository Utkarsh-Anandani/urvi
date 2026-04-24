"use client";
import { useRef, useState } from "react";
import { ActionMenu, PageHeader } from "../page";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader, Plus, Star, X } from "lucide-react";
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
import {
  CreateProduct,
  DeleteProduct,
  GetAdminProducts,
  UpdateProduct,
} from "@/actions/product";
import { useMutationData } from "@/hooks/useMutationData";
import {
  CreateProductBody,
  GetAdminProductsResponse,
  Product,
  UpdateProductBody,
  Variant,
} from "@/types/product.types";
import { useQueryData } from "@/hooks/useQueryData";
import { GetAdminCategories } from "@/actions/category";
import { GetCategoriesResponse } from "@/types/category.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TagInput } from "@/components/global/tag-input";
import { BROWN, fmt, LIGHT_ORANGE, ORANGE } from "@/lib/helper";
import { MediaType } from "@prisma/client";
import Image from "next/image";

type ProductStatus = "Active" | "Out of Stock" | "Low Stock" | "Inactive";
type ImageData = {
  url: string | null;
  position: number;
};

type PageSection = {
  id?: string;
  title?: string | null;
  subtitle?: string | null;
  type: MediaType;
  mediaURL: string;
  order: number;
};

type PageSectionInput = {
  title?: string | null;
  subtitle?: string | null;
  type: MediaType;
  mediaURL: string;
};

const ProductStatusBadge = ({ status }: { status: ProductStatus }) => {
  const map = {
    Active: { bg: "#dcfce7", color: "#166534" },
    "Out of Stock": { bg: "#fee2e2", color: "#991b1b" },
    "Low Stock": { bg: "#fef9c3", color: "#854d0e" },
    Inactive: { bg: "#e5e5e5", color: "#a3a3a3" },
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
  const [addingProduct, setAddingProduct] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { upload, isUploading } = useUpload();
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isVariantDialogOpen, setIsVariantDialogOpen] = useState(false);
  const [variantForm, setVariantForm] = useState({
    name: "",
    price: "",
    discountPrice: "",
    stock: "",
  });
  const [pageSections, setPageSections] = useState<PageSection[]>([]);
  const [isPageSectionDialogOpen, setIsPageSectionDialogOpen] = useState(false);
  const [pageSectionForm, setPageSectionForm] = useState<PageSectionInput>({
    title: "",
    subtitle: "",
    type: "IMAGE",
    mediaURL: "",
  });
  const [tags, setTags] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const { mutate: addProduct, isPending: isAdding } = useMutationData(
    ["create-product"],
    CreateProduct,
    ["admin-products"],
    () => {
      formRef.current?.reset();
      setImageData([]);
      setVariants([]);
      setSelectedCategory(null);
      setAddingProduct(false);
      setEditingProduct(null);
      setTags([]);
      setSelectedImageIndex(null);
      setVariantForm({
        name: "",
        price: "",
        discountPrice: "",
        stock: "",
      });
      setPageSections([]);
    },
  );

  const { mutate: updateProduct, isPending: isUpdating } = useMutationData(
    ["edit-product"],
    UpdateProduct,
    ["admin-products"],
    () => {
      formRef.current?.reset();
      setImageData([]);
      setVariants([]);
      setSelectedCategory(null);
      setAddingProduct(false);
      setEditingProduct(null);
      setTags([]);
      setSelectedImageIndex(null);
      setVariantForm({
        name: "",
        price: "",
        discountPrice: "",
        stock: "",
      });
      setPageSections([]);
    },
  );

  const { mutate: deleteProduct } = useMutationData(
    ["delete-product"],
    DeleteProduct,
    ["admin-products"],
  );

  const { data, isFetched } = useQueryData(["admin-products"], () =>
    GetAdminProducts(),
  );
  const { data: products } = data as GetAdminProductsResponse;

  const { data: categoryData, isFetching: isFetchingCategories } = useQueryData(
    ["admin-categories"],
    () => GetAdminCategories(),
  );
  const { data: categories } = categoryData as GetCategoriesResponse;

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

      return data;
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

      if (!name || !selectedCategory) {
        toast("Please fill all required fields correctly");
        return;
      }

      if (!imageData.length) {
        toast("Please upload at least one image");
        return;
      }

      if (!editingProduct) {
        const payload: CreateProductBody = {
          name,
          description,
          categoryId: selectedCategory,
          images: imageData,
          variants: variants,
          tags,
          pageSections: pageSections.map(({ id, ...rest }) => rest),
        };
        addProduct(payload);
      } else {
        const payload: UpdateProductBody = {
          id: editingProduct.id,
          name,
          description,
          categoryId: selectedCategory,
          images: imageData,
          variants: variants,
          tags,
          pageSections: pageSections.map(({ id, ...rest }) => rest),
        };
        updateProduct(payload);
      }
    } catch (error) {
      console.error(error);
      toast("Something went wrong");
    }
  };

  const moveImage = (direction: "left" | "right") => {
    if (selectedImageIndex === null) return;

    setImageData((prev) => {
      const newArr = [...prev];

      const targetIndex =
        direction === "left" ? selectedImageIndex - 1 : selectedImageIndex + 1;

      if (targetIndex < 0 || targetIndex >= newArr.length) return prev;

      [newArr[selectedImageIndex], newArr[targetIndex]] = [
        newArr[targetIndex],
        newArr[selectedImageIndex],
      ];

      const updated = newArr.map((img, i) => ({
        ...img,
        position: i,
      }));

      setSelectedImageIndex(targetIndex);

      return updated;
    });
  };

  const removeImage = () => {
    if (selectedImageIndex === null) return;

    setImageData((prev) => {
      const newArr = prev.filter((_, i) => i !== selectedImageIndex);

      const updated = newArr.map((img, i) => ({
        ...img,
        position: i,
      }));

      return updated;
    });

    setSelectedImageIndex(null);
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
              background: `linear-gradient(135deg, ${ORANGE}, ${LIGHT_ORANGE})`,
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
            <CardTitle>
              {editingProduct ? "Edit Product" : "Add Product"}
            </CardTitle>
            <CardDescription>
              Add a new product to list it on the website
            </CardDescription>
          </CardHeader>
          <form ref={formRef} onSubmit={handleFormSubmit}>
            {imageData.length > 0 && (
              <div className="flex flex-col items-center gap-5">
                {/* Image Preview Row */}
                <div className="flex flex-row items-center gap-3 overflow-x-auto">
                  {imageData.map((image, index) => (
                    <div
                      className={`relative cursor-pointer rounded-lg ${
                        selectedImageIndex === index
                          ? "border-4 border-orange-400"
                          : ""
                      }`}
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        className="w-25 h-25 rounded-sm object-cover"
                        src={image.url || ""}
                      />

                      {/* Position Badge */}
                      <div
                        style={{ backgroundColor: ORANGE }}
                        className="flex items-center justify-center w-5 h-5 rounded-full top-1 right-1 absolute text-white text-xs"
                      >
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Controls */}
                <div className="flex flex-row items-center gap-5">
                  <Button
                    type="button"
                    onClick={() => moveImage("left")}
                    disabled={
                      selectedImageIndex === null || selectedImageIndex === 0
                    }
                  >
                    <ChevronLeft />
                  </Button>

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={removeImage}
                    disabled={selectedImageIndex === null}
                  >
                    <X />
                  </Button>

                  <Button
                    type="button"
                    onClick={() => moveImage("right")}
                    disabled={
                      selectedImageIndex === null ||
                      selectedImageIndex === imageData.length - 1
                    }
                  >
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            )}
            <CardContent className="flex flex-col-reverse gap-y-4 md:flex-row md:gap-x-4 py-2">
              <FieldGroup>
                <Field>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    defaultValue={editingProduct?.name}
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Organic Rice - 1kg"
                  />
                </Field>
                <Field>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={selectedCategory || ""}
                    onValueChange={(value) => setSelectedCategory(value)}
                    disabled={isFetchingCategories}
                    name="category"
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    defaultValue={editingProduct?.description || ""}
                    rows={5}
                    id="description"
                    name="description"
                    placeholder="Organic rice, from the fields of Madhya Pradesh..."
                  />
                </Field>
                <Field>
                  <Label htmlFor="tags">Tags</Label>
                  <TagInput id="tags" value={tags} onChange={setTags} />
                </Field>
                <Field>
                  <div className="flex flex-row items-center justify-between">
                    <Label htmlFor="variants">{`Variants (${variants.length})`}</Label>
                    <Button
                      type="button"
                      onClick={() => setIsVariantDialogOpen(true)}
                      className="gap-2 h-9 text-xs uppercase tracking-wider rounded-sm"
                      style={{
                        background: `linear-gradient(135deg, ${ORANGE}, ${LIGHT_ORANGE})`,
                        border: "none",
                        fontFamily: "'Lato', sans-serif",
                      }}
                    >
                      Add Varaint
                    </Button>
                  </div>
                  {variants.length > 0 ? (
                    <div id="variants" className="mt-3 flex flex-col gap-2">
                      {variants.map((v) => (
                        <div
                          key={v.name}
                          onClick={() => {
                            setVariantForm({
                              name: v.name,
                              price: v.price.toString(),
                              discountPrice: v.discountPrice?.toString() || "",
                              stock: v.stock.toString(),
                            });
                            setIsVariantDialogOpen(true);
                            setVariants((prev) =>
                              prev.filter((x) => x.name !== v.name),
                            );
                          }}
                          className="flex items-center justify-between border p-2 rounded-md cursor-pointer"
                        >
                          <div className="text-sm">
                            <p className="font-medium">{v.name}</p>
                            <p className="text-xs text-gray-500">
                              ₹{v.price} | Stock: {v.stock}
                            </p>
                          </div>

                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setVariants((prev) =>
                                prev.filter((x) => x.name !== v.name),
                              );
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full text-center text-neutral-300 text-sm">
                      No variants added yet
                    </div>
                  )}
                </Field>
                <Field>
                  <div className="flex flex-row items-center justify-between">
                    <Label htmlFor="page-sections">{`Page Sections (${pageSections.length})`}</Label>
                    <Button
                      type="button"
                      onClick={() => setIsPageSectionDialogOpen(true)}
                      className="gap-2 h-9 text-xs uppercase tracking-wider rounded-sm"
                      style={{
                        background: `linear-gradient(135deg, ${ORANGE}, ${LIGHT_ORANGE})`,
                        border: "none",
                        fontFamily: "'Lato', sans-serif",
                      }}
                    >
                      Add Section
                    </Button>
                  </div>
                  {pageSections.length > 0 ? (
                    <div
                      id="page-sections"
                      className="mt-3 flex flex-col gap-2"
                    >
                      {pageSections.map((ps, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setPageSectionForm({
                              title: ps?.title || "",
                              subtitle: ps?.subtitle || "",
                              type: ps.type,
                              mediaURL: ps.mediaURL,
                            });
                            setIsPageSectionDialogOpen(true);
                            setPageSections((prev) =>
                              prev.filter((x) => x.id !== ps.id)
                            );
                          }}
                          className="flex items-center justify-between border p-2 rounded-md cursor-pointer"
                        >
                          <div className="text-sm">
                            <p className="font-medium">
                              {ps?.title || "No Title"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {ps?.subtitle || "No Subtitle"}
                            </p>
                          </div>

                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPageSections((prev) =>
                                prev.filter((x) => x.id !== ps.id)
                              );
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full text-center text-neutral-300 text-sm">
                      No sections added yet
                    </div>
                  )}
                </Field>
              </FieldGroup>
              <Field>
                <Label htmlFor="images">Images</Label>
                <FileUpload
                  id="images"
                  accept="image/*"
                  disabled={isUploading}
                  multiple
                  onFilesAdded={async (files: File[]) => {
                    const data = await handleFilesUpload(files);
                    setImageData((prev) => [...prev, ...(data || [])]);
                  }}
                />
              </Field>
            </CardContent>
            <CardFooter className="flex flex-row items-center justify-end gap-x-2">
              <Button
                disabled={isAdding || isUploading || isUpdating}
                type="submit"
                className="gap-2 h-9 text-xs uppercase tracking-wider rounded-sm"
                style={{
                  background: `linear-gradient(135deg, ${ORANGE}, ${LIGHT_ORANGE})`,
                  border: "none",
                  fontFamily: "'Lato', sans-serif",
                }}
                variant={"default"}
              >
                {isAdding || isUpdating ? (
                  <Loader className="animate-spin" />
                ) : editingProduct ? (
                  "Update"
                ) : (
                  "Confirm"
                )}
              </Button>
              <Button
                className="gap-2 h-9 text-xs uppercase tracking-wider rounded-sm"
                style={{
                  fontFamily: "'Lato', sans-serif",
                }}
                variant={"destructive"}
                onClick={() => {
                  setAddingProduct(false);
                  setEditingProduct(null);
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
        {/* <CardHeader className="pb-3 pt-5 px-6">
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
        </CardHeader> */}
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
                        src={p.images ? p?.images[0].url : ""}
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
                      style={{ color: BROWN, fontFamily: "'Lato', sans-serif" }}
                    >
                      {fmt(p.price)}
                    </TableCell>
                    <TableCell
                      className="text-sm text-gray-600 py-3"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {p.stock}
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1">
                        <Star size={12} fill={ORANGE} color={ORANGE} />
                        <span
                          className="text-sm text-gray-600"
                          style={{ fontFamily: "'Lato', sans-serif" }}
                        >
                          {p.avgRating}
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
                      {p.isActive && p.stock <= 0 && (
                        <ProductStatusBadge status={"Out of Stock"} />
                      )}
                    </TableCell>
                    <TableCell className="py-3">
                      <ActionMenu
                        onEdit={() => {
                          setEditingProduct(p);
                          setAddingProduct(true);

                          setSelectedCategory(
                            p?.category?.id ? p.category?.id : null,
                          );

                          setImageData(
                            p.images
                              ? p.images?.map((image) => ({
                                  url: image.url,
                                  position: image.position,
                                }))
                              : [],
                          );

                          setVariants(p.variants);
                          setPageSections(p?.productPageSections ? p.productPageSections : []);
                          setTags(p.tags);
                        }}
                        onDelete={() => {
                          deleteProduct(p.id);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={isVariantDialogOpen} onOpenChange={setIsVariantDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Variant</DialogTitle>
            <DialogDescription>
              Add a variant like size, weight, or type
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <Label htmlFor="var-name">Name</Label>
            <Input
              id="var-name"
              placeholder="Variant Name (e.g. 1kg / Large)"
              value={variantForm.name}
              onChange={(e) =>
                setVariantForm({ ...variantForm, name: e.target.value })
              }
            />

            <Label htmlFor="var-price">Price</Label>
            <Input
              id="var-price"
              type="number"
              placeholder="Price"
              value={variantForm.price}
              onChange={(e) =>
                setVariantForm({ ...variantForm, price: e.target.value })
              }
            />

            <Label htmlFor="var-discount">Discounted Price</Label>
            <Input
              id="var-discount"
              type="number"
              placeholder="Discount Price"
              value={variantForm.discountPrice}
              onChange={(e) =>
                setVariantForm({
                  ...variantForm,
                  discountPrice: e.target.value,
                })
              }
            />

            <Label htmlFor="var-stock">Stock</Label>
            <Input
              id="var-stock"
              type="number"
              placeholder="Stock"
              value={variantForm.stock}
              onChange={(e) =>
                setVariantForm({ ...variantForm, stock: e.target.value })
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                const newVariant: Variant = {
                  name: variantForm.name,
                  price: Number(variantForm.price),
                  discountPrice: variantForm.discountPrice
                    ? Number(variantForm.discountPrice)
                    : null,
                  stock: Number(variantForm.stock),
                };

                setVariants((prev) => [...prev, newVariant]);

                // reset form
                setVariantForm({
                  name: "",
                  price: "",
                  discountPrice: "",
                  stock: "",
                });

                setIsVariantDialogOpen(false);
              }}
              disabled={!variantForm.name || !variantForm.price}
            >
              Add Variant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isPageSectionDialogOpen}
        onOpenChange={setIsPageSectionDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
            <DialogDescription>
              Add page section like Nutrient Info, Label etc.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            {pageSectionForm.mediaURL ? (
              <div className="relative w-full min-h-40 h-auto">
                <Image
                  className="object-contain"
                  src={pageSectionForm.mediaURL}
                  alt="sec-content"
                  fill
                />
                <Button
                  onClick={() =>
                    setPageSectionForm({ ...pageSectionForm, mediaURL: "" })
                  }
                  className="h-2 w-2 rounded-full bg-red-50 absolute top-1 right-1"
                >
                  <X className="text-red-500" size={12} />
                </Button>
              </div>
            ) : (
              <>
                <Label htmlFor="sec-content">Content</Label>
                <FileUpload
                  id="sec-content"
                  disabled={isUploading}
                  variant="compact"
                  onFilesAdded={async (files: File[]) => {
                    const file = files[0];
                    if (
                      !file.type.startsWith("image/") &&
                      !file.type.startsWith("video/")
                    ) {
                      toast("Invalid file type");
                      return;
                    }

                    const fileType: MediaType = file.type.startsWith("image/")
                      ? "IMAGE"
                      : "VIDEO";
                    const data = await handleFilesUpload(files);
                    if (!data || data.length === 0) {
                      toast("Error", { description: "Error uploading file" });
                      return;
                    }
                    setPageSectionForm({
                      ...pageSectionForm,
                      mediaURL: data[0].url!,
                      type: fileType,
                    });
                  }}
                />
              </>
            )}

            <Label htmlFor="var-name">Title</Label>
            <Input
              id="sec-title"
              placeholder="Section Title"
              value={pageSectionForm?.title || ""}
              onChange={(e) =>
                setPageSectionForm({
                  ...pageSectionForm,
                  title: e.target.value,
                })
              }
            />

            <Label htmlFor="var-name">Subtitle</Label>
            <Input
              id="sec-subtitle"
              placeholder="Section Subtitle"
              value={pageSectionForm?.subtitle || ""}
              onChange={(e) =>
                setPageSectionForm({
                  ...pageSectionForm,
                  subtitle: e.target.value,
                })
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                if (!pageSectionForm.mediaURL) {
                  toast("Error", { description: "content can't be empty" });
                  return;
                }

                const section: PageSection = {
                  id: crypto.randomUUID(),
                  title: pageSectionForm.title,
                  subtitle: pageSectionForm.subtitle,
                  mediaURL: pageSectionForm.mediaURL,
                  type: pageSectionForm.type,
                  order: pageSections.length,
                };

                setPageSections((prev) => [...prev, section]);

                // reset form
                setPageSectionForm({
                  title: "",
                  subtitle: "",
                  mediaURL: "",
                  type: "IMAGE",
                });

                setIsPageSectionDialogOpen(false);
              }}
              disabled={!pageSectionForm.mediaURL}
            >
              Add Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Products;
