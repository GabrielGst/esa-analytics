"use client";

import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button, type DrawerProps } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Container } from '@mantine/core';


type CustomModalProps = React.PropsWithChildren<DrawerProps>;

export function CustomDrawer({ children, ...props }: CustomModalProps) {
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
      <Drawer 
        {...props}
      >
        {children}
      </Drawer>
    </Container>
  );
}