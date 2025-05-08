import { Brain, Zap, Coffee, Moon, AlertCircle } from "lucide-react";

export function getMindStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "focused":
      return <Zap className="text-yellow-400" size={20} />;
    case "tired":
      return <Moon className="text-blue-400" size={20} />;
    case "distracted":
      return <Coffee className="text-orange-400" size={20} />;
    case "stressed":
      return <AlertCircle className="text-red-500" size={20} />;
    default:
      return <Brain className="text-gray-400" size={20} />;
  }
}
