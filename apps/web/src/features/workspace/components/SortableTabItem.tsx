/**
 * SortableTabItem component
 * Wraps TabItem with drag-and-drop functionality using @dnd-kit
 */

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TabItem, type TabItemProps } from "./TabItem";
import styles from "./SortableTabItem.module.css";

export interface SortableTabItemProps extends TabItemProps {
  /** Unique identifier for sortable (tab.id) */
  id: string;
}

/**
 * Sortable wrapper for TabItem
 * Provides drag-and-drop reordering with smooth animations
 * Includes enter/exit animations for tab open/close
 */
export function SortableTabItem({ id, ...tabItemProps }: SortableTabItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
    pointerEvents: isDragging ? ("none" as const) : ("auto" as const),
  };

  return (
    <div
      ref={setNodeRef}
      className={styles.sortableWrapper}
      style={style}
      {...attributes}
    >
      <TabItem {...tabItemProps} dragListeners={listeners} />
    </div>
  );
}
