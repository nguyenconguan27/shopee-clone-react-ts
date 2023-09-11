import { useState, useRef, ReactNode } from 'react'
import { useFloating, autoUpdate, flip, shift, arrow, FloatingPortal, offset, type Placement } from '@floating-ui/react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  children: ReactNode
  popover: ReactNode
  className?: string
  placement: Placement
  offsetFix?: number
}

export default function Popover({ children, popover, className, placement, offsetFix }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const arrowEl = useRef<HTMLElement>(null)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { refs, context, middlewareData } = useFloating({
    placement: placement,
    middleware: [
      flip(),
      shift(),
      offset(offsetFix),
      arrow({
        element: arrowEl
      })
    ],
    whileElementsMounted: autoUpdate
  })

  const showToolTip = () => {
    setIsOpen(true)
  }

  const hideToolTip = () => {
    setIsOpen(false)
  }
  return (
    <div className={className} ref={refs.setReference} onMouseEnter={showToolTip} onMouseLeave={hideToolTip}>
      {/* <FloatingPortal>
    {isOpen && (
      <div ref={refs.setFloating} style={floatingStyles}>
        <span
          // mũi trên chỉ là một khối có kích thước 0 0. sau đó cho border vào
          className='absolute translate-y-[-95%] border-[10px] border-x-transparent border-t-transparent border-b-white'
          ref={arrowEl}
          style={{
            left: middlewareData.arrow?.x,
            top: middlewareData.arrow?.y
          }}
        />
      </div>
    )}
  </FloatingPortal> */}
      {children}
      <FloatingPortal>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={refs.setFloating}
              style={{
                left: context.x ?? 0,
                top: context.y ?? 0,
                position: context.strategy,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`
              }}
              className='bg-white text-black shadow-lg rounded-sm px-3'
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span
                // mũi trên chỉ là một khối có kích thước 0 0. sau đó cho border vào
                className='absolute translate-y-[-95%] border-[10px] border-x-transparent border-t-transparent border-b-white'
                ref={arrowEl}
                style={{
                  left: middlewareData.arrow?.x ?? 0,
                  top: middlewareData.arrow?.y ?? 0
                }}
              />
              {popover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </div>
  )
}
