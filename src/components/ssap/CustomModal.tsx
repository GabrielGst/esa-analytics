"use client";

import { useDisclosure } from '@mantine/hooks';
import { Modal, ModalProps  } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Portal } from '@mantine/core';
import { IconAt } from '@tabler/icons-react';
import { Container } from '@mantine/core';


type CustomModalProps = React.PropsWithChildren<ModalProps>;

export default function CustomModal({ children, ...props }: CustomModalProps) {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Avoid SSR issues
    if (typeof window !== 'undefined') {
      const target = document.querySelector('#modal-root');
      if (target instanceof HTMLElement) {
        setTargetElement(target);
      } else {
        setTargetElement(document.body); // fallback
      }
    }
  }, []);

  // Don't render modal until target is available (client-side only)
  if (!targetElement) return null;


  return (
    <Container fluid>
      <Modal
        {...props}
        target={targetElement}
      >
        {children}
      </Modal>
    </Container>
  );
}