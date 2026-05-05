"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { BadgePercent, Loader2, Plus, Tag } from "lucide-react";
import { ActionMenu, PageHeader } from "../page";
import { BROWN, LIGHT_ORANGE, ORANGE } from "@/lib/helper";
import { CouponScope, DiscountType } from "@prisma/client";
import { CreateCouponType } from "@/types/coupon.types";
import {
  CreateCoupon,
  DeleteCoupon,
  GetAdminCoupons,
  GetCouponAnalytics,
  ToggleCouponStatus,
  UpdateCoupon,
} from "@/actions/coupon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { GetAdminCategories } from "@/actions/category";
import { GetAdminProducts } from "@/actions/product";

const INITIAL_FORM: CreateCouponType = {
  code: "",
  discountType: "PERCENTAGE",
  discountValue: 0,
  minOrderAmount: 0,
  maxDiscount: 0,
  usageLimit: 0,
  maxUsagePerUser: 1,
  isActive: true,
  scope: "GLOBAL",
  categoryIds: [],
  productIds: [],
};

const Coupons = () => {
  const queryClient = useQueryClient();
  const [isAddingCoupon, setIsAddingCoupon] = useState<boolean>(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateCouponType>(INITIAL_FORM);
  const [search, setSearch] = useState("");
  const {
    data: couponsData,
    isLoading: couponsLoading,
    isError: couponsError,
  } = useQuery({
    queryKey: ["admin-coupons", search],
    queryFn: async () => {
      const res = await GetAdminCoupons({
        search,
        limit: 50,
      });
      if (!res.data) {
        throw new Error(res?.message || "Error fetching coupons");
      }
      return res.data;
    },
  });

  const coupons = couponsData?.coupons || [];

  const { data: analyticsData } = useQuery({
    queryKey: ["admin-coupons-analytics"],
    queryFn: async () => {
      const res = await GetCouponAnalytics();
      if (!res.data) {
        throw new Error(res?.message || "Error fetching analytics");
      }
      return res.data;
    },
  });

  const analytics = analyticsData;

  const { data: categoriesData } = useQuery({
    queryKey: ["admin-categories"],

    queryFn: async () => {
      const res = await GetAdminCategories();
      return res?.data || [];
    },
  });

  const { data: productsData } = useQuery({
    queryKey: ["admin-products"],

    queryFn: async () => {
      const res = await GetAdminProducts();
      return res?.data || [];
    },
  });

  const categories = categoriesData || [];

  const products = productsData || [];

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingCouponId(null);
  };

  const validateForm = () => {
    if (!form.code.trim()) {
      toast.error("Coupon code required");
      return false;
    }

    if (form.discountValue <= 0) {
      toast.error("Discount value required");
      return false;
    }

    if (
      form.scope === "CATEGORY" &&
      (!form.categoryIds || form.categoryIds.length === 0)
    ) {
      toast.error("Select at least one category");
      return false;
    }

    if (
      form.scope === "PRODUCT" &&
      (!form.productIds || form.productIds.length === 0)
    ) {
      toast.error("Select at least one product");
      return false;
    }

    return true;
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await CreateCoupon({
        ...form,
      });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error(res?.message || "Error creating coupon");
      }
      return res;
    },

    onSuccess: () => {
      toast.success("Coupon created");
      resetForm();
      queryClient.invalidateQueries({
        queryKey: ["admin-coupons"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-coupons-analytics"],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editingCouponId) {
        throw new Error("Coupon missing");
      }
      const res = await UpdateCoupon(editingCouponId, {
        ...form,
      });
      if (res.status !== 200 && res.status !== 201) {
        throw new Error(res?.message || "Error updating coupon");
      }
      return res;
    },

    onSuccess: () => {
      toast.success("Coupon updated");
      resetForm();
      queryClient.invalidateQueries({
        queryKey: ["admin-coupons"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-coupons-analytics"],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await DeleteCoupon(id);
      if (res.status !== 200 && res.status !== 201) {
        throw new Error(res?.message || "Error deleting coupon");
      }
      return res;
    },

    onSuccess: () => {
      toast.success("Coupon deleted");
      queryClient.invalidateQueries({
        queryKey: ["admin-coupons"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-coupons-analytics"],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await ToggleCouponStatus(id);
      if (res.status !== 200 && res.status !== 201) {
        throw new Error(res?.message || "Error toggling coupon status");
      }
      return res;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-coupons"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-coupons-analytics"],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <main className="flex-1 overflow-y-auto p-5 lg:p-7">
      <PageHeader
        title="Coupons"
        subtitle="Manage promotional discounts"
        action={
          <Button
            onClick={() => {
              setEditingCouponId(null);
              resetForm();
              setIsAddingCoupon(true);
            }}
            className="gap-2 h-9 text-xs uppercase tracking-wider rounded-sm"
            style={{
              background: `linear-gradient(135deg, ${ORANGE}, ${LIGHT_ORANGE})`,
              border: "none",
              fontFamily: "'Lato', sans-serif",
            }}
          >
            {" "}
            <Plus size={14} /> New Coupon{" "}
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            label: "Active Coupons",
            value: analytics?.activeCoupons || 0,
            color: BROWN,
          },
          {
            label: "Total Coupons",
            value: analytics?.totalCoupons || 0,
            color: ORANGE,
          },
          {
            label: "Redemptions",
            value: analytics?.totalUsage || 0,
            color: "#16a34a",
          },
        ].map((item) => (
          <Card key={item.label} className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{
                  background: `${item.color}15`,
                }}
              >
                <Tag
                  size={18}
                  style={{
                    color: item.color,
                  }}
                />
              </div>

              <div>
                <p className="text-2xl font-light">{item.value}</p>

                <p className="text-xs uppercase tracking-widest text-gray-400">
                  {item.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FORM */}

      {(isAddingCoupon || editingCouponId) && (
        <Card className="mb-6 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BadgePercent size={18} />

              {editingCouponId ? "Edit Coupon" : "Create Coupon"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label>Coupon Code</Label>

                <Input
                  value={form.code}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      code: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="WELCOME20"
                />
              </div>

              <div className="space-y-2">
                <Label>Discount Type</Label>

                <Select
                  value={form.discountType}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      discountType: value as DiscountType,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FLAT">Flat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Discount</Label>

                <Input
                  type="number"
                  value={form.discountValue}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      discountValue: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Max Discount</Label>

                <Input
                  type="number"
                  value={form.maxDiscount}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      maxDiscount: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Min Order</Label>

                <Input
                  type="number"
                  value={form.minOrderAmount}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      minOrderAmount: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Usage Limit</Label>

                <Input
                  type="number"
                  value={form.usageLimit}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      usageLimit: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Per User Limit</Label>

                <Input
                  type="number"
                  value={form.maxUsagePerUser}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      maxUsagePerUser: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Scope</Label>

                <Select
                  value={form.scope}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      scope: value as CouponScope,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="GLOBAL">Global</SelectItem>

                    <SelectItem value="PRODUCT">Product</SelectItem>

                    <SelectItem value="CATEGORY">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.scope === "CATEGORY" && (
                <div className="space-y-2 lg:col-span-2">
                  <Label>Categories</Label>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {form.categoryIds && form.categoryIds.length > 0
                          ? `${form.categoryIds.length} selected`
                          : "Select categories"}

                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search categories..." />

                        <CommandEmpty>No category found.</CommandEmpty>

                        <CommandGroup className="max-h-64 overflow-auto">
                          {categories.map((category) => {
                            const selected = form.categoryIds.includes(
                              category.id,
                            );

                            return (
                              <CommandItem
                                key={category.id}
                                onSelect={() => {
                                  setForm((prev) => ({
                                    ...prev,

                                    categoryIds: selected
                                      ? prev.categoryIds.filter(
                                          (id) => id !== category.id,
                                        )
                                      : [...prev.categoryIds, category.id],
                                  }));
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",

                                    selected ? "opacity-100" : "opacity-0",
                                  )}
                                />

                                {category.name}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <div className="flex flex-wrap gap-2">
                    {form.categoryIds.map((id) => {
                      const category = categories.find((c) => c.id === id);

                      if (!category) {
                        return null;
                      }

                      return (
                        <div
                          key={id}
                          className="rounded-full bg-orange-100 px-3 py-1 text-xs"
                        >
                          {category.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {form.scope === "PRODUCT" && (
                <div className="space-y-2 lg:col-span-2">
                  <Label>Products</Label>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {form.productIds.length > 0
                          ? `${form.productIds.length} selected`
                          : "Select products"}

                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search products..." />

                        <CommandEmpty>No product found.</CommandEmpty>

                        <CommandGroup className="max-h-64 overflow-auto">
                          {products.map((product) => {
                            const selected = form.productIds.includes(
                              product.id,
                            );

                            return (
                              <CommandItem
                                key={product.id}
                                onSelect={() => {
                                  setForm((prev) => ({
                                    ...prev,

                                    productIds: selected
                                      ? prev.productIds.filter(
                                          (id) => id !== product.id,
                                        )
                                      : [...prev.productIds, product.id],
                                  }));
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",

                                    selected ? "opacity-100" : "opacity-0",
                                  )}
                                />

                                {product.name}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <div className="flex flex-wrap gap-2">
                    {form.productIds.map((id) => {
                      const product = products.find((p) => p.id === id);

                      if (!product) {
                        return null;
                      }

                      return (
                        <div
                          key={id}
                          className="rounded-full bg-orange-100 px-3 py-1 text-xs"
                        >
                          {product.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-end gap-3">
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      isActive: checked,
                    }))
                  }
                />

                <Label>Active</Label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                disabled={createMutation.isPending || updateMutation.isPending}
                onClick={() => {
                  if (!validateForm()) {
                    return;
                  }

                  if (editingCouponId) {
                    updateMutation.mutate();
                  } else {
                    createMutation.mutate();
                  }
                }}
                style={{
                  background: `linear-gradient(135deg, ${ORANGE}, ${LIGHT_ORANGE})`,
                }}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : editingCouponId ? (
                  "Update Coupon"
                ) : (
                  <>
                    <Plus size={16} />
                    Create Coupon
                  </>
                )}
              </Button>

              {editingCouponId && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingCouponId(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              )}
              {isAddingCoupon && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingCoupon(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TABLE */}

      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <Input
            placeholder="Search coupons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>

                <TableHead>Type</TableHead>

                <TableHead>Discount</TableHead>

                <TableHead>Max Discount</TableHead>

                <TableHead>Min Order</TableHead>

                <TableHead>Scope</TableHead>

                <TableHead>Active</TableHead>

                <TableHead>Usage</TableHead>

                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {couponsLoading ? (
                Array.from({
                  length: 6,
                }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({
                      length: 9,
                    }).map((_, idx) => (
                      <TableCell key={idx}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : couponsError ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-10 text-center text-red-500"
                  >
                    Failed to load coupons
                  </TableCell>
                </TableRow>
              ) : coupons.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-10 text-center text-gray-400"
                  >
                    No coupons found
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <span
                        className="rounded px-2 py-1 font-mono text-sm font-bold"
                        style={{
                          background: `${BROWN}15`,
                          color: BROWN,
                        }}
                      >
                        {coupon.code}
                      </span>
                    </TableCell>

                    <TableCell>{coupon.discountType}</TableCell>

                    <TableCell>{coupon.discountValue}</TableCell>

                    <TableCell>₹{coupon.maxDiscount || 0}</TableCell>

                    <TableCell>₹{coupon.minOrderAmount || 0}</TableCell>

                    <TableCell>{coupon.scope}</TableCell>

                    <TableCell>
                      <Switch
                        checked={coupon.isActive}
                        disabled={toggleMutation.isPending}
                        onCheckedChange={() => toggleMutation.mutate(coupon.id)}
                      />
                    </TableCell>

                    <TableCell>{coupon._count?.usages}</TableCell>

                    <TableCell>
                      <ActionMenu
                        onDelete={() => deleteMutation.mutate(coupon.id)}
                        onEdit={() => {
                          setIsAddingCoupon(false);
                          setEditingCouponId(coupon.id);

                          setForm({
                            code: coupon.code,
                            discountType: coupon.discountType,
                            discountValue: coupon.discountValue,
                            minOrderAmount: coupon.minOrderAmount || 0,
                            maxDiscount: coupon.maxDiscount || 0,
                            usageLimit: coupon.usageLimit || 0,
                            maxUsagePerUser: coupon.maxUsagePerUser || 1,
                            isActive: coupon.isActive,
                            scope: coupon.scope,
                            productIds:
                              coupon.products?.map((p) => p.productId) || [],
                            categoryIds:
                              coupon.categories?.map((c) => c.categoryId) || [],
                          });
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
};

export default Coupons;
