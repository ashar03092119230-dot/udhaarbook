import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/layout/BottomNav';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Package, Building2, Hash, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NewProductPage = () => {
  const navigate = useNavigate();
  const { addProduct } = useStore();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplier, setSupplier] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter product name',
        variant: 'destructive',
      });
      return;
    }

    addProduct({
      name: name.trim(),
      price: parseFloat(price) || 0,
      quantity: parseInt(quantity) || 0,
      supplier: supplier.trim(),
    });

    toast({
      title: 'Product Added! ✓',
      description: `${name} has been added successfully`,
    });

    navigate('/products');
  };

  return (
    <BottomNav>
      <div className="page-container bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-40">
          <div className="max-w-md mx-auto flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">New Product</h1>
              <p className="text-sm text-muted-foreground font-urdu">نیا سامان</p>
            </div>
          </div>
        </header>

        <div className="max-w-md mx-auto px-4 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2 animate-slide-up">
              <Label htmlFor="name" className="text-base font-semibold flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Product Name
                <span className="text-muted-foreground font-normal font-urdu text-sm">سامان کا نام</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name..."
                className="input-lg"
                autoFocus
              />
            </div>

            {/* Price */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '50ms' }}>
              <Label htmlFor="price" className="text-base font-semibold flex items-center gap-2">
                <Coins className="w-4 h-4 text-primary" />
                Price
                <span className="text-muted-foreground font-normal font-urdu text-sm">قیمت</span>
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                  Rs
                </span>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  className="input-lg pl-12"
                  min="0"
                />
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <Label htmlFor="quantity" className="text-base font-semibold flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" />
                Quantity
                <span className="text-muted-foreground font-normal font-urdu text-sm">مقدار</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="input-lg"
                min="0"
              />
            </div>

            {/* Supplier */}
            <div className="space-y-2 animate-slide-up" style={{ animationDelay: '150ms' }}>
              <Label htmlFor="supplier" className="text-base font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                Supplier / Company
                <span className="text-muted-foreground font-normal font-urdu text-sm">کمپنی</span>
              </Label>
              <Input
                id="supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Supplier name..."
                className="input-lg"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="xl"
              className="w-full mt-8 animate-slide-up"
              style={{ animationDelay: '200ms' }}
            >
              <Package className="w-5 h-5 mr-2" />
              Add Product
              <span className="font-urdu ml-2">سامان شامل کریں</span>
            </Button>
          </form>
        </div>
      </div>
    </BottomNav>
  );
};

export default NewProductPage;
