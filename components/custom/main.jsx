"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const initialData = [
  {
    id: "Loading...",
    amount: "Loading...",
    productName: "Loading...",
    stock: "Loading...",
  },
];

export default function MainArea() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState(initialData);
  const [products, setProducts] = useState([]);
  const { toast } = useToast();
  const [product, setProduct] = useState({
    productName: "",
    stock: "",
    price: "",
  });

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "productName",
      header: "Product Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.productName}</div>
      ),
    },
    {
      accessorKey: "stock",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="lowercase">{row.original.stock}</div>,
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">{row.original.price} PKR</div>
      ),
    },
    {
      id: "actions",
      enableHiding: true,
      cell: ({ row }) => {
        const product = row.original;

        const handleDelete = async () => {
          if (
            confirm(`Are you sure you want to delete ${product.productName}?`)
          ) {
            try {
              const response = await fetch("/api/product", {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: product._id }),
              });

              if (response.ok) {
                const updatedProducts = await response.json();
                setData(updatedProducts);
              } else {
                console.error("Failed to delete product");
              }
            } catch (error) {
              console.error("Error deleting product:", error);
            }
          }
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDelete}>
                DELETE ITEM
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProduct((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token_id = localStorage.getItem("token_id");
    const response = await fetch(`/api/getUserProducts?token_id=${token_id}`);
    const data = await response.json();
    setData(data);
  };

  const handleAddProduct = async () => {
    const token_id = localStorage.getItem("token_id");

    if (!product.productName || !product.stock || !product.price) {
      toast({
        title: "Please fill in all fields before adding the product",
        description: "Go to MERCHANDISE section to see products",
        action: <ToastAction altText="Goto schedule to undo">OK</ToastAction>,
      });
      return;
    }

    await fetch("/api/storeproduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...product, token_id }),
    });

    toast({
      title: "Product Added Successfully",
      description: "Go to MERCHANDISE section to see products",
      action: <ToastAction altText="Goto schedule to undo">OK</ToastAction>,
    });

    // Reset the product state to clear the input fields
    setProduct({ productName: "", stock: "", price: "" });

    // Update data to trigger refresh
    setData((prevData) => [...prevData, product]);
  };

  const totalCost = data.reduce((acc, product) => {
    const amount = parseFloat(product.price) || 0;
    const stock = parseFloat(product.stock) || 0;
    return acc + amount * stock;
  }, 0);

  const totalStock = data.reduce(
    (acc, product) => acc + Number(product.stock),
    0
  );

  const saveTotalCostAndStock = async (totalCost, totalStock) => {
    try {
      const response = await fetch("/api/total_cost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ totalCost, totalStock }),
      });

      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.log("Error saving total cost and stock:");
    }
  };

  useEffect(() => {
    saveTotalCostAndStock(totalCost, totalStock);
  }, [data]);

  return (
    <div className="w-[100%] m-auto">
      <Tabs defaultValue="stock" className="w-full mt-10">
        <TabsList className="grid w-[100%] m-auto grid-cols-2 lg:w-[40%]">
          <TabsTrigger value="stock">MERCHANDISE</TabsTrigger>
          <TabsTrigger value="addproduct">ADD PRODUCT</TabsTrigger>
        </TabsList>
        <TabsContent value="stock">
          <div className="w-full">
            <div className="flex items-center justify-center py-4">
              <Input
                placeholder="Filter products..."
                value={table.getColumn("productName")?.getFilterValue() ?? ""}
                onChange={(event) =>
                  table
                    .getColumn("productName")
                    ?.setFilterValue(event.target.value)
                }
                className="w-[90%]"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-1">
                    Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table.getAllColumns().map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        <b> LOGIN </b> or <b> SIGNIN </b> or{" "}
                        <b> ADD PRODUCTS </b> TO SATRT USING
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="addproduct" className="w-[100%] mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>ADD PRODUCT</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="productName">PRODUCT NAME</Label>
                <Input
                  value={product.productName}
                  onChange={(e) =>
                    setProduct({ ...product, productName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="stock">PRODUCT STOCK</Label>
                <Input
                  value={product.stock}
                  onChange={(e) =>
                    setProduct({ ...product, stock: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="amount">PRODUCT PRICE</Label>
                <Input
                  value={product.price}
                  onChange={(e) =>
                    setProduct({ ...product, price: e.target.value })
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
