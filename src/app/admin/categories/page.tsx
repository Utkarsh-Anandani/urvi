"use client";
import { useQueryData } from "@/hooks/useQueryData";
import { PageHeader } from "../page";
import CategoryDialog from "./_components/category-dialog";
import { GetAdminCategories } from "@/actions/category";
import { GetAdminCategoriesResponse } from "@/types/category.types";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CategoriesPage = () => {
  const { data, isFetching, isFetched } = useQueryData(["admin-categories"], () => GetAdminCategories());
  const { status, data: categories } = data as GetAdminCategoriesResponse;
  return (
    <main className="flex-1 overflow-y-auto p-5 lg:p-7">
      <PageHeader
        title="Categories"
        subtitle={`${categories.length} categories in your catalogue`}
        action={
          <CategoryDialog />
        }
      />
      {(!isFetching && isFetched) ? (
        <div className="w-full grid grid-cols-4 gap-x-4 gap-y-2">
          {categories.map((c) => (
            <Card key={c.name}>
              <CardHeader>
                <CardTitle>{c.name}</CardTitle>
                <CardDescription>{`${c.productCount} products in this category`}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="w-full text-lg font-semibold text-center">
          No categories exists
        </div>
      )}
    </main>
  );
};

export default CategoriesPage;
