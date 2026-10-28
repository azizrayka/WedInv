/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
export const dynamic = "force-dynamic";
import { v2 as cloudinary } from "cloudinary";

type Photo = { publicId: string; width: number; height: number };

function Lightbox({
  photo,
  getCldUrl,
}: {
  photo: Photo;
  getCldUrl: (id: string, w: number) => string;
}) {
  const src = getCldUrl(photo.publicId, Math.min(photo.width, 800));
  return (
    <div className="overflow-hidden rounded bg-neutral-900">
      <img src={src} alt={photo.publicId} className="w-full h-auto block" />
    </div>
  );
}

// 1. Configure Cloudinary (secret is safe here because this is a Server Component)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Helper to build optimized image URLs
function getCldUrl(publicId: string, width: number) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,c_limit,w_${width},q_auto/${publicId}`;
}

export default async function Page() {
  let photos: Photo[] = [];
  let errorMessage = "";

  // 3. Fetch images, catching errors so the real message is visible
  try {
    const result = await cloudinary.search
      .expression("resource_type:image") // Change to "folder:my-folder" to filter
      .sort_by("created_at", "desc")
      .max_results(30)
      .execute();

    photos = result.resources.map((r: any) => ({
      publicId: r.public_id,
      width: r.width,
      height: r.height,
    }));
  } catch (e: any) {
    errorMessage = e?.error?.message || e?.message || JSON.stringify(e);
    console.error("Cloudinary error:", e);
  }

  // Temporary debug screen: remove once everything works
  if (errorMessage) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white p-6">
        <p className="text-red-400">Cloudinary error: {errorMessage}</p>
        <p className="text-neutral-400 mt-2 text-sm">
          cloud: {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? "set" : "MISSING"} |
          key: {process.env.CLOUDINARY_API_KEY ? "set" : "MISSING"} |
          secret: {process.env.CLOUDINARY_API_SECRET ? "set" : "MISSING"}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">Wedding Gallery</h1>
        <p className="text-neutral-400 mt-2">{photos.length} photos from Cloudinary</p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {photos.map((photo) => (
          <Lightbox key={photo.publicId} photo={photo} getCldUrl={getCldUrl} />
        ))}
      </section>
    </main>
  );
}