import { useState, useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Gallery = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/gallery/categories/`);
        setCategories(res.data);

        if (res.data.length > 0) {
          setActiveCategory(res.data[0].slug);
          fetchItems(res.data[0].slug);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const fetchItems = async (slug: string) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/gallery/?category=${slug}`);
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const renderGalleryGrid = (images: any[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((item, index) => (
        <Card
          key={index}
          className="overflow-hidden cursor-pointer hover:shadow-hover transition-all group"
          onClick={() => item.image && setSelectedImage(item.image)}
        >
          <div className="aspect-video relative">
            {item.image ? (
              <img
                src={item.image}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-xl text-primary-foreground/90">
            Explore moments from our training sessions, events, graduations, and workshops
          </p>
        </div>
      </section>

      {/* Dynamic Tabs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue={activeCategory || ""} value={activeCategory || ""} className="w-full">
            {/* Responsive Tabs List */}
            <TabsList className="flex overflow-x-auto no-scrollbar gap-4 mb-12 px-2 sm:px-0">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.slug}
                  value={cat.slug}
                  onClick={() => {
                    setActiveCategory(cat.slug);
                    fetchItems(cat.slug);
                  }}
                  className="whitespace-nowrap flex-shrink-0"
                >
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeCategory || ""}>
              {items.length > 0 ? (
                renderGalleryGrid(items)
              ) : (
                <p className="text-center text-muted-foreground">No items in this category yet.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
