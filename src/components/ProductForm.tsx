import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { X, Upload, Image as ImageIcon } from "lucide-react";

interface ProductFormProps {
  initialData?: ProductData;
  onSubmit?: (data: ProductData) => void;
  onCancel?: () => void;
}

interface ProductData {
  id?: string;
  title: string;
  type: string;
  ingredients: string;
  manufacturer: string;
  location: string;
  fair: string;
  seals: string[];
  variations: string;
  exportOptions: boolean;
  observations: string;
  images: string[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData = {
    title: "",
    type: "",
    ingredients: "",
    manufacturer: "",
    location: "",
    fair: "",
    seals: [],
    variations: "",
    exportOptions: false,
    observations: "",
    images: [],
  },
  onSubmit = () => {},
  onCancel = () => {},
}) => {
  const [formData, setFormData] = useState<ProductData>(initialData);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialData.images || [],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];

    files.forEach((file) => {
      if (newFiles.length + newPreviews.length < 3) {
        newFiles.push(file);
        const preview = URL.createObjectURL(file);
        newPreviews.push(preview);
      }
    });

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);

    // Clear error when images are added
    if (errors["images"]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors["images"];
        return newErrors;
      });
    }
  };

  const removeImage = (index: number) => {
    // If it's a new file
    if (index < imageFiles.length) {
      const newFiles = [...imageFiles];
      const newPreviews = [...imagePreviews];

      URL.revokeObjectURL(newPreviews[index]);
      newFiles.splice(index, 1);
      newPreviews.splice(index, 1);

      setImageFiles(newFiles);
      setImagePreviews(newPreviews);
    }
    // If it's an existing image
    else {
      const newPreviews = [...imagePreviews];
      newPreviews.splice(index, 1);
      setImagePreviews(newPreviews);

      // Update form data to reflect removed image
      setFormData((prev) => ({
        ...prev,
        images: newPreviews,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    // Add more validations as needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // In a real implementation, you would handle file uploads here
      // and then submit the form data with image URLs
      onSubmit({
        ...formData,
        images: imagePreviews,
      });
    }
  };

  const handleReset = () => {
    // Revoke any object URLs to prevent memory leaks
    imagePreviews.forEach((preview) => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    });

    setFormData(initialData);
    setImageFiles([]);
    setImagePreviews(initialData.images || []);
    setErrors({});
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {initialData.id ? "Edit Product" : "Register New Product"}
        </CardTitle>
        <CardDescription>
          Fill in the product details below. Fields marked with * are required.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-medium">
                  Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="font-medium">
                  Type
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="beverage">Beverage</SelectItem>
                    <SelectItem value="cosmetic">Cosmetic</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredients" className="font-medium">
                Ingredients
              </Label>
              <Textarea
                id="ingredients"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleInputChange}
                rows={4}
                placeholder="List the ingredients here..."
              />
            </div>
          </div>

          <Separator />

          {/* Origin Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Origin Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="manufacturer" className="font-medium">
                  Manufacturer
                </Label>
                <Input
                  id="manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="font-medium">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fair" className="font-medium">
                  Fair
                </Label>
                <Input
                  id="fair"
                  name="fair"
                  value={formData.fair}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="seals" className="font-medium">
                  Seals/Certifications
                </Label>
                <Select
                  value={formData.seals?.[0] || ""}
                  onValueChange={(value) => handleSelectChange("seals", value)}
                >
                  <SelectTrigger id="seals">
                    <SelectValue placeholder="Select certification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="organic">Organic</SelectItem>
                    <SelectItem value="fair-trade">Fair Trade</SelectItem>
                    <SelectItem value="eco-friendly">Eco-Friendly</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="variations" className="font-medium">
                  Variations
                </Label>
                <Input
                  id="variations"
                  name="variations"
                  value={formData.variations}
                  onChange={handleInputChange}
                  placeholder="e.g. Size, Color, Flavor"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="exportOptions"
                checked={formData.exportOptions}
                onCheckedChange={(checked) =>
                  handleCheckboxChange("exportOptions", checked as boolean)
                }
              />
              <Label
                htmlFor="exportOptions"
                className="font-medium cursor-pointer"
              >
                Available for export
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations" className="font-medium">
                Observations
              </Label>
              <Textarea
                id="observations"
                name="observations"
                value={formData.observations}
                onChange={handleInputChange}
                rows={3}
                placeholder="Additional notes about the product..."
              />
            </div>
          </div>

          <Separator />

          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Product Images</h3>
            <p className="text-sm text-gray-500">
              Upload up to 3 images of the product.
            </p>

            <div className="flex flex-wrap gap-4">
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative w-32 h-32 border rounded-md overflow-hidden"
                >
                  <img
                    src={preview}
                    alt={`Product preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              {imagePreviews.length < 3 && (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <p className="text-xs text-gray-500 mt-2">Upload image</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    multiple={imagePreviews.length < 2}
                  />
                </label>
              )}
            </div>

            {errors.images && (
              <p className="text-sm text-red-500">{errors.images}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6">
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
          <Button type="submit">
            {initialData.id ? "Update Product" : "Save Product"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProductForm;
