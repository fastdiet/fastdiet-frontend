import Cuisine from "@/models/cuisine";
import Diet from "@/models/diet";
import Intolerance from "@/models/intolerance";


export interface UserPreferences {
  id?: number;
  user_id?: number;
  diet_type_id?: number;
  vegetarian?: boolean;
  vegan?: boolean;
  gluten_free?: boolean;
  dairy_free?: boolean;
  activity_level?: string;
  goal?: string;
  max_ready_min?: number;
  servings?: number;
  calories_goal?: number;
  sustainable?: boolean;
  low_fodmap?: boolean;
  cuisines?: Cuisine[];
  intolerances?: Intolerance[];
  diet?: Diet;
}