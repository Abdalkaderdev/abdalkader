'use client';

import { forwardRef, ReactNode, Children, isValidElement } from 'react';
import { motion, AnimatePresence, LayoutGroup, Variants } from 'framer-motion';
import styles from './AnimatedGrid.module.scss';

export type AnimatedGridColumns = 1 | 2 | 3 | 4 | 'auto';
export type AnimatedGridGap = 'sm' | 'md' | 'lg';

export interface AnimatedGridProps {
    /** Grid items */
    children: ReactNode;
    /** Number of columns (default: 2) */
    columns?: AnimatedGridColumns;
    /** Gap between items */
    gap?: AnimatedGridGap;
    /** Enable layout animations for filtering/sorting */
    layoutAnimation?: boolean;
    /** Stagger delay between items in seconds (default: 0.05) */
    staggerDelay?: number;
    /** Stagger entrance on mount */
    staggerEntrance?: boolean;
    /** Animation duration (default: 0.4) */
    duration?: number;
    /** Unique layout group ID */
    layoutId?: string;
    /** Additional CSS class name */
    className?: string;
    /** Disable all animations */
    disableAnimations?: boolean;
}

// Animation variants
const containerVariants: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
        y: 20,
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.19, 1, 0.22, 1],
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.2,
        },
    },
};

/**
 * AnimatedGrid - A grid component with Framer Motion layout animations.
 *
 * Features:
 * - Smooth FLIP animations when items are filtered/sorted
 * - Staggered entrance animations
 * - Configurable columns and gap
 * - Automatic layout transitions
 *
 * @example
 * ```tsx
 * <AnimatedGrid columns={2} gap="md" staggerEntrance>
 *   {filteredItems.map(item => (
 *     <GridItem key={item.id}>
 *       <ProjectCard project={item} />
 *     </GridItem>
 *   ))}
 * </AnimatedGrid>
 * ```
 */
const AnimatedGrid = forwardRef<HTMLDivElement, AnimatedGridProps>(
    (
        {
            children,
            columns = 2,
            gap = 'md',
            layoutAnimation = true,
            staggerDelay = 0.05,
            staggerEntrance = true,
            duration = 0.4,
            layoutId,
            className = '',
            disableAnimations = false,
        },
        ref
    ) => {
        // Build class names
        const gridClasses = [
            styles.animatedGrid,
            styles[`columns-${columns}`],
            styles[`gap-${gap}`],
            className,
        ]
            .filter(Boolean)
            .join(' ');

        // Customize variants with props
        const customContainerVariants: Variants = {
            ...containerVariants,
            visible: {
                opacity: 1,
                transition: {
                    staggerChildren: staggerDelay,
                    delayChildren: 0.1,
                },
            },
        };

        const customItemVariants: Variants = {
            ...itemVariants,
            visible: {
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                    duration,
                    ease: [0.19, 1, 0.22, 1],
                },
            },
        };

        // If animations disabled, render plain grid
        if (disableAnimations) {
            return (
                <div ref={ref} className={gridClasses}>
                    {children}
                </div>
            );
        }

        // Wrap children in motion divs
        const wrappedChildren = Children.map(children, (child, index) => {
            if (!isValidElement(child)) return child;

            // Get key from child or use index
            const key = child.key || `grid-item-${index}`;

            return (
                <motion.div
                    key={key}
                    className={styles.gridItem}
                    variants={customItemVariants}
                    layout={layoutAnimation}
                    layoutId={layoutAnimation ? `${layoutId || 'grid'}-item-${key}` : undefined}
                    exit="exit"
                >
                    {child}
                </motion.div>
            );
        });

        const gridContent = (
            <motion.div
                ref={ref}
                className={gridClasses}
                variants={staggerEntrance ? customContainerVariants : undefined}
                initial={staggerEntrance ? 'hidden' : false}
                animate={staggerEntrance ? 'visible' : undefined}
            >
                <AnimatePresence mode="popLayout">
                    {wrappedChildren}
                </AnimatePresence>
            </motion.div>
        );

        // Wrap in LayoutGroup for coordinated animations
        if (layoutAnimation) {
            return <LayoutGroup id={layoutId}>{gridContent}</LayoutGroup>;
        }

        return gridContent;
    }
);

AnimatedGrid.displayName = 'AnimatedGrid';

export default AnimatedGrid;

export { AnimatedGrid };

// ==========================================================================
// GridItem Component (optional wrapper for explicit control)
// ==========================================================================

export interface GridItemProps {
    children: ReactNode;
    /** Span multiple columns */
    colSpan?: 1 | 2 | 3 | 4;
    /** Additional CSS class name */
    className?: string;
}

/**
 * GridItem - Optional wrapper for grid items with column spanning.
 */
export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
    ({ children, colSpan, className = '' }, ref) => {
        const itemClasses = [
            styles.gridItemWrapper,
            colSpan && styles[`colSpan-${colSpan}`],
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div ref={ref} className={itemClasses}>
                {children}
            </div>
        );
    }
);

GridItem.displayName = 'GridItem';
