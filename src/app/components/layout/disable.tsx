import { JSX } from "solid-js";

interface DisableProps {
    disabled?: boolean;
    children: JSX.Element;
  }
  
  export function Disable(props: DisableProps & any) {
    const handleClick = (e: MouseEvent) => {
      if (props.disabled) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
  
    return (
      <div 
        onClick={handleClick} 
        style={{ 
          opacity: props.disabled ? "0.6" : "1",
          "pointer-events": props.disabled ? "none" : "auto",
          cursor: props.disabled ? "not-allowed" : "inherit"
        }}
      >
        {props.children}
      </div>
    );
  }