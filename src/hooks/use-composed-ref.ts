"use client"

import { useCallback, useRef } from "react"

// basically Exclude<React.ClassAttributes<T>["ref"], string>
type UserRef<T> =
  | ((instance: T | null) => void)
  | React.RefObject<T | null>
  | null
  | undefined

const updateRef = <T>(ref: NonNullable<UserRef<T>>, value: T | null) => {
  if (typeof ref === "function") {
    ref(value)
  } else if (ref && typeof ref === "object" && "current" in ref) {
    // Safe assignment without MutableRefObject
    ;(ref as { current: T | null }).current = value
  }
}

export const useComposedRef = <T extends HTMLElement>(
  libRef: React.RefObject<T | null>,
  userRef: UserRef<T>
) => {
  const prevUserRefRef = useRef<UserRef<T>>(null)

  return useCallback(
    (instance: T | null) => {
      if (libRef && "current" in libRef) {
        // This is safe - we're updating the ref's current property, not the ref itself
        // eslint-disable-next-line react-hooks/immutability, @typescript-eslint/no-explicit-any
        (libRef as any).current = instance
      }

      if (prevUserRefRef.current) {
        updateRef(prevUserRefRef.current, null)
      }

      // This is safe - we're updating the ref, not a prop
      // eslint-disable-next-line react-hooks/immutability
      prevUserRefRef.current = userRef

      if (userRef) {
        updateRef(userRef, instance)
      }
    },
    [libRef, userRef]
  )
}

export default useComposedRef
