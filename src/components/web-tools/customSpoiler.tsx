// This was defined for the mantine react table to not render a button within a button (HTML breakup)

import { useState } from 'react';
import { Text } from '@mantine/core';

export default function CustomSpoiler({ children, maxHeight = 200 }: { children: React.ReactNode; maxHeight?: number }) {
  const [opened, setOpened] = useState(false);

  return (
    <div>
      <div
        style={{
          maxHeight: opened ? 'none' : maxHeight,
          overflow: 'hidden',
          transition: 'max-height 200ms ease',
        }}
      >
        {children}
      </div>
      
      <div className='text-blue-400 cursor-pointer select-none'>
        <Text
          component="span"
          onClick={() => setOpened(!opened)}
          
          // style={{ color: 'blue', opacity: '40', cursor: 'pointer', userSelect: 'none' }}
        >
          {opened ? 'Hide' : 'Show more'}
        </Text>

      </div>
    </div>
  );
}