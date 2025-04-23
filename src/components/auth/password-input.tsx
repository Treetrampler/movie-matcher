import { Eye, EyeOff } from "lucide-react"; // or any icon library
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PasswordInput({
  value,
  onChange,
  ...props
}: React.ComponentProps<"input">) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      {/* Input Field */}
      <Input
        {...props}
        type={visible ? "text" : "password"} // Toggle between "text" and "password"
        value={value}
        onChange={onChange}
        className="pr-10" // Add padding to the right for the icon
      />

      {/* Eye Icon Button */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute top-1/2 right-2 -translate-y-1/2 p-1"
        onClick={() => setVisible((prev) => !prev)} // Toggle visibility state
        tabIndex={-1} // Prevent tab focus on the button
      >
        {visible ? (
          <EyeOff className="h-4 w-4" /> // Icon for "hide password"
        ) : (
          <Eye className="h-4 w-4" /> // Icon for "show password"
        )}
      </Button>
    </div>
  );
}
