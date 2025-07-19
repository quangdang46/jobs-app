import React from "react";
import states from "@/config/states.json";
import { SelectItem } from "@/components/ui/select";
export default function StateSelectItems() {
  return Object.entries(states).map(([abbreviation, name]) => (
    <SelectItem key={abbreviation} value={abbreviation}>
      {name}
    </SelectItem>
  ));
}
