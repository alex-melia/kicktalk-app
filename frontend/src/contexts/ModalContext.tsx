import React, {
  ReactElement,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react"

interface ModalProviderProps {
  children: ReactNode
}

interface ModalContextType {
  modals: ReactNode[]
  showModal: (modal: ReactElement) => void
  hideModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider")
  }
  return context
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modals, setModals] = useState<ReactElement[]>([])

  const showModal = (modal: ReactElement) => {
    setModals((modals) => [...modals, modal])
  }

  const hideModal = () => {
    setModals((modals) => modals.slice(0, modals.length - 1))
  }

  return (
    <ModalContext.Provider value={{ modals, showModal, hideModal }}>
      {children}
      {modals.map((modal, index) => React.cloneElement(modal, { key: index }))}
    </ModalContext.Provider>
  )
}
