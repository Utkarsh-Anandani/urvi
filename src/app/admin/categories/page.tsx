"use client";
import { useQueryData } from "@/hooks/useQueryData";
import { PageHeader } from "../page";
import CategoryDialog from "./_components/category-dialog";
import { GetAdminCategories } from "@/actions/category";
import { GetCategoriesResponse } from "@/types/category.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CategoriesPage = () => {
  const { data, isFetching, isFetched } = useQueryData(["admin-categories"], () => GetAdminCategories());
  const { data: categories } = data as GetCategoriesResponse;
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
            <Card className="p-0" key={c.name}>
              <CardContent className="p-0">
                {c.imageURL && <img className="w-full h-55 object-cover" src={c?.imageURL} alt="img" />}
              <CardHeader className="py-4">
                <CardTitle>{c.name}</CardTitle>
                <CardDescription>{`${c.productCount} products in this category`}</CardDescription>
              </CardHeader>
              </CardContent>
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
