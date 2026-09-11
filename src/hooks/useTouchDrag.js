import { useState, useCallback, useRef } from 'react';

export function useTouchDrag(onDrop) {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const dragElementRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  const handleTouchStart = useCallback((e, item, element) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDraggedItem(item);
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
    dragElementRef.current = element;
    
    if (element) {
      element.style.opacity = '0.7';
      element.style.transform = 'scale(1.05)';
      element.style.zIndex = '1000';
      element.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    setTouchPosition({ x: touch.clientX, y: touch.clientY });

    // Auto-scroll when near edges
    const scrollThreshold = 50;
    const scrollSpeed = 10;
    
    if (touch.clientY < scrollThreshold) {
      window.scrollBy(0, -scrollSpeed);
    } else if (touch.clientY > window.innerHeight - scrollThreshold) {
      window.scrollBy(0, scrollSpeed);
    }
  }, [isDragging]);

  const handleTouchEnd = useCallback((e) => {
    if (!isDragging || !draggedItem) {
      setIsDragging(false);
      setDraggedItem(null);
      return;
    }

    // Reset element styles
    if (dragElementRef.current) {
      dragElementRef.current.style.opacity = '';
      dragElementRef.current.style.transform = '';
      dragElementRef.current.style.zIndex = '';
      dragElementRef.current.style.boxShadow = '';
    }

    // Find drop target
    const touch = e.changedTouches[0];
    const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (dropTarget) {
      // Find the priority section
      const section = dropTarget.closest('[data-priority]');
      if (section) {
        const targetPriority = parseInt(section.dataset.priority, 10);
        if (targetPriority && targetPriority !== draggedItem.priority) {
          onDrop(draggedItem.id, targetPriority);
        }
      }
    }

    setIsDragging(false);
    setDraggedItem(null);
    dragElementRef.current = null;
    
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  }, [isDragging, draggedItem, onDrop]);

  return {
    isDragging,
    draggedItem,
    touchPosition,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
}
