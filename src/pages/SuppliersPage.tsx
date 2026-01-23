import { useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, Plus, Truck, Phone, Package, Banknote, Trash2, Edit2, X, Save 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const SuppliersPage = () => {
  const navigate = useNavigate();
  const { t, rtl } = useTranslation();
  const { toast } = useToast();
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useStore();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [products, setProducts] = useState('');
  const [price, setPrice] = useState('');

  const resetForm = () => {
    setName('');
    setPhone('');
    setProducts('');
    setPrice('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (supplier: typeof suppliers[0]) => {
    setEditingId(supplier.id);
    setName(supplier.name);
    setPhone(supplier.phone);
    setProducts(supplier.products);
    setPrice(supplier.price);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast({
        title: t('nameRequired'),
        variant: 'destructive',
      });
      return;
    }

    if (editingId) {
      updateSupplier(editingId, {
        name: name.trim(),
        phone: phone.trim(),
        products: products.trim(),
        price: price.trim(),
      });
      toast({ title: t('saved') + ' ✓' });
    } else {
      addSupplier({
        name: name.trim(),
        phone: phone.trim(),
        products: products.trim(),
        price: price.trim(),
      });
      toast({ title: t('supplierAdded') + ' ✓' });
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteSupplier(id);
    toast({ title: t('deleted') + ' ✓' });
  };

  const handleCall = (phoneNumber: string) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_self');
    }
  };

  return (
    <BottomNav>
      <div className="page-container bg-background" dir={rtl ? 'rtl' : 'ltr'}>
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-40">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="rounded-xl"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Truck className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground">{t('suppliers')}</h1>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              size="sm"
              className="rounded-xl"
            >
              <Plus className="h-4 w-4 mr-1" />
              {t('addNew')}
            </Button>
          </div>
        </header>

        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
          {suppliers.length === 0 ? (
            <div className="text-center py-12">
              <Truck className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                {t('noSuppliers')}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('addFirstSupplier')}
              </p>
              <Button onClick={() => setShowForm(true)} className="rounded-xl">
                <Plus className="h-4 w-4 mr-2" />
                {t('addSupplier')}
              </Button>
            </div>
          ) : (
            suppliers.map((supplier) => (
              <Card key={supplier.id} className="p-4 rounded-2xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground">{supplier.name}</h3>
                    
                    {supplier.phone && (
                      <button 
                        onClick={() => handleCall(supplier.phone)}
                        className="flex items-center gap-2 text-sm text-primary mt-1 hover:underline"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {supplier.phone}
                      </button>
                    )}

                    {supplier.products && (
                      <div className="flex items-start gap-2 mt-3 text-sm text-muted-foreground">
                        <Package className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{supplier.products}</span>
                      </div>
                    )}

                    {supplier.price && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Banknote className="h-4 w-4 flex-shrink-0" />
                        <span>{supplier.price}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(supplier)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleDelete(supplier.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={showForm} onOpenChange={(open) => !open && resetForm()}>
          <DialogContent className="max-w-sm rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                {editingId ? t('editSupplier') : t('addSupplier')}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>{t('supplierName')} *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('enterSupplierName')}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('phoneNumber')}</Label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03XX-XXXXXXX"
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('supplierProducts')}</Label>
                <Input
                  value={products}
                  onChange={(e) => setProducts(e.target.value)}
                  placeholder={t('whatYouBuy')}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('supplierPrices')}</Label>
                <Input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={t('priceDetails')}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl"
                  onClick={resetForm}
                >
                  <X className="h-4 w-4 mr-2" />
                  {t('cancel')}
                </Button>
                <Button
                  className="flex-1 h-12 rounded-xl"
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t('save')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </BottomNav>
  );
};

export default SuppliersPage;