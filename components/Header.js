import Link from 'next/link';
import { Menu } from 'semantic-ui-react';

import classes from './Header.module.css';

const Header = () => {
  return (
    <Menu className={classes.menu}>
      <Link href="/">
        <Menu.Item>Crowd Coin</Menu.Item>
      </Link>
      <Menu.Menu position="right">
        <Link href="/">
          <Menu.Item>Campaigns</Menu.Item>
        </Link>
        <Link href="/campaigns/new">
          <Menu.Item>+</Menu.Item>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
