"use client"

import { Category } from "@prisma/client";
import { IconType } from "react-icons";
import {

  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc";
import CategoryItem from "./CategoryItem";

type CategoriesProps = {
  categories: Category[];
};

{/* prettier-ignore */}
const iconMap: Record<Category["name"], IconType> = {
    "Music": FcMusic,
    "Photography": FcOldTimeCamera,
    "Fitness": FcSportsMode,
    "Accounting": FcSalesPerformance,
    "Computer Science": FcMultipleDevices,
    "Filming": FcFilmReel,
    "Engineering": FcEngineering,
  };

const Categories = ({ categories }: CategoriesProps) => {
 
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {categories.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
};

export default Categories;
