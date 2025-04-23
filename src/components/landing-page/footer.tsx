import { Film } from "lucide-react";

// abstracted footer for simplicity, no real other reason
export default function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-4 flex items-center gap-2 md:mb-0">
            <Film className="h-6 w-6 text-orange-500" />
            <span className="font-bold">Aperture</span>
          </div>

          {/* I definitely have a trademark on the site  */}

          <div className="text-sm text-gray-500">
            2025 Aperture. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
