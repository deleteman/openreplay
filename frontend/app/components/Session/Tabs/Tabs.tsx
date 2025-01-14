import React from 'react';
import cn from 'classnames';
import stl from './tabs.module.css';

interface Props {
    tabs: Array<any>;
    active: string;
    onClick: (key: any) => void;
    border?: boolean;
    className?: string;
}

const Tabs = ({ tabs, active, onClick, border = true, className }: Props) => {
  console.log(tabs) 
  return (
  <div className={  cn(stl.tabs, className, { [ stl.bordered ]: border }) } role="tablist" >
    { tabs.map(({ key, text, hidden = false, disabled = false }) => (
      <div
        key={ key }
        className={ cn(stl.tab, { [ stl.active ]: active === key, [ stl.disabled ]: disabled }) }
        data-hidden={ hidden }
        onClick={ onClick && (() => onClick(key)) }
        role="tab"
        data-openreplay-label={text}
      >
        { text }
      </div>
    ))}
  </div>
)
    }

Tabs.displayName = 'Tabs';

export default Tabs;
