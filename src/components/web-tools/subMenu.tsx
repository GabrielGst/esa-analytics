import { Menu, Button, Text } from '@mantine/core';
import { IconSettings, IconSearch, IconPhoto, IconMessageCircle, IconTrash, IconArrowsLeftRight } from '@tabler/icons-react';

import { modules, menuType } from './customNavBar';

type props = {
  target: string,
  subMenu: modules[] | menuType,
}


const isModulesArray = (val: any): val is modules[] => {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    typeof val[0] === 'object' &&
    'title' in val[0] &&
    'href' in val[0] &&
    'description' in val[0]
  );
};


export default function SubMenu({
  target,
  subMenu
}: props) {

  let dropdownContent;

  if (isModulesArray(subMenu)) {
    // console.log('stage 1: ' + subMenu[0].title)
    dropdownContent = (
      <Menu.Dropdown>
        {
          subMenu.map((item) => (
            <div key={item.href}>
              {
                <a key={item.href} href={item.href}>
                  <Menu.Item className="prose prose-h4:!mt-0 prose-h4:!mb-0 prose-p:!mt-0 prose-p:!mb-0 prose-p:italic custom-prose">
                    <h4>
                      {item.title}
                    </h4>
                    <p>
                      {item.description}
                    </p>
                  </Menu.Item>
                </a>
              }
              {/* <Menu.Divider /> */}
            </div>
          ))
        }
      </Menu.Dropdown>
    )
  } else {
    dropdownContent = (
      <Menu.Dropdown className='p-4'>
        {
          Object.entries(subMenu).map(([key, value]) => {
            if (isModulesArray(value)) {
              // console.log('stage 2: ' + value[0].title)
              return (
                <div key={key}>
                  <Menu.Label key={key}>{key}</Menu.Label>
                  {
                    value.map((item: modules) => (
                      <a key={item.href} href={item.href}>
                        {/* icon={<IconSettings size={14} />} */}
                        <Menu.Item className="prose prose-h4:!mt-0 prose-h4:!mb-0 prose-p:!mt-0 prose-p:!mb-0 prose-p:italic custom-prose">
                          <h4>
                            {item.title}
                          </h4>
                          <p>
                            {item.description}
                          </p>
                        </Menu.Item>
                      </a>
                    ))
                  }
                  {/* <Menu.Divider /> */}
                </div>
              )
            }
          })
        }
      </Menu.Dropdown>
    )
  }

  return (
    <div>
      <Menu shadow="md" width={400}>
        <Menu.Target>
          <Button bg='black'>{target}</Button>
        </Menu.Target>
        {dropdownContent}
      </Menu>
    </div>
  );
}