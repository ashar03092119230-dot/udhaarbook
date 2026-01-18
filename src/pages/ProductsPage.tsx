import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/layout/BottomNav';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  Package,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ProductsPage = () => {
  const { products } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort: low stock first, then by name
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a.soldOut && !b.soldOut) return -1;
    if (!a.soldOut && b.soldOut) return 1;
    if (a.quantity < 5 && b.quantity >= 5) return -1;
    if (a.quantity >= 5 && b.quantity < 5) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <BottomNav>
      <div className="page-container bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-40">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Products</h1>
                <p className="text-sm text-muted-foreground font-urdu">سامان کی فہرست</p>
              </div>
              <Button onClick={() => navigate('/products/new')} size="icon-lg">
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-lg pl-12"
              />
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-4">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-secondary/50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Package className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-xl text-foreground mb-2">
                {searchQuery ? 'No products found' : 'No Products Yet'}
              </h3>
              <p className="text-muted-foreground mb-6 font-urdu">
                {searchQuery ? 'کوئی سامان نہیں ملا' : 'ابھی کوئی سامان نہیں'}
              </p>
              {!searchQuery && (
                <Button onClick={() => navigate('/products/new')} size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Add First Product
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sortedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={cn(
                    "p-4 rounded-2xl bg-card border animate-slide-up",
                    product.soldOut
                      ? "border-destructive/30 bg-destructive/5"
                      : product.quantity < 5
                      ? "border-warning/30 bg-warning/5"
                      : "border-border/50"
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.supplier}</p>
                    </div>
                    {product.soldOut ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-destructive/20 text-destructive">
                        Sold Out
                      </span>
                    ) : product.quantity < 5 ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-warning/20 text-warning flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Low Stock
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="font-bold text-primary">Rs {product.price.toLocaleString('en-PK')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Qty</p>
                      <p className={cn(
                        "font-bold text-lg",
                        product.soldOut
                          ? "text-destructive"
                          : product.quantity < 5
                          ? "text-warning"
                          : "text-foreground"
                      )}>
                        {product.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <TrendingUp className="w-3 h-3" /> Sold
                      </p>
                      <p className="font-bold text-success">{product.totalSold}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </BottomNav>
  );
};

export default ProductsPage;
