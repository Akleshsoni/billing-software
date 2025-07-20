import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Product {
  name: string;
  price: number;
}

interface ProductCategoryProps {
  title: string;
  icon: string;
  iconColor: string;
  products: Record<string, Product>;
  quantities: Record<string, number>;
  onQuantityChange: (productKey: string, quantity: number) => void;
  category: string;
}

// Icon component mapping
const IconComponent = ({ icon, className }: { icon: string; className: string }) => {
  const iconMap: Record<string, string> = {
    "cookie-bite": "🍪",
    "shopping-basket": "🛒",
    "spa": "🧴",
  };
  
  return (
    <span className={`text-lg ${className}`}>
      {iconMap[icon] || "📦"}
    </span>
  );
};

const ProductCategory = memo(function ProductCategory({
  title,
  icon,
  iconColor,
  products,
  quantities,
  onQuantityChange,
  category,
}: ProductCategoryProps) {
  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <IconComponent icon={icon} className={iconColor} />
          {title}
        </h3>
        
        <div className="space-y-4">
          {Object.entries(products).map(([key, product]) => (
            <div key={key} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{product.name}</p>
                <p className="text-xs text-slate-500">₹{product.price}</p>
              </div>
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={quantities[key] || ""}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  onQuantityChange(key, value);
                }}
                className="w-16 text-center"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
