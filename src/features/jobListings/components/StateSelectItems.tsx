import React from "react";
import states from "@/data/states.json";
import { SelectItem } from "@/components/ui/select";
export default function StateSelectItems() {
  return Object.entries(states).map(([abbreviation, name]) => (
    <SelectItem key={abbreviation} value={abbreviation}>
      {name}
    </SelectItem>
  ));
}
