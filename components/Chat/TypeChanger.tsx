import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Radio,
  Typography,
} from '@material-tailwind/react';
import { useState } from 'react';

export default function TypeChanger() {
  const [selectedValue, setSelectedValue] = useState(null);

  const handleRadioChange = (event: any) => {
    setSelectedValue(event.target.value);
  };

  return (
    <Card className="w-full max-w-[24rem]">
      <List className="flex-row">
        <ListItem className="p-0">
          <label
            htmlFor="horizontal-list-react"
            className="px-3 py-2 flex items-center w-full cursor-pointer"
          >
            <ListItemPrefix className="mr-3">
              <Radio
                name="horizontal-list"
                id="horizontal-list-react"
                value="react"
                ripple={false}
                className="hover:before:opacity-0"
                containerProps={{
                  className: 'p-0',
                }}
                checked={selectedValue === 'react'}
                onChange={(value) => handleRadioChange}
              />
            </ListItemPrefix>
            <Typography color="blue-gray" className="font-medium">
              React.js
            </Typography>
          </label>
        </ListItem>
        <ListItem className="p-0">
          <label
            htmlFor="horizontal-list-vue"
            className="px-3 py-2 flex items-center w-full cursor-pointer"
          >
            <ListItemPrefix className="mr-3">
              <Radio
                name="horizontal-list"
                id="horizontal-list-vue"
                value="vue"
                ripple={false}
                className="hover:before:opacity-0"
                containerProps={{
                  className: 'p-0',
                }}
                checked
              />
            </ListItemPrefix>
            <Typography color="blue-gray" className="font-medium">
              Vue.js
            </Typography>
          </label>
        </ListItem>
      </List>
    </Card>
  );
}
