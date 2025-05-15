import type { ToolboxCategory } from "@/types/types";
import {
    ListFilter,
    CheckSquare,
    Circle,
    List,
    ImageIcon,
    Type,
    AlignLeft,
    Layers,
    FileText,
    Grid,
    Layout,
  } from "lucide-react";

/**
 * Définition des catégories et items de la boîte à outils (toolbox) pour le créateur de sondage.
 * Chaque catégorie regroupe des types de questions ou d'éléments pouvant être ajoutés à un sondage.
 *
 * @type {ToolboxCategory[]}
 */
export const toolboxCategories: ToolboxCategory[] = [
    {
        id: "choice-based",
        title: "Choice-Based Questions",
        items: [
          {
            id: "dropdown",
            label: "Dropdown",
            icon: <ListFilter className="w-5 h-5 text-primary-700" />,
            onClickType: "dropdown",
          },
          {
            id: "checkboxes",
            label: "Checkboxes",
            icon: <CheckSquare className="w-5 h-5 text-primary-700" />,
            onClickType: "checkboxes",
          },
          {
            id: "radio",
            label: "Radio Button Group",
            icon: <Circle className="w-5 h-5 text-primary-700" />,
            onClickType: "radio",
          },
          {
            id: "multi-select",
            label: "Multi-Select Dropdown",
            icon: <List className="w-5 h-5 text-primary-700" />,
            onClickType: "multi-select",
          },
          {
            id: "image-picker",
            label: "Image Picker",
            icon: <ImageIcon className="w-5 h-5 text-primary-700" />,
            onClickType: "image-picker",
          },
        ],
      },
      {
        id: "text-input",
        title: "Text Input Questions",
        items: [
          {
            id: "single-line",
            label: "Single-Line Input",
            icon: <Type className="w-5 h-5 text-primary-700" />,
            onClickType: "single-line",
          },
          {
            id: "multi-line",
            label: "Multi-Line Input",
            icon: <AlignLeft className="w-5 h-5 text-primary-700" />,
            onClickType: "multi-line",
          },
          {
            id: "multiple-textboxes",
            label: "Multiple Textboxes",
            icon: <Layers className="w-5 h-5 text-primary-700" />,
            onClickType: "multiple-textboxes",
          },
        ],
      },
      {
        id: "read-only",
        title: "Read-Only Elements",
        items: [
          {
            id: "read-only",
            label: "Read-Only Elements",
            icon: <FileText className="w-5 h-5 text-primary-700" />,
            onClickType: "read-only",
          },
        ],
      },
      {
        id: "matrices",
        title: "Matrices",
        items: [
          {
            id: "matrices",
            label: "Matrices",
            icon: <Grid className="w-5 h-5 text-primary-700" />,
            onClickType: "matrices",
          },
        ],
      },
      {
        id: "panels",
        title: "Panels",
        items: [
          {
            id: "panels",
            label: "Panels",
            icon: <Layout className="w-5 h-5 text-primary-700" />,
            onClickType: "panels",
          },
        ],
      },
    ];
