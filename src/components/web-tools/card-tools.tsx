import { Card, Image, Text, Badge, Button, Group, Spoiler } from '@mantine/core';

type Props = {
  cover: string,
  title: string,
  state: string,
  security: string,
  description: string,
  link: string,
  button_text?: string,
}


export default function CardTool({
  cover,
  title,
  state,
  security,
  description,
  link,
  button_text
}: Props) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section component="a" href={link}>
        <Image
          src={cover}
          height={160}
          alt="Tool Cover Picture"
        />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{title}</Text>
        <div className='flex flex-row-reverse'>
          <Badge color="green" variant="outline" className='m-2'>
            {state}
          </Badge>
          <Badge color="red" variant="filled" className='m-2'>
            {security}
          </Badge>
        </div>
      </Group>

    <Spoiler maxHeight={100} showLabel="Show more" hideLabel="Hide">
      <Text size="sm" color="dimmed" className='h-50'>
        {description}
      </Text>
    </Spoiler>



      <Button variant="light" color="blue" fullWidth mt="md" radius="md" component='a' href={link}>
        {button_text ?? "Onboarding tour"}
      </Button>
    </Card>
  );
}