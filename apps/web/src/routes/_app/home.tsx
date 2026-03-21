import { Button } from "@pharos-one/ui/components/button";
import { Card } from "@pharos-one/ui/components/card";
import { Input } from "@pharos-one/ui/components/input";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  useInventory,
  useCreateMedicine,
  useUpdateStock,
} from "@/hooks/use-inventory";

export const Route = createFileRoute("/_app/home")({
  component: HomeComponent,
});

function HomeComponent() {
  const [name, setName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // Queries
  const { data: medicines = [], isLoading, error } = useInventory();

  // Mutations
  const createMedicine = useCreateMedicine();
  const updateStock = useUpdateStock();

  const handleCreate = async () => {
    try {
      await createMedicine.mutateAsync({
        name,
        generic_name: genericName,
        unit_price: parseFloat(price),
        quantity: parseInt(quantity, 10),
      });

      // Clear form
      setName("");
      setGenericName("");
      setPrice("");
      setQuantity("");
    } catch (error) {
      console.error("Failed to create medicine:", error);
    }
  };

  const handleUpdateStock = async (id: string, change: number) => {
    try {
      await updateStock.mutateAsync({
        id,
        quantity_change: change,
      });
    } catch (error) {
      console.error("Failed to update stock:", error);
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Pharmacy Management System</h1>
        <p className="text-muted-foreground">
          Clean Architecture + Cargo Workspace + SeaORM + TanStack Query
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Add Medicine</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Generic Name"
            value={genericName}
            onChange={(e) => setGenericName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <Button onClick={handleCreate} disabled={createMedicine.isPending}>
          {createMedicine.isPending ? "Adding..." : "Add Medicine"}
        </Button>
        {createMedicine.isError && (
          <p className="text-sm text-destructive">
            Error: {createMedicine.error.message}
          </p>
        )}
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Inventory</h2>
          {isLoading && (
            <span className="text-sm text-muted-foreground">Loading...</span>
          )}
        </div>

        {error && (
          <p className="text-sm text-destructive">
            Error loading medicines: {error.message}
          </p>
        )}

        {medicines.length === 0 && !isLoading ? (
          <p className="text-sm text-muted-foreground italic">
            No medicines yet. Add a new medicine above.
          </p>
        ) : (
          <div className="space-y-2">
            {medicines.map((medicine) => (
              <div
                key={medicine.id}
                className="p-4 bg-muted rounded-md border border-border flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{medicine.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {medicine.generic_name}
                  </p>
                  <p className="text-sm">
                    Price: ${medicine.unit_price.toFixed(2)} | Stock:{" "}
                    {medicine.quantity}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStock(medicine.id, -10)}
                    disabled={updateStock.isPending}
                  >
                    -10
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStock(medicine.id, 10)}
                    disabled={updateStock.isPending}
                  >
                    +10
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-6 space-y-2 bg-muted/50">
        <h3 className="text-sm font-semibold">Architecture:</h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>
            <strong>Backend:</strong> Cargo Workspace (6 crates) + Clean
            Architecture
          </li>
          <li>
            <strong>Frontend:</strong> TanStack Query + Reusable Hooks +
            Constant Keys
          </li>
          <li>
            <strong>Features:</strong> Inventory (placeholder for 8 features)
          </li>
          <li>
            <strong>Data Flow:</strong> Hooks → API → Tauri Commands →
            Application → Domain
          </li>
          <li>
            <strong>Caching:</strong> Automatic with optimistic updates
          </li>
        </ul>
      </Card>
    </div>
  );
}
